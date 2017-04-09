var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var request = require('request');

var apikey = "1d15e48ca9e6b3db7a8dc1d94b284190"; //Nessie

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
											var options = {
												url: 'http://api.reimaginebanking.com/customers?key=' + apikey,
												headers: {
													"Content-Type": "application/json",
													"Accept": "application/json"
												},
												body: JSON.stringify({
														"first_name": username,
														"last_name": "null",
														"address": {
															"street_number": "null",
															"street_name": "null",
															"city": "null",
															"state": "ca",
															"zip": "94306"
														}
													})
											};

											request.post(options, function(error, response, body) {
												if (!error) {
													var options2 = {
														url: 'http://api.reimaginebanking.com/customers/' + JSON.parse(body).objectCreated._id + '/accounts?key=' + apikey,
														headers: {
															"Content-Type": "application/json",
															"Accept": "application/json"
														},
														body: JSON.stringify({
															"type": "Checking",
															"nickname": "Admiral Account",
															"rewards": 0,
															"balance": 0
														})
													};

													request.post(options2, function(error2, response, body2) {
															// if there is no user with that email
			                        // create the user
			                        var newUser = new User();

			                        // set the user's local credentials
			                        newUser.username = username;
			                        newUser.password = createHash(password);
			                        newUser.siteAddress = req.param('address') || "";
			                        newUser.billingCode = req.param('billing') || "";
															newUser.show_by_default = false;
															newUser.adbucks = 100;
															newUser.account_id = JSON.parse(body2).objectCreated._id;
															newUser.customer_id= JSON.parse(body).objectCreated._id;

			                        // save the user
			                        newUser.save(function(err) {
			                            if (err){
			                                console.log('Error in Saving user: '+err);
			                                throw err;
			                            }
			                            console.log('User Registration succesful');
			                            return done(null, newUser);
			                        });
														});
													}
											});
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
