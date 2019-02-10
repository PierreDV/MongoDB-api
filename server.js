import express from 'express';
import User from './src/controllers/User';
import '@babel/polyfill';

const app = express();

app.use(express.json);

app.get('/', (req, res) => {
	return res.status(200).send({'message': 'Your enpoint is working'});
});

app.post('/api/v1/users', User.create);

app.listen(8080);
console.log('app running on port 8080');