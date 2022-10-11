/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()

  let selectElement = document.querySelector('#electricity-supplier')

  if ( $(selectElement).length ) {
    const name = selectElement.name;
    selectElement.setAttribute('name', '');

    accessibleAutocomplete.enhanceSelectElement({
      name: name,
      displayMenu: 'overlay',
      showAllValues: true,
      preserveNullOptions: true,
      selectElement: selectElement,
      dropdownArrow: function (config) {
        return '<svg class="' + config.className + '" version="1.1" xmlns="http://www.w3.org/2000/svg" focusable="false" style="z-index:0;"><g stroke="none" fill="none" fill-rule="evenodd"><polygon fill="#000000" points="0 0 22 0 11 17"></polygon></g></svg>'
      },
      source: function matcher(query, populateResults) {
        if (!query) {
          populateResults(Array.from(selectElement.options));
        } else {
          populateResults(
            Array.from(selectElement.options).filter(function(option) {
              var optString = option.innerText.trim().toLowerCase(); 
              return optString.indexOf(query.toLowerCase()) !== -1 || optString.indexOf("not listed".toLowerCase()) !== -1;
            })
          );
        }
      },
      templates: {
        inputValue: function inputValue(option) {
          return option && option.value;
        },
        suggestion: function suggestion(option) {
          return option && option.innerText.trim();
        }
      }
    })
  }

})
