<template>
  <div class="navbar">
    <router-link
      to="/login"
      class="nav-item login-item"
      v-if="!isAuthenticated"
    >
      <img src="../assets/login.jpg" alt="Connexion" class="icon" />
    </router-link>

    <transition-group name="slide" tag="div" class="auth-items">
      <router-link
        v-if="isAuthenticated"
        to="/dashboard"
        class="nav-item"
        key="dashboard"
      >
        <img src="../assets/dashboard.png" alt="Dashboard" class="icon" />
      </router-link>
      <router-link
        v-if="userRole === 'admin'"
        to="/statistics"
        class="nav-item"
        key="statistics"
      >
        <img src="../assets/statistics.png" alt="Statistique" class="icon" />
      </router-link>
      <router-link
        v-if="userRole === 'admin' || userRole === 'student'"
        to="/student_progress"
        class="nav-item"
        key="student-progress"
      >
        <img
          src="../assets/student.png"
          alt="Progression élèves"
          class="icon"
        />
      </router-link>
      <router-link
        v-if="userRole === 'admin'"
        to="/sign_up"
        class="nav-item"
        key="sign-up"
      >
        <img src="../assets/create_user.png" alt="Signup" class="icon" />
      </router-link>
      <button
        v-if="isAuthenticated"
        @click="handleLogout"
        class="nav-item"
        key="logout"
      >
        <img src="../assets/logout.png" alt="Déconnexion" class="icon" />
      </button>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters(['isAuthenticated', 'userRole']),
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  overflow: hidden;
  border-right: 2px solid #2f383b;
  width: 80px;
  height: 100%;
  place-content: center;
  z-index: 2;
}

.nav-item {
  margin: 10px 0;
  transition: all 0.5s ease;
}

.icon {
  width: 40px;
  height: 40px;
  filter: invert(100%);
  transition: transform 0.2s ease-in-out;
}

.icon:hover {
  transform: scale(1.1);
}

.auth-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.toggle-navbar {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  display: none;
}

@media (max-width: 768px) {
  .toggle-navbar {
    display: block;
  }
  .navbar {
    display: none;
  }
  .navbar.active {
    display: flex;
  }
}
</style>
