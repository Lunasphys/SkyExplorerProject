<template>
  <div class="statistics-container">
    <div class="statistics-grid">
      <div
        class="stat-box theoretical-amount"
        v-for="bill in bills"
        :key="bill._id"
      >
        <h2>Total théorique</h2>
        <p v-for="course in courses" :key="course._id">
          {{ course.duration }} euros
        </p>
        <h2>Factures payées actuellement</h2>
        <p>{{ bill.payed }} euros</p>
      </div>
      <div
        class="stat-box total-hours-activity"
        v-for="course in courses"
        :key="course._id"
      >
        <h2>Totales heures de vol : cours</h2>
        <p v-if="course.type === 'course'">{{ course.duration }} heure(s)</p>
        <h2>Totales heures de vol : loisirs</h2>
        <p v-if="course.type === 'leisure'">{{ course.duration }} heure(s)</p>
      </div>
      <div
        class="stat-box total-student"
        v-for="student in students"
        :key="student._id"
      >
        <h2>Total Etudiants</h2>
        <p>1 étudiant(s)</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, useStore } from 'vuex'
import { ref } from 'vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Statistics',
  data() {
    return {
      animatedStatistics: {
        totalTheoretical: 100020,
        paidInvoices: 50000,
        totalCourseHours: 80,
        totalLeisureHours: 60,
        totalStudents: 6,
      },
    }
  },
  computed: {
    statistics() {
      return this.$store.getters.statistics
    },
    ...mapGetters([
      'courses',
      'leisures',
      'students',
      'userRole',
      'studentId',
      'user',
      'bills',
    ]),
  },
  watch: {
    statistics: {
      immediate: true,
      // handler(newStats) {
      //   this.animateStatistics(newStats)
      // },
    },
  },
  methods: {
    // animateStatistics(newStats) {
    //   this.animateValue('', newStats.totalTheoretical, 1000)
    //   this.animateValue('', newStats.paidInvoices, 1000)
    //   this.animateValue('', newStats.totalCourseHours, 1000)
    //   this.animateValue('', newStats.totalLeisureHours, 1000)
    //   this.animateValue('totalStudents', newStats.totalStudents, 1000)
    // },
    // animateValue(key, endValue, duration) {
    //   const startValue = this.animatedStatistics[key]
    //   const range = endValue - startValue
    //   let startTime = null
    //
    //   const step = (timestamp) => {
    //     if (!startTime) startTime = timestamp
    //     const progress = timestamp - startTime
    //     const currentValue = Math.min(
    //       startValue + range * (progress / duration),
    //       endValue,
    //     )
    //     this.$set(this.animatedStatistics, key, Math.floor(currentValue))
    //     if (progress < duration) {
    //       window.requestAnimationFrame(step)
    //     } else {
    //       this.$set(this.animatedStatistics, key, endValue)
    //     }
    //   }
    //
    //   window.requestAnimationFrame(step)
    // },
  },
  created() {
    this.$store.dispatch('fetchStatistics')
  },
  setup() {
    const store = useStore()
    const selectedUser = ref('')
    const users = ref([])
    const userName = ref(store.getters.userName)
    const events = ref(store.getters.events)
    const currentUserId = ref(store.getters.currentUserId)
    const role = ref(store.getters.userRole)
    const studentId = ref(store.getters.studentId)
    const courses = ref(store.getters.courses)
    const leisures = ref(store.getters.leisures)
    const bills = ref(store.getters.bills)

    return {
      role,
      userName,
      users,
      currentUserId,
      selectedUser,
      events,
      studentId,
      courses,
      leisures,
      bills,
    }
  },
}
</script>

<style scoped>
.statistics-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.stat-box {
  padding: 20px;
  border-radius: 8px;
  color: #fff;
}

.theoretical-amount {
  background-color: #f78da7;
}

.total-hours-activity {
  background-color: #82ca9c;
}

.total-student {
  background-color: #8da0cb;
}

.stat-box h2 {
  margin: 0 0 10px;
}

.stat-box p {
  margin: 0 0 20px;
}
</style>
