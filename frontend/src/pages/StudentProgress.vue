<template>
  <div class="container">
    <h1>Informations sur les Cours de Vol de {{ userName }}</h1>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Date</th>
          <th>Durée (en heures)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>type</td>
          <td>date</td>
          <td>duration</td>
        </tr>
      </tbody>
    </table>
    <div class="bill" v-if="userRole === 'admin'">
      <button>
        <router-link to="/billing" key="billing"
          >Etablir une facture
        </router-link>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { use } from 'bcrypt/promises'

export default {
  name: 'StudentProgress',
  computed: {
    ...mapGetters(['userRole', 'students']),
    canGenerateBill() {
      return this.userRole === 'admin' || this.userRole === 'professor'
    },
  },
  methods: {
    use,
    async generateBill() {
      const billSection = document.querySelector('.bill')
      // Check if user is authorized to generate bill
      if (!this.canGenerateBill) {
        //Display none
        billSection.style.display = 'none'
      } else {
        // Display block
        billSection.style.display = 'block'
      }
    },
  },
  setup() {
    const store = useStore()
    const selectedUser = ref('')
    const users = ref([])
    const userName = ref(store.getters.userName)
    const events = ref(store.getters.events)
    const currentUserId = ref(store.getters.currentUserId)
    const role = ref(store.getters.userRole)
    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('Token not found')
        }
        const userId = selectedUser.value || currentUserId.value
        const response = await axios.get(
          `http://localhost:5000/api/events/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        events.value = response.data
      } catch (error) {
        console.error('Fetch user events error:', error)
      }
    }
    const fetchEventsByType = async (type) => {
      console.log(`Fetching events of type: ${type}`)
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('Token not found')
        }
        const response = await axios.get(
          `http://localhost:5000/api/events/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log('Fetch events:', response.data)
        events.value = response.data
      } catch (error) {
        console.error('Error fetching events', error)
      }
    }
    onMounted(async () => {
      await store.dispatch('fetchUser')
      await store.dispatch('fetchStudents')
      await store.dispatch('fetchEvents')
      currentUserId.value = store.getters.currentUserId
      role.value = store.getters.userRole
      users.value = store.getters.user
      userName.value = store.getters.userName
      await fetchUserEvents()
    })
    return {
      role,
      userName,
      currentUserId,
      selectedUser,
      users,
      events,
      fetchUserEvents,
      fetchEventsByType,
    }
  },
}
</script>

<style scoped>
/* Styles for Student Progress */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.bill {
  text-align: center;
  margin-top: 20px;
}
</style>
