const db = require('./db');
const Authentication = require('./controllers/authentication');

module.exports = (app) => {
	app.post('/users', Authentication.signup);
};
