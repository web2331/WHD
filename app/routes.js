const express = require('express')
const router = express.Router()

const request = require('sync-request')
// Add your routes here - above the module.exports line

module.exports = router

// Run this code when a form is submitted to 'region-checker'
router.post('/region-checker', function (req, res) {

  // Make a variable and give it the value from user input
  var region = req.session.data['region']

  // Check whether the variable matches a condition
  if (region == "England" || region == "Wales") {
    // Send user to next page
    res.redirect('/letter')
  } if (region == "Northern Ireland") {
    // Send user to ineligible region
    res.redirect('/ineligible-region-ni')
  } else {
    // Send user to ineligible region
    res.redirect('/ineligible-region')
  }

})

// Run this code when a form is submitted to 'letter-validate'
router.post('/letter-validate', function (req, res) {

  var data = req.session.data['letter']

  if (data == "yes") {
    res.redirect('/letter-reference')
  } else {
    res.redirect('/name-on-bill')
  }

})

router.post('/letter-ref-validate', function (req, res) {

  var data = req.session.data['letter-ref']

  if (data == "whds1" || data == "whds3") {
    res.redirect('/eligible-letter-code')
  } else if (data == "whds2" || data == "whds4") {
    res.redirect('/eligible-letter-advice')
  } else {
    res.redirect('/name-on-bill')
  }

})

router.post('/bill-name-validate', function (req, res) {

  var name = req.session.data['name-on-bill']

  if (name == "your name" || name == "your partner's name" || name === "Someone who deals with the Department for Work and Pensions on your behalf (your 'appointee')") {
    res.redirect('/electricity-supplier')
  } if (name == "your landlord's name") {
    res.redirect('/ineligible-bill-name-landlord')
  } else {
    res.redirect('/ineligible-bill-name')
  }

})

router.post('/energy-supplier-validate', function (req, res) {

  var name = req.session.data['electricity-supplier']

  if (name == "My supplier is not listed") {
    res.redirect('/ineligible-supplier')
  } else {
    res.redirect('/benefits')
  }

})

router.post('/benefits-validate', function (req, res) {

  var data = req.session.data['benefits']
  let checker = (arr, target) => target.every(v => arr.includes(v));

  if (data == "none") {
    res.redirect('/ineligible-benefits')
  } if (data == "The 'Guarantee Credit' part of Pension Credit") {
    res.redirect('/eligible-letter-wait')
  } else if ( checker(["Child Tax Credit", "Working Tax Credit"], data) ) {
    res.redirect('/household-occupants')
  } else {
    res.redirect('/postcode')
  }

})

router.post('/select-address', function (req, res) {
  var data = req.session.data['postcode']

  var url = "https://beis-epc-api-prototype.azurewebsites.net/api/GetCertificates?code=hKmrGolL_RbeDpithM3fMNcFOiJFfCcmLVC7NPSPXR01AzFuXOkRdQ==&postcode=" + data;
  var fetch = request('GET', url);
  var results = fetch.getBody()

  const parseResults = (obj, prefix) => {
    var arr = Object.entries(obj).reduce((acc, [key, value]) => {
      acc.push({ address: value['address'] + ', ' + value['posttown'] + ', ' + data, type: value['built-form'], size: value['total-floor-area'], age: value['construction-age-band'].replace('England and Wales: ', '') });
      return acc;
    }, []);
    return arr;
  };

  if ( results.length != 0 ) {
    results = parseResults( JSON.parse( results).rows ).sort((a, b) => (a.address.localeCompare(b.address, undefined, { numeric: true })));
  } else {
    results = false;
  }
 
  res.render('select-address.html', { postcodeResults: results })
})

router.get('/check-property-details', function (req, res) {
  req.session.data['property-type'] = req.query.propertyType;
  req.session.data['property-age'] = req.query.propertyAge;
  req.session.data['property-size'] = req.query.propertySize;
  req.session.data['postcodeLookup'] = true;
  
  res.render('check-property-details.html', { propertyDetails: { address: req.query.address, type: req.query.propertyType, age: req.query.propertyAge, size: req.query.propertySize } })
})

router.post('/income-validate', function (req, res) {

  var data = req.session.data['household-income']

  if (data <= 20000) {
    res.redirect('/postcode')
  } else {
    res.redirect('/ineligible-income')
  }

})

router.post('/epc-validate', function (req, res) {

  var data = req.session.data['epc']

  if (data == "yes") {
    res.redirect('/property-type')
  } else {
    res.redirect('/ineligible-epc')
  }

})

router.post('/property-type-validate', function (req, res) {

  var data = req.session.data['property-type']
  req.session.data['postcodeLookup'] = false;

  if (data == "Park (mobile) home") {
    res.redirect('/ineligible-property-parkhome')
  } else if (data == "Other") {
    res.redirect('/ineligible-property')
  } else {
    res.redirect('/property-age')
  }

})

router.post('/answer-validate', function (req, res) {

  var data = req.session.data['property-type']
  var lookup = req.session.data['postcodeLookup'];
  
  if ( (data == "Detached house" || data == "Detached") && ( lookup ) ) {
    res.redirect('/eligible-unqualified-epc')
  } else if ( lookup ) {
    res.redirect('/eligible-qualified-epc')
  }

  if (data == "Detached house" || data == "Detached") {
    res.redirect('/eligible-unqualified')
  } else {
    res.redirect('/eligible-qualified')
  }

})
