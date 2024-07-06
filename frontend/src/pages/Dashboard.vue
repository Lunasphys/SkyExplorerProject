<template>
  <div>
    <div class="dashboard-container">
      <Calendar />
    </div>
  </div>
</template>

<script>
import Calendar from '@/pages/Calendar.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Dashboard',
  components: {
    Calendar,
  },
  data() {
    return {
      eventLoaded: false,
    }
  },
  computed: {
    ...mapGetters(['events']),
  },
  methods: {
    ...mapActions(['fetchEvents']),
  },
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
</style>
