<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div class="flex-container">
        <!-- invoice generator -->
        <section style="flex-grow: 4">
          <div class="container">
            <div class="invoice" id="invoice-container">
              <div class="row">
                <div class="col-7">
                  <img
                    alt="Logo"
                    id="uploadedLogo"
                    src="https://lh3.googleusercontent.com/p/AF1QipPjzki38QWekfWecVhrHrSJL40NbEm767xRGOZL=s680-w680-h510"
                    class="logo"
                  />
                </div>
                <div class="col-5">
                  <div class="document-type display-4">
                    <div data-editable="true">FACTURE</div>
                  </div>
                  <div class="text-right" data-editable="true">N°</div>
                </div>
              </div>
              <div class="row">
                <div class="col-7">
                  <div v-for="student in students" :key="student._id">
                    <div data-editable="false">
                      {{ student.first_name }} {{ student.last_name }}
                    </div>
                    <br />
                    <div data-editable="false">
                      {{ student.address }}
                      <br />
                      {{ student.complementary }} <br />
                      {{ student.postal_code }} <br />
                      {{ student.city }}
                    </div>
                  </div>
                </div>
                <div class="col-5" style="text-align: right">
                  <br /><br /><br />
                  <div>
                    <div data-editable="false">
                      Sky Explorer <br />
                      Réf. Client C <br />
                      Chemin de la Badesse <br />
                      13290 Aix-en-Provence
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <br />
              <div>
                <div data-editable="false" id="student">
                  Facturation cours de vol
                </div>
              </div>
              <br />
              <table id="table" class="table table-striped">
                <thead>
                  <tr>
                    <th data-editable="true">Description</th>
                    <th data-editable="true">Quantité</th>
                    <th data-editable="true">Unité</th>
                    <th data-editable="true">PU HT</th>
                    <th data-editable="true">TVA</th>
                    <th data-editable="true">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="course in courses" :key="course._id">
                    <td>
                      <span data-editable="true"
                        >Récapitulatif heures de vol</span
                      >
                    </td>
                    <td class="text-right">
                      <span
                        data-editable="true"
                        data-field="quantity"
                        data-editable-type="number"
                        >{{ course.duration }}</span
                      >
                    </td>
                    <td>Heure(s)</td>
                    <td class="text-right">
                      <span
                        data-editable="true"
                        data-field="pu-ht"
                        data-editable-type="number"
                        >200</span
                      >
                      <span class="currency">€</span>
                    </td>
                    <td class="text-right">
                      <span
                        data-editable="true"
                        data-field="tva"
                        data-editable-type="number"
                        >20</span
                      >%
                    </td>
                    <td class="text-right">
                      <span
                        data-editable="true"
                        data-field="total-ht"
                        data-editable-type="number"
                      >
                        {{ 200 * (course.duration + 0.2) }}</span
                      >
                      <span class="currency">€</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="conditions">
                <div data-editable="true">
                  En votre aimable règlement Et avec nos remerciements. <br />
                  Conditions de paiement : paiement à réception de facture, à 15
                  jours. <br />
                  Aucun escompte consenti pour règlement anticipé. <br />
                  En cas de retard de paiement, <br />
                  indemnité forfaitaire pour frais de recouvrement : 40 euros
                  (art. L.4413 et L.4416s code du commerce).
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div class="bottom-page text-right">
                <div data-editable="true">
                  SkyExplorer - N° SIRET 801 387 788 00012 RCS MARSEILLE <br />
                  Cheminde la Badasse - 13290 Aix-en-Provence - 04 88 29 13 00 -
                  www.sky-explorer.fr <br />
                  Code APE 85.51Z - N° TVA FR43801387788 <br />
                  IBAN FR** **** **** **** **** **** *** - SWIFT ***********
                  <br />
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- settings -->
        <section class="hide-elements" style="flex-grow: 2">
          <table class="table">
            <tbody>
              <tr>
                <td>
                  <button
                    class="btn btn-success btn-block"
                    @click="printInvoice()"
                  >
                    Imprimer la facture
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, useStore } from 'vuex'
import { ref } from 'vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Billing',
  computed: {
    ...mapGetters(['students', 'userName', 'eventId', 'courses', 'leisures']),
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    printInvoice() {
      window.print()
    },
  },
  setup() {
    const store = useStore()
    const selectedUser = ref('')
    const users = ref([])
    const userName = ref(store.getters.userName)
    const currentUserId = ref(store.getters.currentUserId)
    const role = ref(store.getters.userRole)
    const eventId = ref('')
    return {
      role,
      userName,
      users,
      currentUserId,
      selectedUser,
      eventId,
    }
  },
}
</script>

<style scoped>
/* Styles for Billing */
body {
  background: #ddd;
  padding: 40px;
  margin-top: 10%;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.close {
  position: absolute;
  top: 50px;
  left: 25px;
  font-size: 25px;
  cursor: pointer;
}

.modal-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  width: 350px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
}
textarea {
  width: 100% !important;
  border: 1px solid #ddd !important;
}

.container {
  min-height: 10cm;
  margin-top: 5%;
}

.invoice {
  background: #fff;
  width: 100%;
  padding: 50px;
  .col-5 {
    margin-top: -5%;
  }
}

.logo {
  width: 5cm;
}

.document-type {
  text-align: right;
  color: #444;
}

.conditions {
  font-size: 0.7em;
  color: #666;
  margin-top: 5%;
}

.bottom-page {
  font-size: 0.7em;
  margin-top: -5%;
}

table {
  font-size: 12px !important;
  button {
    margin: 50% -10% 0 -50%;
  }
}

table td {
  padding: 0.45rem !important;
}

table td {
  font-size: 15px;
}

@media print {
  [data-editable='true'] {
    border: none !important;
  }

  .invoice {
    display: block;
  }

  .hide-elements {
    display: none;
  }

  @page {
    size: auto;
    margin: 30px 0;
  }

  .container {
    width: 100% !important;
  }

  .invoice {
    font-size: 13px !important;
    color: black !important;
    padding: 0 !important;
  }

  #logoForm {
    display: none;
  }

  table td {
    padding: 0.45rem !important;
  }

  .table > :not(caption) > * > * {
    color: black !important;
    font-size: 10px !important;
  }

  body {
    margin: 0;
    padding: 0;
  }

  textarea {
    resize: none;
  }
}

.text-right {
  text-align: right;
}

.flex-container {
  display: flex;
}

[data-editable='true'] {
  padding: 2px;
}
</style>
