import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import { create } from 'domain';
import { getEnabledCategories } from 'trace_events';

const BlogPost = {
	async create(req, res) {
		const createQuery = `INSERT INTO
			blog_posts(id, title, body_text, author_id, created_at, updated_at)
			VALUES($1, $2, $3, $4, $5, $6)
			returning *`;
		const values = [
			uuidv4(),
			req.body.title,
			req.body.body_text,
			req.user.id,
			moment(new Date()),
			moment(new Date())
		];

		try {
			const { rows } = await db.query(createQuery, values);
			return res.status(201).send(rows[0]);
		} catch(error) {
			return res.status(400).send(error);
		}
	},
	async getAll(req, res) {
		const findAllQuery = 'SELECT * FROM blog_posts WHERE author_id = $1';
		try {
			const { rows, rowCount } = await db.query(findAllQuery, [req.user.id]);
			return res.status(200).send({ rows, rowCount });
		} catch(error) {
			return res.status(400).send(error);
		}
	},
	async getOne(req, res) {
		const text = 'SELECT * FROM blog_posts WHERE id = $1 AND author_id = $2';
		try {
			const { rows } =await db.query(text, [req.params.id, req.user.id]);
			if(!rows[0]) {
				return res.status(404).send({'message': 'blog post not found.'});
			}
			return res.status(200).send(rows[0]);
		} catch(error) {
			return res.status(400).send(error);
		}
	}
}

export default BlogPost;