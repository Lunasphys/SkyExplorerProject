<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
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
          <select id="professor" v-model="selectedProfessorId" required>
            <option
              v-for="user in professors"
              :key="user._id"
              :value="user._id"
            >
              {{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
          <label for="student">Student:</label>
          <select id="student" v-model="studentId" required>
            <option v-for="user in students" :key="user._id" :value="user._id">
              {{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
        </div>
        <div v-if="role === 'professor'">
          <label for="professor">Professor:</label>
          <select id="professor" v-model="selectedProfessorId" required>
            <option
              v-for="user in professors"
              :key="user._id"
              :value="user._id"
            >
              {{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
          <label for="student">Student:</label>
          <select id="student" v-model="studentId" required>
            <option v-for="user in students" :key="user._id" :value="user._id">
              {{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
        </div>
        <div v-else-if="role !== 'admin' && role !== 'professor'">
          <label for="professorName">Professor:</label>
          <input type="text" id="professorName" v-model="professorName" />
          <label for="student">Student:</label>
          <select id="student" v-model="studentId" required>
            <option v-for="user in students" :key="user._id" :value="user._id">
              {{ user.first_name }} {{ user.last_name }}
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
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
  },
  data() {
    return {
      title: '',
      type: 'course',
      studentId: '',
      duration: 1,
      selectedProfessorId: this.professorId,
      professorName: '',
    }
  },
  computed: {
    professors() {
      return this.users.filter((user) => user.role === 'professor')
    },
    students() {
      return this.users.filter((user) => user.role === 'student')
    },
  },
  methods: {
    async saveEvent() {
      try {
        const event = {
          title: this.title,
          type: this.type,
          studentId: this.studentId,
          professorId: this.selectedProfessorId,
          day: this.day,
          hour: this.hour,
          duration: this.duration,
        }

        console.log('Event data to be sent:', event)

        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found.')
        }

        await axios.post('http://localhost:5000/api/events', event, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        this.$emit('event-saved')
      } catch (error) {
        console.error('Error adding event:', error)
      }
    },
  },
  mounted() {
    if (this.role === 'professor') {
      const professor = this.users.find((user) => user._id === this.professorId)
      if (professor) {
        this.selectedProfessorId = this.professorId
        this.professorName = `${professor.first_name} ${professor.last_name}`
      }
    }
    console.log('Users received:', this.users)
    console.log('Professors:', this.professors)
    console.log('Students:', this.students)
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
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}
</style>
