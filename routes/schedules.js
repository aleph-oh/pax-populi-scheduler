var express = require("express");
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var PythonShell = require('python-shell');
var Schedule = require("../models/schedule.js");
var Registration = require("../models/registration.js");
var authentication = require('../javascripts/authentication.js');
var csrf = require('csurf');
var ObjectId = mongoose.Schema.Types.ObjectId;

//GET request for seeing schedule

// DELETE where should this happen?

// PUT maybe we want ppl to be able to update and then send verifications to Admin/tutor/student


// gets all the registration objects and feed those to the python script 
// to get the pairs
router.get('/match', authentication.isAuthenticated, function(req, res, next) {

	Registration.getUnmatchedRegistrations(function (err, registrations) {
		// Inputs to Simon's script, hardcoding for now.
		var registrations = [{'user': '1111', 'availability': {'0': ['11:00 - 13:00'], '3': ['2:00 - 5:00']},
							'genderPref': ['Male', 'Female'], 'course': 'Intermediate English',
							'isMatched': false},
						  {'user': '1112', 'availability': {'1': ['10:00 - 12:00'], '5': ['1:00 - 5:00']},
							'genderPref': ['Female'], 'course': 'Intermediate English',
							'isMatched': false}
						];

		var city_capacity = {'Boston': 10, 'Cambridge': 5, 'Bangkok': 3};

		var options = {
			mode: 'json',
			scriptPath: './scheduler/',
			args: [JSON.stringify(registrations), JSON.stringify(city_capacity)]
		};

		PythonShell.run('match.py', options, function (err, matches) {
		  if (err) {
		  	throw err;
		  }
		  // matches is an array consisting of messages collected during execution
		  console.log('matches:', typeof matches, matches);
		  // process the JSON objs and write to db
		});
	});
});

// gets all the registration objects and feed those to the python script 
// to get the pairs
router.get('/match', authentication.isAuthenticated, function(req, res, next) {
	Registration.getAllUnmatchedRegistrations(function (err, unmatchedRegistrations) {
		var options = {
			mode: 'json',
			scriptPath: './scheduler/',
			args: [JSON.stringify(unmatchedRegistrations), JSON.stringify(city_capacity)]
		}

		PythonShell.run('match.py', options, function (err, matches) {
		  if (err) {
		  	throw err;
		  }
		  // matches is an array consisting of messages collected during execution
		  console.log('matches:', typeof matches, matches);
		});

		// parse the string and write to db
	});
});

module.exports = router; //keep at the bottom of the file
