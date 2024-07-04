<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2>Add Event</h2>
      <form @submit.prevent="saveEvent">
        <label for="title">Title:</label>
        <input v-model="title" type="text" id="title" required />

        <label for="type">Type:</label>
        <select v-model="type" id="type" required>
          <option value="course">Course</option>
          <option value="leisure">Leisure</option>
        </select>

        <label for="student">Student:</label>
        <input v-model="student" type="text" id="student" required />

        <label for="professor">Professor:</label>
        <input v-model="professor" type="text" id="professor" required />

        <label for="duration">Duration (hours):</label>
        <input
          v-model="duration"
          type="number"
          id="duration"
          min="1"
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'EventModal',
  props: ['day', 'hour'],
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const title = ref('')
    const type = ref('course')
    const student = ref('')
    const professor = ref('')
    const duration = ref(1)
    const close = () => {
      emit('close')
    }
    const saveEvent = () => {
      const event = {
        title: title.value,
        type: type.value,
        student: student.value,
        professor: professor.value,
        day: props.day,
        hour: props.hour,
        duration: duration.value,
      }
      emit('save', event)
    }
    return {
      title,
      type,
      student,
      professor,
      duration,
      close,
      saveEvent,
    }
  },
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
}
</style>
