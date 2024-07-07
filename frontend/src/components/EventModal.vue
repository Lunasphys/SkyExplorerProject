<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Event Details</h2>
      <form @submit.prevent="saveEvent">
        <div>
          <label for="title">Title:</label>
          <input type="text" id="title" v-model="title" required />
        </div>
        <div>
          <label for="type">Type:</label>
          <select id="type" v-model="type" required>
            <option value="course">Course</option>
            <option value="leisure">Leisure</option>
          </select>
        </div>
        <div v-if="role === 'admin'">
          <label for="professor">Professor:</label>
          <select id="professor" v-model="localProfessorId" required>
            <option
              v-for="professor in professors"
              :key="professor._id"
              :value="professor._id"
            >
              {{ professor.first_name }} {{ professor.last_name }}
            </option>
          </select>
          <label for="student">Student:</label>
          <select id="student" v-model="studentId" required>
            <option
              v-for="student in students"
              :key="student._id"
              :value="student._id"
            >
              {{ student.first_name }} {{ student.last_name }}
            </option>
          </select>
        </div>
        <div v-if="role === 'professor'">
          <label for="professor">Professor:</label>
          <select id="professor" v-model="localProfessorId" required>
            <option
              v-for="professor in professors"
              :key="professor._id"
              :value="professor._id"
            >
              {{ professor.first_name }} {{ professor.last_name }}
            </option>
          </select>
          <label for="student">Student:</label>
          <select id="student" v-model="studentId" required>
            <option
              v-for="student in students"
              :key="student._id"
              :value="student._id"
            >
              {{ student.first_name }} {{ student.last_name }}
            </option>
          </select>
        </div>
        <div v-else-if="role !== 'admin' && role !== 'professor'">
          <label for="professor">Professor:</label>
          <select id="professor" v-model="localProfessorId" required>
            <option
              v-for="professor in professors"
              :key="professor._id"
              :value="professor._id"
            >
              {{ professor.first_name }} {{ professor.last_name }}
            </option>
          </select>
          <label for="student">Student:</label>
          <select id="student" v-model="studentId" required>
            <option
              v-for="student in students"
              :key="student._id"
              :value="student._id"
            >
              {{ student.first_name }} {{ student.last_name }}
            </option>
          </select>
        </div>
        <div>
          <label for="duration">Duration (hours):</label>
          <input
            type="number"
            id="duration"
            v-model="duration"
            min="1"
            required
          />
          <label for="plane">Plane:</label>
          <select id="plane" v-model="planeId" required>
            <option
              v-for="plane in planes"
              :key="plane._id"
              :value="plane._id"
              :disabled="!plane.available"
            >
              {{ plane.name }}
            </option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
      <div v-if="event">
        <button @click="handleDeleteEvent">Delete</button>
        <button @click="updateEvent">Update</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'EventModal',
  props: {
    day: {
      type: String,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    professorId: {
      type: String,
      default: '',
    },
    event: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      title: this.event ? this.event.title : '',
      type: this.event ? this.event.type : 'course',
      studentId: this.event ? this.event.student._id : '',
      duration: this.event ? this.event.duration : 1,
      localProfessorId: this.event
        ? this.event.professor._id
        : this.professorId,
      planeId: this.event ? this.event.plane._id : '',
      planes: [],
      eventId: this.event ? this.event._id : '',
    }
  },
  computed: {
    ...mapGetters(['professors', 'students']),
    isEditMode() {
      return !!this.event
    },
  },
  methods: {
    ...mapActions([
      'fetchProfessors',
      'fetchStudents',
      'addEvent',
      'deleteEvent',
      'updateEvent',
    ]),
    async saveEvent() {
      const event = {
        title: this.title,
        type: this.type,
        studentId: this.studentId,
        professorId: this.localProfessorId,
        day: this.day,
        hour: this.hour,
        duration: this.duration,
        planeId: this.planeId,
      }
      console.log('Event payload:', event)
      try {
        const response = await axios.post(
          'http://localhost:5000/api/events',
          event,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        )
        this.addEvent(response.data)
        this.$emit('save', response.data)
        this.closeModal()
      } catch (error) {
        console.error('Error adding event:', error.response?.data || error)
      }
    },
    async updateEvent() {
      const updatedEvent = {
        _id: this.event._id,
        title: this.title,
        type: this.type,
        studentId: this.studentId,
        professorId: this.localProfessorId,
        day: this.day,
        hour: this.hour,
        duration: this.duration,
        planeId: this.planeId,
      }
      try {
        const response = await axios.put(
          `http://localhost:5000/api/events/${this.event._id}`,
          updatedEvent,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        )
        this.$emit('update', response.data)
        this.closeModal()
      } catch (error) {
        console.error('Error updating event:', error.response?.data || error)
      }
    },
    async handleDeleteEvent() {
      try {
        const token = localStorage.getItem('authToken')
        await axios.delete(
          `http://localhost:5000/api/events/${this.event._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        this.$emit('delete', this.event._id)
        this.closeModal()
      } catch (error) {
        console.error('Error deleting event:', error.response?.data || error)
      }
    },
    async checkPlaneAvailability() {
      try {
        const { day, hour, duration } = this
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }

        const response = await axios.get(
          'http://localhost:5000/api/events/availablePlanes',
          {
            params: { day, hour, duration },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        this.planes = response.data
      } catch (error) {
        console.error('Error checking plane availability:', error.message)
      }
    },
    closeModal() {
      this.$emit('close')
    },
  },
  created() {
    this.fetchProfessors()
    this.fetchStudents()
    this.checkPlaneAvailability()
  },
  watch: {
    day() {
      this.checkPlaneAvailability()
    },
    hour() {
      this.checkPlaneAvailability()
    },
    duration() {
      this.checkPlaneAvailability()
    },
  },
}
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.close {
  display: flex;
  top: 10px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}
</style>
