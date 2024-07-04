<template>
  <div>
    <div class="dashboard-container">
      <Calendar />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Calendar from '@/pages/Calendar.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dashboard',
  components: {
    Footer,
    Calendar,
  },
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>
