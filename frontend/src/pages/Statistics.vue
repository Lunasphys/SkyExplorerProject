<template>
  <div class="statistics">
    <h1>Statistics</h1>
    <p>Total Flight Time: {{ statistics?.totalFlightTime || 0 }} hours</p>
    <p>Total Lessons: {{ statistics?.totalLessons || 0 }}</p>
    <p>Total Users: {{ statistics?.totalUsers || 0 }}</p>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Statistics',
  computed: {
    statistics() {
      return this.$store.getters.statistics
    },
  },
  created() {
    this.$store.dispatch('fetchStatistics')
  },
}
</script>

<style scoped>
.statistics {
  padding: 20px;
}
</style>
