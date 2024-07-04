<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="performLogin">
      <label for="mail">mail:</label>
      <input type="email" id="mail" v-model="mail" required />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Login</button>
    </form>
    <p v-if="loginMessage">{{ loginMessage }}</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      mail: '',
      password: '',
    }
  },
  computed: {
    ...mapGetters(['loginMessage']),
  },
  methods: {
    ...mapActions(['login']),
    async performLogin() {
      console.log('Attempting login with:', {
        mail: this.mail,
        password: this.password,
      })
      try {
        await this.login({ mail: this.mail, password: this.password })
      } catch (error) {
        console.error('Login failed:', error.message)
      }
    },
  },
}
</script>
