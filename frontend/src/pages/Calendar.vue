<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevWeek" class="nav-button">Previous</button>
      <h2>{{ formattedWeek }}</h2>
      <button @click="nextWeek" class="nav-button">Next</button>
    </div>
    <h1>{{ userRole }}</h1>
    <div v-if="userRole === 'admin'" class="professors-list">
      <div
        v-for="professor in professors"
        :key="professor._id"
        @click="selectProfessor(professor._id)"
        class="professor-item"
      >
        {{ professor.first_name }} {{ professor.last_name }}
      </div>
      <div @click="allEvents" class="professor-item">All</div>
      <div @click="allEventOfTypesCourse" class="professor-item">Cours</div>
      <div @click="allEventOfTypesLeisure" class="professor-item">Loisir</div>
    </div>
    <div class="week">
      <div class="hours-column">
        <div class="hour-slot empty-slot"></div>
        <div v-for="hour in hours" :key="hour" class="hour-slot">
          {{ hour }}
        </div>
      </div>
      <div v-for="day in weekDays" :key="day" class="day-column">
        <h3>{{ format(day, 'EEEE') }}</h3>
        <div
          v-for="hour in hours"
          :key="hour"
          class="hour-slot"
          :class="getEventClass(day, hour)"
          :style="getEventStyle(day, hour)"
        >
          <span
            @click="
              getEvent(day, hour).title
                ? editEvent(getEvent(day, hour))
                : openModal(day, hour)
            "
            class="event-title"
          >
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
      :event="selectedEvent"
      @close="closeModal"
      @save="handleSaveEvent"
      @delete="handleDeleteEvent"
      @update="handleUpdateEvent"
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
  data() {
    return {
      localProfessorId: this.professorId,
      courseLocalType: this.courses,
      leisureLocalType: this.leisures,
      selectedEvent: null,
      selectedDay: '',
      selectedHour: '',
      isModalOpen: false,
    }
  },
  computed: {
    ...mapGetters([
      'students',
      'events',
      'userRole',
      'currentUserId',
      'professors',
      'professorId',
      'courses',
      'leisures',
    ]),
    canOpenModal() {
      return this.userRole === 'admin' || this.userRole === 'professor'
    },
  },
  methods: {
    format,
    ...mapActions([
      'fetchStudents',
      'fetchEvents',
      'fetchProfessors',
      'addEvent',
      'getAvailablePlanes',
      'fetchEventsByType',
    ]),
    async openModal(day, hour) {
      if (this.canOpenModal) {
        this.selectedDay = format(day, 'yyyy-MM-dd')
        const selectedHour = parseInt(hour.split(':')[0], 10)
        this.selectedHour = `${selectedHour}:00`
        this.isModalOpen = true
        this.selectedEvent = null
      } else {
        alert('You cannot create events')
      }
    },
    async closeModal() {
      this.isModalOpen = false
      this.selectedEvent = null
      this.selectedDay = ''
      this.selectedHour = ''
      await this.fetchUserEvents()
    },
    async editEvent(event) {
      if (this.canOpenModal) {
        this.selectedEvent = event
        this.selectedDay = event.day
        this.selectedHour = event.hour
        this.isModalOpen = true
      } else {
        alert('You cannot edit events')
      }
    },
    async selectProfessor(professorId) {
      this.localProfessorId = professorId
      await this.fetchEventsForProfessor(professorId)
    },
    async allEvents() {
      await this.fetchUserEvents()
    },
    async allEventOfTypesCourse() {
      await this.fetchEventsByType('course')
    },
    async allEventOfTypesLeisure() {
      await this.fetchEventsByType('leisure')
    },
  },
  created() {
    this.fetchStudents()
    this.fetchEvents()
    this.fetchProfessors()
  },
  setup() {
    const store = useStore()
    const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }))
    const hours = ref(Array.from({ length: 13 }, (_, i) => `${i + 7}:00`))
    const selectedUser = ref('')
    const courses = ref(store.getters.courses)
    const leisures = ref(store.getters.leisures)
    const users = ref([])
    const events = ref(store.getters.events)
    const currentUserId = ref(store.getters.currentUserId)
    const role = ref(store.getters.userRole)
    const professorId = ref(store.getters.professorId)

    const weekDays = computed(() => {
      return Array.from({ length: 7 }, (_, i) =>
        addDays(currentWeekStart.value, i),
      )
    })

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
        const startHour = parseInt(hour.split(':')[0])
        if (startHour < 7 || startHour >= 20) {
          return { display: 'none' }
        }
        const topPosition = (startHour - hour) * 40
        return {
          top: `${topPosition}px`,
          height: `${event.duration * 40}px`,
          left: 'auto',
          right: 'auto',
          alignItems: 'center',
        }
      }
      return {}
    }

    const handleSaveEvent = (event) => {
      events.value.push(event)
    }
    const handleDeleteEvent = (eventId) => {
      events.value = events.value.filter((event) => event._id !== eventId)
    }
    const handleUpdateEvent = (event) => {
      const index = events.value.findIndex((e) => e._id === event._id)
      events.value[index] = event
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
    const fetchEventsByType = async (type) => {
      console.log(`Fetching events of type: ${type}`)
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await axios.get(
          `http://localhost:5000/api/events/type/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log('Fetched events:', response.data)
        events.value = response.data
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    const fetchEventsForProfessor = async (professorId) => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await axios.get(
          `http://localhost:5000/api/events/professor/${professorId}`,
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

    onMounted(async () => {
      await store.dispatch('fetchUser')
      await store.dispatch('fetchStudents')
      await store.dispatch('fetchEvents')
      professorId.value = store.getters.professorId
      leisures.value = store.getters.leisures
      courses.value = store.getters.courses
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
      handleSaveEvent,
      handleDeleteEvent,
      handleUpdateEvent,
      role,
      currentUserId,
      selectedUser,
      users,
      events,
      fetchUserEvents,
      nextWeek,
      prevWeek,
      professorId,
      courses,
      leisures,
      fetchEventsForProfessor,
      fetchEventsByType,
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
  max-width: 1600px;
  margin-top: 5%;
  margin-right: auto;
  margin-left: auto;
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
  overflow-x: scroll;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hours-column {
  flex: 0 0 50px;
  border-right: 1px solid #eaeaea;
  padding: 10px;
  display: grid;
  grid-template-rows: repeat(14, 40px);
  text-align: center;
  font-weight: bold;
}

.hour-slot.empty-slot {
  border: none;
  background: transparent;
}

.day-column {
  flex: 1;
  border-right: 1px solid #eaeaea;
  padding: 10px;
  display: grid;
  grid-template-rows: repeat(14, 40px);
  position: relative;
}

.day-column:last-child {
  border-right: none;
}

.hour-slot {
  border-top: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  position: relative;
}

.hour-slot:hover {
  background: #f1f1f1;
}

.event-title {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 100%;
  border-radius: 10px;
  transition: background 0.3s, color 0.3s;
  position: absolute;
  left: 0;
  right: 0;
  font-size: 12px;
}

.professors-list {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
}

.professor-item {
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #007bff;
  border-radius: 5px;
  margin: 5px 0;
  background-color: #f9f9f9;
  color: #007bff;
  transition: background-color 0.3s, color 0.3s;
}

.professor-item:hover {
  background-color: #007bff;
  color: #fff;
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
