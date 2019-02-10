const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
	console.log('connected to the db');
});

const createUserTable = () => {
	const queryText = 
		`CREATE TABLE IF NOT EXISTS
			users(
				id UUID PRIMARY KEY,
				email VARCHAR(128) UNIQUE NOT NULL,
				password VARCHAR(128) NOT NULL,
				created_at TIMESTAMP,
				modified_at TIMESTAMP
			)`;
	
	pool.query(queryText)
		.then((res) => {
			console.log(res);
			pool.end();
		})
		.catch((err) => {
			console.log(err);
			pool.end();
		});
};

const createBlogPostTable = () => {
	const queryText =
		`CREATE TABLE IF NOT EXISTS
			blog_posts(
				id UUID PRIMARY KEY,
				title VARCHAR(128) NOT NULL,
				body_text TEXT NOT NULL,
				author_id UUID NOT NULL,
				created_at TIMESTAMP,
				modified_at TIMESTAMP,
				FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
			)`;
	pool.query(queryText)
		.then((res) => {
			console.log(res);
			pool.end();
		})
		.catch((err) => {
			console.log(err);
			pool.end();
		});
};

const dropUserTable = () => {
	const queryText = 'DROP TABLE IF EXISTS users returning *';
	pool.query(queryText)
		.then((res) => {
			console.log(res);
			pool.end();
		})
		.catch((err) => {
			console.log(err);
			pool.end();
		});
};

const dropBlogPostTable = () => {
	const queryText = 'DROP TABLE IF EXISTS blog_posts returning *';
	pool.query(queryText)
		.then((res) => {
			console.log(res);
			pool.end();
		})
		.catch((err) => {
			console.log(err);
			pool.end();
		});
};

pool.on('remove', () => {
	console.log('client removed');
	process.exit(0);
});

module.exports = {
	createUserTable,
	createBlogPostTable,
	dropUserTable,
	dropBlogPostTable
};

require('make-runnable');