<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevWeek">Previous</button>
      <h2>{{ formattedWeek }}</h2>
      <button @click="nextWeek">Next</button>
    </div>
    <div>
      <h1>Liste des étudiants</h1>
      <ul>
        <li v-for="student in students" :key="student._id">
          {{ student.first_name }} {{ student.last_name }}
        </li>
      </ul>
    </div>
    <div v-if="role === 'admin'" class="user-selection">
      <label for="user">Select User:</label>
      <select id="user" v-model="selectedUser" @change="fetchUserEvents">
        <option v-for="user in users" :key="user._id" :value="user._id">
          {{ user.first_name }} {{ user.last_name }}
        </option>
      </select>
    </div>
    <div class="week">
      <div v-for="day in weekDays" :key="day" class="day-column">
        <h3>{{ format(day, 'EEEE') }}</h3>
        <div
          v-for="hour in hours"
          :key="hour"
          class="hour-slot"
          :class="getEventClass(day, hour)"
          :style="getEventStyle(day, hour)"
        >
          <span @click="openModal(day, hour)" class="event-title">
            {{ getEvent(day, hour).title || '' }}
          </span>
        </div>
      </div>
    </div>
    <EventModal
      v-if="isModalOpen"
      :day="selectedDay"
      :hour="selectedHour"
      :users="users"
      :role="role"
      :professor-id="currentUserId"
      @close="closeModal"
      @save="addEvent"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns'
import EventModal from '@/components/EventModal.vue'
import axios from 'axios'
import { mapActions, mapGetters, useStore } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Calendar',
  computed: {
    ...mapGetters(['students']),
  },
  methods: { format, ...mapActions(['fetchStudents']) },
  components: {
    EventModal,
  },
  created() {
    this.fetchStudents()
  },
  setup() {
    const store = useStore()
    const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }))
    const isModalOpen = ref(false)
    const selectedDay = ref('')
    const selectedHour = ref('')
    const role = ref(store.getters.userRole || '')
    const currentUserId = ref(store.getters.currentUserId || '')
    const selectedUser = ref('')
    const users = ref([])
    const events = ref([])
    const canCreateEvent = computed(
      () => role.value === 'admin' || role.value === 'professor',
    )

    const weekDays = computed(() => {
      return Array.from({ length: 7 }, (_, i) =>
        addDays(currentWeekStart.value, i),
      )
    })

    const hours = ref(Array.from({ length: 24 }, (_, i) => `${i}:00`))

    const formattedWeek = computed(() => {
      const start = format(currentWeekStart.value, 'MMMM d')
      const end = format(addDays(currentWeekStart.value, 6), 'MMMM d')
      return `${start} - ${end}`
    })

    const getEvent = (day, hour) => {
      const formattedDay = format(day, 'yyyy-MM-dd')
      return (
        events.value.find(
          (event) => event.day === formattedDay && event.hour === hour,
        ) || {}
      )
    }

    const getEventClass = (day, hour) => {
      const event = getEvent(day, hour)
      return event.type ? `event-${event.type}` : ''
    }

    const getEventStyle = (day, hour) => {
      const event = getEvent(day, hour)
      if (event.type) {
        return {
          backgroundColor: event.type === 'course' ? 'lightblue' : 'lightgreen',
          height: `${event.duration * 20}px`,
        }
      }
      return {}
    }

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        users.value = response.data
        console.log('Users fetched:', users.value)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const openModal = (day, hour) => {
      selectedDay.value = format(day, 'yyyy-MM-dd')
      selectedHour.value = hour
      isModalOpen.value = true
    }

    const closeModal = () => {
      isModalOpen.value = false
    }

    const addEvent = async (event) => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        console.log('Event to add:', event)
        const response = await axios.post(
          'http://localhost:5000/api/events',
          event,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log('Event added successfully:', response.data)
        await fetchUserEvents()
        closeModal()
      } catch (error) {
        console.error('Error adding event:', error)
      }
    }

    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const userId = selectedUser.value || currentUserId.value
        const response = await axios.get(
          `http://localhost:5000/api/events?user=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        events.value = response.data
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    const nextWeek = () => {
      currentWeekStart.value = addWeeks(currentWeekStart.value, 1)
      fetchUserEvents()
    }

    const prevWeek = () => {
      currentWeekStart.value = subWeeks(currentWeekStart.value, 1)
      fetchUserEvents()
    }

    onMounted(() => {
      fetchUsers()
      fetchUserEvents()
    })

    return {
      weekDays,
      hours,
      formattedWeek,
      getEvent,
      getEventClass,
      getEventStyle,
      openModal,
      closeModal,
      addEvent,
      isModalOpen,
      selectedDay,
      selectedHour,
      role,
      currentUserId,
      selectedUser,
      users,
      events,
      canCreateEvent,
      fetchUserEvents,
      nextWeek,
      prevWeek,
    }
  },
}
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.week {
  display: flex;
  width: 100%;
}

.day-column {
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  display: grid;
  grid-template-rows: repeat(24, 40px);
}

.hour-slot {
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.event-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
}

.delete-icon {
  color: red;
  cursor: pointer;
}

.course {
  background-color: blue;
  color: white;
}

.leisure {
  background-color: green;
  color: white;
}
</style>
