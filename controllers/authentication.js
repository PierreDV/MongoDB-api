const db = require('../db');

exports.signup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	db.getUserByEmail(email);

	// See if a user with the given email exists

	// If a user with email does exist, return an error

	// If a user with email does NOT exist, create and save user record

	// Respond to request indicating the user was created
};