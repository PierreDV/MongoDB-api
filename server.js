import express from 'express';
import dotenv from 'dotenv';
import '@babel/polyfill';
import User from './src/controllers/User';

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	return res.status(200).send({'message': 'Your enpoint is working'});
});

app.post('/api/v1/users', User.create);

app.listen(8080);
console.log('app running on port 8080');