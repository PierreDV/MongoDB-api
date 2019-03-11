import express from 'express';
import cors from 'cors';
import '@babel/polyfill';
import User from './src/controllers/User';
import BlogPost from './src/controllers/BlogPost';
import Auth from './src/middleware/Auth';

const app = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
// Default route
app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Your enpoint is working'});
});
// User routes
app.post('/api/v1/users', User.create);
app.post('/api/v1/users/login', User.login);
// Blog post routes
app.get('/api/v1/blog_posts', BlogPost.getAll);
app.get('/api/v1/blog_posts/links', BlogPost.getAllLinks);
app.get('/api/v1/user/:id/blog_posts', BlogPost.getAllFromAuthor);
app.get('/api/v1/blog_posts/:id', BlogPost.getOne);
app.post('/api/v1/blog_posts', Auth.verifyToken, BlogPost.create);
app.put('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.update);
app.delete('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.delete);

app.listen(8080);
console.log('app running on port 8080');