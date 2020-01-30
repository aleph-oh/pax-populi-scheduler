var Config = function() {

 	var that = Object.create(Config.prototype);

 	that.emailAddress = function () {
 		return 'aecfg2020test@gmail.com';
 	}

 	that.emailPassword = function () {
 		return 'password11!';
 	}

 	that.productionUrl = function () {
 		return 'http://localhost:3000'
 	}

 	that.adminUsername = function () {
 		return 'superadmin';
 	}

 	that.adminFirstName = function () {
 		return 'test';
 	}

 	that.adminLastName = function () {
 		return 'administrator';
 	}

 	that.adminPhoneNumber = function () {
 		return 5550000000;
 	}

 	that.adminPassword = function () {
 		return 'password11!';
 	}

 	that.adminEmailAddress = function () {
 		return 'aecfg2020test@gmail.com';
 	}

 	that.databaseAddress = function () {
 		return 'mongodb://localhost:27017'
	}

 	Object.freeze(that);
 	return that;
 };



 module.exports = Config();
