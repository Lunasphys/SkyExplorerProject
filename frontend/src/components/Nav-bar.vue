<template>
  <nav>
    <!-- Navbar content -->
    <router-link to="/">Accueil</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/admin/schedule">Emploi du temps Admin</router-link>
    <router-link to="/billing">Facture</router-link>
    <router-link to="/statistics">Statistique</router-link>
    <router-link to="/student/progress">Progression élèves</router-link>
    <button v-if="isAuthenticated" @click="handleLogout">Déconnexion</button>
    <router-link v-else to="/login">Connexion</router-link>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Nav-bar',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout({ commit }) {
      this.logout({ commit })
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
/* Styles pour Navbar */
</style>
