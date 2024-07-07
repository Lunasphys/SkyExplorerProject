<template>
  <div>
    <h1>Billing</h1>
    <!-- Billing content -->
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Billing',
}
</script>

<!--      default:-->
<!--        break;-->
<!--    }-->

<!--    // Create editable content (input for numbers, div for other columns)-->
<!--    if (i === 1 || i === 3 || i === 4 || i === 5) {-->
<!--      cell.className = 'text-right'-->
<!--      span.setAttribute('data-editable-type', 'number');-->
<!--      span.setAttribute('data-editable', 'true');-->
<!--      span.innerText = columnValues[i]-->
<!--      cell.appendChild(span);-->

<!--      cell.addEventListener('change', function () {-->
<!--        calculateTotals();-->
<!--      });-->

<!--      if (i == 4) {-->
<!--        var perCentSpan = document.createElement('span');-->
<!--        perCentSpan.innerText = '%'-->
<!--        cell.appendChild(perCentSpan);-->

<!--      }-->

<!--      if (i == 3 || i == 5) {-->
<!--        var currencySpan = document.createElement('span');-->
<!--        currencySpan.innerText = currency-->
<!--        cell.appendChild(currencySpan);-->
<!--      }-->
<!--    } else {-->
<!--      span.textContent = columnValues[i];-->
<!--      span.setAttribute('data-editable', 'true');-->
<!--      cell.appendChild(span);-->
<!--    }-->
<!--  }-->

<!--  var actionCell = newRow.insertCell(6);-->
<!--  actionCell.className = 'text-right'-->
<!--  var button = document.createElement('button');-->
<!--  button.className = 'btn btn-sm btn-danger'-->
<!--  button.innerText = '-'-->
<!--  actionCell.appendChild(button);-->

<!--  actionCell.addEventListener('click', function (e) {-->
<!--    deleteRow(e.target);-->
<!--  });-->

<!--  calculateTotals()-->
<!--}-->

<!--function deleteRow(button) {-->
<!--  const row = button.closest('tr');-->
<!--  row.remove();-->
<!--  calculateTotals();-->
<!--}-->

<!--function printInvoice() {-->
<!--  window.print()-->

<!--}-->

<!--function getSelectedCurrency() {-->
<!--  console.log('getSelectedCurrency triggred')-->
<!--  // Get the select element-->
<!--  var selectElement = document.getElementById("select-currency");-->

<!--  // Get the selected index-->
<!--  var selectedIndex = selectElement.selectedIndex;-->

<!--  // Get the selected option element-->
<!--  var selectedOption = selectElement.options[selectedIndex];-->

<!--  // Log the selected option value and text-->
<!--  console.log("Selected Value: " + selectedOption.value);-->

<!--  document.querySelector('.currency').innerText = selectedOption.value-->

<!--  return selectedOption.value-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--/* Styles for Billing */-->
<!--body {-->
<!--  background: #ddd;-->
<!--  padding: 40px;-->
<!--}-->

<!--textarea {-->
<!--  width: 100% !important;-->
<!--  border: 1px solid #ddd !important;-->
<!--}-->

<!--.container {-->
<!--  min-height: 29.7cm;-->
<!--  margin: auto;-->
<!--}-->

<!--.invoice {-->
<!--  background: #fff;-->
<!--  width: 100%;-->
<!--  padding: 50px;-->
<!--}-->

<!--.logo {-->
<!--  width: 2.5cm;-->
<!--}-->

<!--.document-type {-->
<!--  text-align: right;-->
<!--  color: #444;-->
<!--}-->

<!--.conditions {-->
<!--  font-size: 0.7em;-->
<!--  color: #666;-->
<!--}-->

<!--.bottom-page {-->
<!--  font-size: 0.7em;-->
<!--}-->

<!--table {-->
<!--  font-size: 12px !important;-->
<!--}-->

<!--table td {-->
<!--  padding: 0.45rem !important;-->
<!--}-->

<!--table td {-->
<!--  font-size: 15px;-->
<!--}-->

<!--@media print {-->

<!--  [data-editable="true"] {-->
<!--    border: none !important-->
<!--  }-->

<!--  .invoice {-->
<!--    display: block;-->
<!--  }-->

<!--  .hide-elements {-->
<!--    display: none;-->
<!--  }-->

<!--  @page {-->
<!--    size: auto;-->
<!--    /* auto is the initial value */-->
<!--    margin: 30px 0;-->
<!--    /* this affects the margin in the printer settings */-->
<!--  }-->

<!--  .container {-->
<!--    width: 100% !important;-->
<!--  }-->

<!--  .invoice {-->
<!--    font-size: 13px !important;-->
<!--    color: black !important;-->
<!--    padding: 0 !important;-->
<!--  }-->

<!--  .btn {-->
<!--    display: none;-->
<!--  }-->

<!--  #logoForm {-->
<!--    display: none;-->
<!--  }-->

<!--  table td {-->
<!--    padding: 0.45rem !important;-->
<!--  }-->

<!--  .table > :not(caption) > * > * {-->
<!--    color: black !important;-->
<!--    font-size: 10px !important;-->
<!--  }-->

<!--  body {-->
<!--    margin: 0;-->
<!--    /* Remove default body margin */-->
<!--    padding: 0;-->
<!--    /* Remove default body padding */-->
<!--  }-->

<!--  textarea {-->
<!--    resize: none;-->
<!--  }-->
<!--}-->

<!--.editable {-->
<!--  cursor: pointer;-->
<!--}-->

<!--.transparent-input {-->
<!--  border: none;-->
<!--  background: transparent;-->
<!--  outline: none;-->
<!--}-->

<!--.text-right {-->
<!--  text-align: right-->
<!--}-->

<!--.flex-container {-->
<!--  display: flex;-->
<!--}-->

<!--[data-editable="true"] {-->
<!--  border: 1px dashed #ddd;-->
<!--  padding: 5px;-->
<!--}-->
<!--</style>-->
