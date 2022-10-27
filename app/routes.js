const express = require('express')
const router = express.Router()

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

  if (name == "my name" || name == "my partner's name" || name === "My Department of Work and Pension's (DWP) Appointee") {
    res.redirect('/electricity-supplier')
  } if (name == "my landlord's name") {
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
  } if (data == "Pension Credit Guarantee Credit") {
    res.redirect('/eligible-letter-wait')
  } else if ( checker(["Child Tax Credit", "Working Tax Credit"], data) ) {
    res.redirect('/household-occupants')
  } else {
    res.redirect('/property-type')
  }

})

router.post('/income-validate', function (req, res) {

  var data = req.session.data['household-income']

  if (data <= 20000) {
    res.redirect('/property-type')
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

  if (data == "Deatached house") {
    res.redirect('/eligible-unqualified')
  } else {
    res.redirect('/eligible-qualified')
  }

})
