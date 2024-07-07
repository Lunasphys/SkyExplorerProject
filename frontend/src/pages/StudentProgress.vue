<template>
  <div class="container">
    <h1>
      Informations sur les Cours de Vol de {{ student.first_name }}
      {{ student.last_name }}
    </h1>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Date</th>
          <th>Durée (en heures)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ flight.type }}</td>
          <td>{{ flight.date }}</td>
          <td>{{ flight.duration }}</td>
        </tr>
      </tbody>
    </table>
    <div class="bill">
      <button>Etablir une facture</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentProgress',
  data() {
    return {
      student: {
        first_name: this.student.first_name,
        last_name: this.student.last_name,
      },
      flight: {
        type: this.flight.type,
        date: this.flight.date,
        duration: this.flight.duration,
      },
    }
  },
  computed: {
    canGenerateBill() {
      return this.userRole === 'admin' || this.userRole === 'professor'
    },
  },
  methods: {
    async generateBill() {
      const billSection = document.querySelector('.bill')
      // Check if user is authorized to generate bill
      if (!this.canGenerateBill) {
        //Display none
        billSection.style.display = 'none'
      } else {
        // Display block
        billSection.style.display = 'block'
      }
    },
  },
}
</script>

<style scoped>
/* Styles for Student Progress */
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.bill {
  text-align: center;
  margin-top: 20px;
}
</style>
