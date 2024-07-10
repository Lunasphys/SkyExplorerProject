<template>
  <div class="container">
    <div v-if="userRole === 'admin'" class="student-list">
      <div
        v-for="student in students"
        :key="student._id"
        @click="selectStudent(student._id)"
        class="student-item"
      >
        <span> {{ student.first_name }} {{ student.last_name }}</span>
      </div>
    </div>
    <h1>Informations sur les Cours de Vol de {{ userName }}</h1>
    <table>
      <div v-for="course in courses" :key="course._id" class="course-item">
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>Durée (en heures)</th>
            <th>Factures</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ course.type }}</td>
            <td>{{ course.day }}</td>
            <td>{{ course.duration }}</td>
            <td v-for="bill in bills" :key="bill._id" class="bill-item">
              {{ bill.pdf }}
            </td>
          </tr>
        </tbody>
      </div>
    </table>
    <div class="bill" v-if="userRole === 'admin'">
      <button @click="openModal(studentId)">Etablir une facture</button>
    </div>
    <Billing
      v-if="isModalOpen"
      :users="users"
      :role="userRole"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters, useStore } from 'vuex'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Billing from '@/pages/Billing.vue'

export default {
  name: 'StudentProgress',
  components: { Billing },
  data() {
    return {
      localStudentId: this.studentId,
    }
  },
  computed: {
    ...mapGetters([
      'userRole',
      'students',
      'studentId',
      'userName',
      'courses',
      'leisures',
      'user',
      'userRole',
      'events',
    ]),
    canOpenModal() {
      return this.userRole === 'admin'
    },
  },
  methods: {
    ...mapActions(['fetchStudents']),
    async selectStudent(studentId) {
      this.localStudentId = studentId
      await this.fetchStudents(studentId)
    },
    async openModal(studentId) {
      if (this.canOpenModal) {
        this.isModalOpen = true
        this.localStudentId = studentId
        await this.fetchStudents(studentId)
      } else {
        alert('You cannot access this page')
      }
    },
    async closeModal() {
      this.isModalOpen = false
      await this.fetchUserEvents()
    },
  },
  created() {
    this.fetchStudents()
  },
  setup() {
    const store = useStore()
    const selectedUser = ref('')
    const users = ref([])
    const userName = ref(store.getters.userName)
    const events = ref(store.getters.events)
    const currentUserId = ref(store.getters.currentUserId)
    const role = ref(store.getters.userRole)
    const studentId = ref(store.getters.studentId)
    const courses = ref(store.getters.courses)
    const leisures = ref(store.getters.leisures)
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
      courses.value = store.getters.courses
      leisures.value = store.getters.leisures
      studentId.value = store.getters.studentId
      await fetchUserEvents()
    })
    return {
      role,
      userName,
      currentUserId,
      selectedUser,
      users,
      events,
      studentId,
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
  width: 100vw;
}

th {
  background-color: #f2f2f2;
}

.bill {
  text-align: center;
  margin-top: 20px;
}
</style>
