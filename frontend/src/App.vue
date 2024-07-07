<template>
  <div id="app">
    <Navbar />
    <button class="toggle-navbar" @click="toggleNavbar">☰</button>
    <div
      :class="['main-content', { 'main-content-collapsed': isNavbarCollapsed }]"
    >
      <router-view />
      <Footer />
    </div>
  </div>
</template>

<script>
import Navbar from './components/Nav-bar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      isNavbarCollapsed: false,
    }
  },
  watch: {
    $route() {
      this.checkNavbarState()
    },
  },
  mounted() {
    this.checkNavbarState()
    window.addEventListener('resize', this.checkNavbarState)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkNavbarState)
  },
  methods: {
    checkNavbarState() {
      this.isNavbarCollapsed = window.innerWidth < 768
    },
    toggleNavbar() {
      this.isNavbarCollapsed = !this.isNavbarCollapsed
      document.querySelector('.navbar').classList.toggle('active')
    },
  },
}
</script>

<style>
#app {
  display: flex;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #001933ba;
}

.main-content {
  margin-left: 80px;
  align-content: center;
  flex: 1;
  overflow: auto;
  transition: margin-left 0.3s ease;
  position: fixed;
  width: 100%;
  height: 100%;
}

.main-content-collapsed {
  margin-left: 0;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
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
}
</style>
