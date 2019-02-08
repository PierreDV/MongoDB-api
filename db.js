const Pool = require('pg').Pool;
const secrets = require('./secrets');

const pool = new Pool({
	user: secrets.psql_user,
	host: 'localhost',
	database: 'blog_api',
	password: secrets.psql_user_password,
	port: 5432,
});

const getUsers = (_, res) => {
	pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

const getUserById = (req, res) => {
	const id = parseInt(req.params.id);

	pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

const createUser = (req, res) => {
	const { email, password } = req.body;

	pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(201).send(`User added with ID: ${results.insertId}`);
	});
};

const updateUser = (req, res) => {
	const id = parseInt(req.params.id);
	const { email, password } = req.body;

	pool.query(
		'UPDATE users SET email = $1, password = $2 WHERE id = $3',
		[email, password, id],
		(error) => {
			if (error) {
				throw error;
			}
			res.status(200).send(`User modified with ID: ${id}`);
		}
	);
};

const deleteUser = (req, res) => {
	const id = parseInt(req.params.id);

	pool.query('DELETE FROM users WHERE id = $1', [id], (error) => {
		if (error) {
			throw error;
		}
		res.status(200).send(`User deleted with ID: ${id}`);
	});
};

const getUserByEmail = (email) => {
	email = email.toLowerCase();

	pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
		if (error) {
			throw error;
		}
		console.log(results.rows);
		return results.rows;
	});
};

module.exports = {
	getUsers,
	getUserById,
	getUserByEmail,
	createUser,
	updateUser,
	deleteUser,
};