<template>
  <div class="statistics-container">
    <div class="statistics-grid">
      <div class="stat-box theoretical-amount">
        <h2>Total théorique</h2>
        <p>{{}} euros</p>
        <h2>Factures payées actuellement</h2>
        <p>{{}} euros</p>
      </div>
      <div class="stat-box total-hours-activity">
        <h2>Totales heures de vol : cours</h2>
        <p>{{}} heures</p>
        <h2>Totales heures de vol : loisirs</h2>
        <p>{{}} heures</p>
      </div>
      <div class="stat-box total-student">
        <h2>Total Etudiants</h2>
        <p>{{}} étudiants</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Statistics',
  /*data() {
    return {
      animatedStatistics: {
        totalTheoretical: 100020,
        paidInvoices: 50000,
        totalCourseHours: 80,
        totalLeisureHours: 60,
        totalStudents: 6,
      },
    }
  },*/
  computed: {
    statistics() {
      return this.$store.getters.statistics
    },
  },
  watch: {
    statistics: {
      immediate: true,
      handler(newStats) {
        this.animateStatistics(newStats)
      },
    },
  },
  /*methods: {
    animateStatistics(newStats) {
      this.animateValue('', newStats.totalTheoretical, 1000)
      this.animateValue('', newStats.paidInvoices, 1000)
      this.animateValue('', newStats.totalCourseHours, 1000)
      this.animateValue('', newStats.totalLeisureHours, 1000)
      this.animateValue('totalStudents', newStats.totalStudents, 1000)
    },
    animateValue(key, endValue, duration) {
      const startValue = this.animatedStatistics[key]
      const range = endValue - startValue
      let startTime = null

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime
        const currentValue = Math.min(
          startValue + range * (progress / duration),
          endValue,
        )
        this.$set(this.animatedStatistics, key, Math.floor(currentValue))
        if (progress < duration) {
          window.requestAnimationFrame(step)
        } else {
          this.$set(this.animatedStatistics, key, endValue)
        }
      }

      window.requestAnimationFrame(step)
    },
  },
  created() {
    this.$store.dispatch('fetchStatistics')
  },*/
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
