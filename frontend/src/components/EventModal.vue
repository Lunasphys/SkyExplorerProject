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
          <select id="professor" v-model="professorId" required>
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
          <select id="professor" v-model="professorId" required>
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
          <select id="professor" v-model="professorId" required>
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
        </div>
        <button type="submit">Save</button>
      </form>
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
  },
  data() {
    return {
      title: '',
      type: 'course',
      studentId: '',
      duration: 1,
      professorName: '',
      professorId: '',
    }
  },
  computed: {
    ...mapGetters(['professors', 'students']),
  },
  methods: {
    ...mapActions(['fetchProfessors', 'fetchStudents']),
    async saveEvent() {
      const event = {
        title: this.title,
        type: this.type,
        studentId: this.studentId,
        professorId: this.professorId,
        day: this.day,
        hour: this.hour,
        duration: this.duration,
      }

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
        console.log('Event saved successfully:', response.data)
      } catch (error) {
        console.error('Error adding event:', error.response?.data || error)
      }
    },
  },
  created() {
    this.fetchProfessors()
    this.fetchStudents()
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
