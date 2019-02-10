import express from 'express';
import '@babel/polyfill';
import User from './src/controllers/User';
import BlogPost from './src/controllers/BlogPost';
import Auth from './src/middleware/Auth';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	return res.status(200).send({'message': 'Your enpoint is working'});
});

app.post('/api/v1/users', User.create);
app.post('/api/v1/users/login', User.login);

app.post('/api/v1/blog_posts', Auth.verifyToken, BlogPost.create);
app.get('/api/v1/blog_posts', Auth.verifyToken, BlogPost.getAll);
app.get('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.getOne);
app.put('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.update);
app.delete('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.delete);

app.listen(8080);
console.log('app running on port 8080');