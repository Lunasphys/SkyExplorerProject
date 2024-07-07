<template>
  <div class="login-container">
    <video autoplay muted loop id="bg-video">
      <source src="../assets/background.mp4" type="video/mp4" />
    </video>
    <div class="login-card">
      <div class="login-image">
        <img src="../assets/aviateur2.png" alt="Aviator" />
        <div class="login-overlay">
          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">EMAIL</label>
              <input type="email" id="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="password">MOT DE PASSE</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
              />
            </div>
            <button type="submit" class="submit-button">C'est parti</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          mail: this.email,
          password: this.password,
        })
        const token = response.data.token
        localStorage.setItem('authToken', token)
        await this.$router.push('./dashboard')
      } catch (error) {
        console.error('Login error:', error)
        alert('Failed to login. Please check your credentials.')
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  text-align-last: center;
}

#bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;
}

.login-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.login-image img {
  width: 82%;
  height: auto;
  border-radius: 9%;
}

.login-overlay {
  position: absolute;
  top: 50%;
  left: 49%;
  transform: translate(-50%, -50%);
  background-color: rgb(116 145 141);
  padding: 54px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 18px 0;
}

.login-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #007bff;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.submit-button {
  background-color: #2c4157;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
