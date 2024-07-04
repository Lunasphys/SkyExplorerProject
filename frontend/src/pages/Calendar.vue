<template>
  <div class="calendar">
    <div class="header">
      <button @click="prevWeek">Previous</button>
      <h2>{{ formattedWeek }}</h2>
      <button @click="nextWeek">Next</button>
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
          <span @click="openModal(day, hour)" class="event-title">{{
            getEvent(day, hour)
          }}</span>
          <span
            v-if="getEvent(day, hour)"
            @click="handleDelete(day, hour)"
            class="delete-icon"
            >🗑️</span
          >
        </div>
      </div>
    </div>
    <EventModal
      v-if="isModalOpen"
      :day="selectedDay"
      :hour="selectedHour"
      @close="closeModal"
      @save="addEvent"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns'
import EventModal from '@/components/EventModal.vue'
import store from '@/store'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Calendar',
  methods: { format },
  components: {
    EventModal,
  },
  setup() {
    const today = new Date()
    const currentWeekStart = ref(startOfWeek(today, { weekStartsOn: 1 }))
    const isModalOpen = ref(false)
    const selectedDay = ref('')
    const selectedHour = ref('')
    const weekDays = computed(() => {
      return Array.from({ length: 7 }, (_, i) =>
        addDays(currentWeekStart.value, i),
      )
    })

    const hours = ref(Array.from({ length: 24 }, (_, i) => `${i}:00`))
    const events = computed(() => store.getters.events)
    const user = computed(() => store.getters.user)
    // const fetchEvents = () => store.dispatch('fetchEvents')
    const addEvent = (event) => store.dispatch('addEvent', event)
    const deleteEvent = (eventId) => store.dispatch('deleteEvent', eventId)

    const formattedWeek = computed(() => {
      const endOfWeek = addDays(currentWeekStart.value, 6)
      return `${format(currentWeekStart.value, 'MMMM do')} - ${format(
        endOfWeek,
        'MMMM do, yyyy',
      )}`
    })

    const openModal = (day, hour) => {
      console.log('Opening modal for', day, hour) // Pour débogage
      selectedDay.value = day
      selectedHour.value = hour
      isModalOpen.value = true
    }

    const closeModal = () => {
      isModalOpen.value = false
    }

    const addEventToCalendar = (event) => {
      addEvent(event)
      closeModal()
    }

    const getEvent = (day, hour) => {
      const event = events.value.find(
        (e) => e.day === format(day, 'yyyy-MM-dd') && e.hour === hour,
      )
      return event ? event.title : ''
    }

    const getEventClass = (day, hour) => {
      const event = events.value.find(
        (e) => e.day === format(day, 'yyyy-MM-dd') && e.hour === hour,
      )
      return event ? (event.type === 'course' ? 'course' : 'leisure') : ''
    }

    const getEventStyle = (day, hour) => {
      const event = events.value.find(
        (e) => e.day === format(day, 'yyyy-MM-dd') && e.hour === hour,
      )
      if (event) {
        return {
          gridRowEnd: `span ${event.duration * 2}`,
        }
      }
      return {}
    }

    const handleDelete = (day, hour) => {
      const event = events.value.find(
        (e) => e.day === format(day, 'yyyy-MM-dd') && e.hour === hour,
      )
      if (event) {
        deleteEvent(event._id)
      }
    }

    const prevWeek = () => {
      currentWeekStart.value = subWeeks(currentWeekStart.value, 1)
      // fetchEvents()
    }

    const nextWeek = () => {
      currentWeekStart.value = addWeeks(currentWeekStart.value, 1)
      // fetchEvents()
    }

    // fetchEvents()

    return {
      weekDays,
      hours,
      events,
      user,
      isModalOpen,
      selectedDay,
      selectedHour,
      formattedWeek,
      openModal,
      closeModal,
      addEvent: addEventToCalendar,
      getEvent,
      getEventClass,
      getEventStyle,
      handleDelete,
      prevWeek,
      nextWeek,
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
