<template>
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
              <div>
                <div data-editable="true">STUDENT</div>
                <br />
                <div data-editable="true">
                  ADDRESS
                  <br />
                  COMPLEMENTARY <br />
                  POSTALCODE <br />
                  CITY
                </div>
              </div>
            </div>
            <div class="col-5" style="text-align: right">
              <br /><br /><br />
              <div>
                <div data-editable="true">
                  Sky Explorer <br />
                  Réf. Client C STUDENT-ID <br />
                  Chemin de la Badesse <br />
                  13290 Aix-en-Provence
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div>
            <div data-editable="true">Facturation cours de vol</div>
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
                <th class="hide-elements">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span data-editable="true">Récapitulatif heures de vol</span>
                </td>
                <td class="text-right">
                  <span
                    data-editable="true"
                    data-field="quantity"
                    data-editable-type="number"
                    >1</span
                  >
                </td>
                <td>Jour</td>
                <td class="text-right">
                  <span
                    data-editable="true"
                    data-field="pu-ht"
                    data-editable-type="number"
                    >500</span
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
                  ></span>
                  <span class="currency">€</span>
                </td>
                <td class="text-right hide-elements">
                  <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRow(this)"
                  >
                    -
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-xs btn-success" onclick="addNewRow()">
            +
          </button>
          <div class="conditions">
            <div data-editable="true">
              En votre aimable règlement Et avec nos remerciements. <br />
              Conditions de paiement : paiement à réception de facture, à 15
              jours. <br />
              Aucun escompte consenti pour règlement anticipé. <br />
              En cas de retard de paiement, <br />
              indemnité forfaitaire pour frais de recouvrement : 40 euros (art.
              L.4413 et L.4416s code du commerce).
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
              IBAN FR** **** **** **** **** **** *** - SWIFT *********** <br />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- settings -->
    <section class="hide-elements" style="flex-grow: 2">
      <h4 class="text-center">Options</h4>
      <table class="table">
        <tbody>
          <tr>
            <td><strong>Devise:</strong></td>
            <td>
              <select
                onchange="getSelectedCurrency()"
                id="select-currency"
                class="form-select"
              >
                <option value="$">USD</option>
                <option value="€">EUR</option>
                <option value="£">GBP</option>
                <!-- Add more currency options as needed -->
              </select>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button
                class="btn btn-success btn-block"
                onclick="printInvoice()"
              >
                Print Invoice
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Billing',
}
</script>

<style scoped>
/* Styles for Billing */
body {
  background: #ddd;
  padding: 40px;
  margin: auto;
}

textarea {
  width: 100% !important;
  border: 1px solid #ddd !important;
}

.container {
  min-height: 29.7cm;
  margin: auto;
}

.invoice {
  background: #fff;
  width: 100%;
  padding: 50px;
}

.logo {
  width: 2.5cm;
}

.document-type {
  text-align: right;
  color: #444;
}

.conditions {
  font-size: 0.7em;
  color: #666;
}

.bottom-page {
  font-size: 0.7em;
}

table {
  font-size: 12px !important;
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
    /* auto is the initial value */
    margin: 30px 0;
    /* this affects the margin in the printer settings */
  }

  .container {
    width: 100% !important;
  }

  .invoice {
    font-size: 13px !important;
    color: black !important;
    padding: 0 !important;
  }

  .btn {
    display: none;
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
    /* Remove default body margin */
    padding: 0;
    /* Remove default body padding */
  }

  textarea {
    resize: none;
  }
}

.editable {
  cursor: pointer;
}

.transparent-input {
  border: none;
  background: transparent;
  outline: none;
}

.text-right {
  text-align: right;
}

.flex-container {
  display: flex;
}

[data-editable='true'] {
  border: 1px dashed #ddd;
  padding: 5px;
}
</style>
