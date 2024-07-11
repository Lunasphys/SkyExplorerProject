<template>
  <div class="signup-container">
    <div class="signup-card">
      <div class="signup-image">
        <img src="../assets/aviateur2.png" alt="Aviator" />
        <div class="signup-overlay">
          <form @submit.prevent="signup">
            <div class="form-group">
              <label for="first_name">PRENOM</label>
              <input
                type="text"
                id="first_name"
                v-model="first_name"
                required
              />
            </div>
            <div class="form-group">
              <label for="name">NOM</label>
              <input type="text" id="name" v-model="name" required />
            </div>
            <div class="form-group">
              <label for="age">AGE</label>
              <input type="number" id="age" v-model="age" required />
            </div>
            <div class="form-group">
              <label for="email">EMAIL</label>
              <input type="email" id="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="phone">PHONE</label>
              <input type="number" id="phone" v-model="phone" required />
            </div>
            <div class="form-group">
              <label for="address">ADDRESSE</label>
              <input type="text" id="address" v-model="address" required />
            </div>
            <div class="form-group">
              <label for="complementary">COMPLEMENT D'ADDRESSE</label>
              <input
                type="text"
                id="complementary"
                v-model="complementary"
                required
              />
            </div>
            <div class="form-group">
              <label for="postal_code">CODE POSTAL</label>
              <input
                type="number"
                id="postal_code"
                v-model="postal_code"
                required
              />
            </div>
            <div class="form-group">
              <label for="city">VILLE</label>
              <input type="text" id="city" v-model="city" required />
            </div>
            <div class="form-group">
              <label for="role">ROLE</label>
              <select id="role" v-model="role" required>
                v-for="role in ['user', 'admin']"
                <option value="admin">Admin</option>
                <option value="professor">Professor</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div class="form-group">
              <label for="password">MOT DE PASSE</label>
              <input type="text" id="password" v-model="password" required />
            </div>
            <button type="submit" class="submit-button" @click="createUser">
              C'est parti
            </button>
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
  name: 'Signup',
  data() {
    return {
      first_name: '',
      name: '',
      age: '',
      email: '',
      phone: '',
      address: '',
      complementary: '',
      postal_code: '',
      city: '',
      password: '',
      role: '',
    }
  },
  methods: {
    async signup() {
      try {
        const response = await axios.post('http://localhost:5000/api/signup', {
          first_name: this.first_name,
          name: this.name,
          age: this.age,
          email: this.email,
          phone: this.phone,
          address: this.address,
          complementary: this.complementary,
          postal_code: this.postal_code,
          city: this.city,
          password: this.password,
          role: this.role,
        })
        const token = response.data.token
        localStorage.setItem('authToken', token)
        await this.$router.push('./dashboard')
      } catch (error) {
        console.error('Signup error:', error)
        alert('Failed to signup. Please check your credentials.')
      }
    },
    createUser() {
      this.$store.dispatch('createUser', {
        first_name: this.first_name,
        name: this.name,
        age: this.age,
        email: this.email,
        phone: this.phone,
        address: this.address,
        complementary: this.complementary,
        postal_code: this.postal_code,
        city: this.city,
        password: this.password,
        role: this.role,
      })
      this.$router.push('/dashboard')
    },
  },
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  overflow: hidden;
  text-align-last: center;
}

.signup-card {
  position: relative;
  width: 100%;
  max-width: 900px;
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;
}

.signup-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.signup-image img {
  width: 82%;
  height: auto;
  border-radius: 9%;
}

.signup-overlay {
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

.form-group {
  margin-bottom: 10px;
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
