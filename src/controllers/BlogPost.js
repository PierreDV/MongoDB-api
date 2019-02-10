import moment, { updateLocale } from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const findOneQuery = 'SELECT * FROM blog_posts WHERE id = $1';

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
		const findAllQuery = 'SELECT * FROM blog_posts';
		try {
			const { rows, rowCount } = await db.query(findAllQuery, []);
			return res.status(200).send({ rows, rowCount });
		} catch(error) {
			return res.status(400).send(error);
		}
	},
	async getAllFromAuthor(req, res) {
		const findAllFromAuthorQuery = 'SELECT * FROM blog_posts WHERE author_id = $1';
		try {
			const { rows, rowCount } = await db.query(findAllFromAuthorQuery, [req.params.id]);
			return res.status(200).send({ rows, rowCount });
		} catch(error) {
			return res.status(400).send(error);
		}
	},
	async getOne(req, res) {
		try {
			const { rows } =await db.query(findOneQuery, [req.params.id]);
			if(!rows[0]) {
				return res.status(404).send({'message': 'blog post not found.'});
			}
			return res.status(200).send(rows[0]);
		} catch(error) {
			return res.status(400).send(error);
		}
	},
	async update(req, res) {
		const updateQuery = `UPDATE blog_posts
			SET title=$1, body_text=$2, updated_at=$3
			WHERE id=$4 AND author_id=$5 returning *`;
		try {
			const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
			if(!rows[0]) {
				return res.status(404).send({'message': 'blog post not found'});
			}
			const values = [
				req.body.title || rows[0].title,
				req.body.body_text || rows[0].body_text,
				moment(new Date()),
				req.params.id,
				req.user.id
			];
			const response = await db.query(updateQuery, values);
			return res.status(200).send(response.rows[0]);
		} catch(error) {
			return res.status(400).send(error);
		}
	},
	async delete(req, res) {
		const deleteQuery = 'DELETE FROM blog_posts WHERE id=$1 AND author_id = $2 returning *';
		try {
			const { rows } = await db.query(deleteQuery, [req.params.id, req.user.id]);
			if(!rows[0]) {
				return res.status(404).send({'message': 'blog post not found'});
			}
			return res.status(204).send({'message': 'blog post deleted'});
		} catch(error) {
			return res.status(400).send(error);
		}
	}
}

export default BlogPost;