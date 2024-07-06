<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevWeek" class="nav-button">Previous</button>
      <h2>{{ formattedWeek }}</h2>
      <button @click="nextWeek" class="nav-button">Next</button>
    </div>
    <h1>{{ userRole }}</h1>
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
            {{
              getEvent(day, hour).type === 'course'
                ? '📚'
                : getEvent(day, hour).type === 'leisure'
                ? '🌴'
                : ''
            }}
            {{
              getEvent(day, hour).student
                ? `(${getEvent(day, hour).student.first_name})`
                : ''
            }}
            {{
              getEvent(day, hour).professor
                ? `(${getEvent(day, hour).professor.first_name})`
                : ''
            }}
            {{
              getEvent(day, hour).plane
                ? `(${getEvent(day, hour).plane.name})`
                : ''
            }}
          </span>
        </div>
      </div>
    </div>
    <EventModal
      v-if="isModalOpen"
      :day="selectedDay"
      :hour="selectedHour"
      :users="users"
      :role="userRole"
      :professor-id="currentUserId"
      @close="closeModal"
      @save="handleSaveEvent"
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
  components: {
    EventModal,
  },
  computed: {
    ...mapGetters(['students', 'events', 'userRole', 'currentUserId']),
    canOpenModal() {
      return this.userRole === 'admin' || this.userRole === 'professor'
    },
  },
  methods: {
    format,
    ...mapActions([
      'fetchStudents',
      'fetchEvents',
      'addEvent',
      'getAvailablePlanes',
    ]),
    async openModal(day, hour) {
      if (this.canOpenModal) {
        this.selectedDay = format(day, 'yyyy-MM-dd')
        this.selectedHour = hour
        this.isModalOpen = true
      } else {
        alert('You cannot create events')
      }
    },
  },
  setup() {
    const store = useStore()
    const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }))
    const isModalOpen = ref(false)
    const selectedDay = ref('')
    const selectedHour = ref('')
    const selectedUser = ref('')
    const users = ref([])
    const events = ref(store.getters.events)
    const currentUserId = ref(store.getters.currentUserId)
    const role = ref(store.getters.userRole)

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
          height: `${event.duration * 40}px`,
        }
      }
      return {}
    }

    const closeModal = () => {
      fetchUserEvents()
      isModalOpen.value = false
    }

    const handleSaveEvent = (event) => {
      events.value.push(event)
    }

    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const userId = selectedUser.value || currentUserId.value
        console.log('Fetching events for user:', userId)
        const response = await axios.get(
          `http://localhost:5000/api/events?user=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        events.value = response.data
        console.log('Fetched events:', events.value)
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

    onMounted(async () => {
      await store.dispatch('fetchUser')
      await store.dispatch('fetchStudents')
      await store.dispatch('fetchEvents')
      currentUserId.value = store.getters.currentUserId
      role.value = store.getters.userRole
      await fetchUserEvents()
    })

    return {
      weekDays,
      hours,
      formattedWeek,
      getEvent,
      getEventClass,
      getEventStyle,
      closeModal,
      handleSaveEvent,
      isModalOpen,
      selectedDay,
      selectedHour,
      role,
      currentUserId,
      selectedUser,
      users,
      events,
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
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.nav-button {
  padding: 10px 20px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.nav-button:hover {
  background: #0056b3;
}

.week {
  display: flex;
  width: 100%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.day-column {
  flex: 1;
  border-right: 1px solid #eaeaea;
  padding: 10px;
  display: grid;
  grid-template-rows: repeat(24, 40px);
}

.day-column:last-child {
  border-right: none;
}

.day-column h3 {
  text-align: center;
  margin-bottom: 10px;
}

.hour-slot {
  border-top: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}

.hour-slot:hover {
  background: #f1f1f1;
}

.event-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background 0.3s, color 0.3s;
}

.event-title:hover {
  background: rgba(0, 123, 255, 0.1);
}

.event-course {
  background-color: #d9edf7;
  color: #31708f;
}

.event-leisure {
  background-color: #dff0d8;
  color: #3c763d;
}
</style>
