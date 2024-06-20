<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required />

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">Login</button>
    </form>
    <p v-if="loginMessage">{{ loginMessage }}</p>
    <!-- Afficher le message de connexion -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    ...mapGetters(['loginMessage']),
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      try {
        await this.login({ email: this.email, password: this.password })
        await this.$router.push('/dashboard')
      } catch (error) {
        console.error('Login failed:', error.message)
      }
    },
  },
}
</script>

<style scoped>
/* Styles pour Login */
</style>
