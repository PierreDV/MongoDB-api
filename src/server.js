import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import '@babel/polyfill';
import User from './controllers/User';
import BlogPost from './controllers/BlogPost';
import Auth from './middleware/Auth';

const app = express();

app.use(cors({origin: process.env.FRONT_END_HOST}));
app.use(express.json());
app.use(bodyParser.json());
// Default route
app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Your enpoint is working'});
});
// User routes
app.post('/api/v1/users', User.create);
app.post('/api/v1/users/login', User.login);
app.post('/api/v1/verify_user', User.verify);
// Blog post routes
app.get('/api/v1/blog_posts', BlogPost.getAll);
app.get('/api/v1/blog_posts/links', BlogPost.getAllLinks);
app.get('/api/v1/user/:id/blog_posts', BlogPost.getAllFromAuthor);
app.get('/api/v1/blog_posts/:id', BlogPost.getOne);
app.post('/api/v1/blog_posts', Auth.verifyToken, BlogPost.create);
app.put('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.update);
app.delete('/api/v1/blog_posts/:id', Auth.verifyToken, BlogPost.delete);

var server_port = process.env.PORT || 80;
var server_host = '0.0.0.0';

if(app.settings.env === 'development') {
  app.listen(8080, () => {
    console.log('Listening on port 8080');
  })
} else {
  app.listen(server_port, server_host, () => {
    console.log('Listening on port %d', server_port);
});
}


