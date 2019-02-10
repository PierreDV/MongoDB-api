import express from 'express';

const app = express();

app.use(express.json);

app.get('/', (req, res) => {
	return res.status(200).send({'message': 'Your enpoint is working'});
});

app.listen(8080);
console.log('app running on port 8080');