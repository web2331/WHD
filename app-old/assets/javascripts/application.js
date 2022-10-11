/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
  
  let selectElement = document.querySelector('#select-electricity-supplier')

  if ( $(selectElement).length ) {
    accessibleAutocomplete.enhanceSelectElement({
      displayMenu: 'overlay',
      showAllValues: true,
      preserveNullOptions: true,
      selectElement: selectElement
    })  
  }

})
