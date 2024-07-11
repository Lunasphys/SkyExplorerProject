<template>
  <div class="statistics-container">
    <h1 style="color: #ffffff; font-weight: bold">Statistiques totales</h1>
    <div class="statistics-grid">
      <div class="stat-box total-hours-activity-cours">
        <h2>Total heures de vol téoriques prodigué : Cours</h2>
        <p>{{ totalHoursCourses }} heure(s)</p>
        <h2>Total heures de vol payé : cours</h2>
        <p>{{ totalHoursCoursesPaid }} heure(s)</p>
      </div>
      <div class="stat-box total-hours-activity-leisures">
        <h2>Total heures de vol théoriques prodigué : Loisirs</h2>
        <p>{{ totalHoursLeisures }} heure(s)</p>
        <h2>Total heures de vol de payé : loisirs</h2>
        <p>{{ totalHoursLeisuresPaid }} heure(s)</p>
      </div>
      <div class="total-student">
        <h2>Total Etudiants</h2>
        <p>{{ countStudent }} étudiant(s)</p>
      </div>
      <div class="total-professor">
        <h2>Total Professeurs</h2>
        <p>{{ countProfessor }} professeur(s)</p>
      </div>
      <div class="total-pdf">
        <h2>Total des factures</h2>
        <p v-for="bill in bills" :key="bill._id">{{ bill.pdf }}</p>
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
    countStudent() {
      return this.students.length
    },
    countProfessor() {
      return this.professors.length
    },
    totalHoursCourses() {
      return this.courses.reduce((acc, course) => {
        if (course.type === 'course') {
          return acc + course.duration
        }
        return acc
      }, 0)
    },
    totalHoursCoursesPaid() {
      return this.courses.reduce((acc, course) => {
        if (course.type === 'course' && course.payed) {
          return acc + course.duration
        }
        return acc
      }, 0)
    },
    totalHoursLeisures() {
      return this.leisures.reduce((acc, leisure) => {
        if (leisure.type === 'leisure') {
          return acc + leisure.duration
        }
        return acc
      }, 0)
    },
    totalHoursLeisuresPaid() {
      return this.leisures.reduce((acc, leisure) => {
        if (leisure.type === 'leisure' && leisure.payed) {
          return acc + leisure.duration
        }
        return acc
      }, 0)
    },
    ...mapGetters([
      'courses',
      'leisures',
      'students',
      'professors',
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

.total-hours-activity-cours {
  background-color: #82ca9c;
}

.total-hours-activity-leisures {
  background-color: #82ca9c;
}

.total-student {
  background-color: #8da0cb;
  padding: 20px;
  border-radius: 8px;
}

.total-professor {
  background-color: #2da0ab;
  padding: 20px;
  border-radius: 8px;
}

.total-pdf {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

.stat-box h2 {
  margin: 0 0 10px;
}

.stat-box p {
  margin: 0 0 20px;
}
</style>
