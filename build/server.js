"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

require("@babel/polyfill");

var _User = _interopRequireDefault(require("./src/controllers/User"));

var _BlogPost = _interopRequireDefault(require("./src/controllers/BlogPost"));

var _Auth = _interopRequireDefault(require("./src/middleware/Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
app.use((0, _cors.default)({
  origin: 'http://localhost:3000'
}));
app.use(_express.default.json()); // Default route

app.get('/', function (req, res) {
  return res.status(200).send({
    'message': 'Your enpoint is working'
  });
}); // User routes

app.post('/api/v1/users', _User.default.create);
app.post('/api/v1/users/login', _User.default.login); // Blog post routes

app.get('/api/v1/blog_posts', _BlogPost.default.getAll);
app.get('/api/v1/blog_posts/links', _BlogPost.default.getAllLinks);
app.get('/api/v1/user/:id/blog_posts', _BlogPost.default.getAllFromAuthor);
app.get('/api/v1/blog_posts/:id', _BlogPost.default.getOne);
app.post('/api/v1/blog_posts', _Auth.default.verifyToken, _BlogPost.default.create);
app.put('/api/v1/blog_posts/:id', _Auth.default.verifyToken, _BlogPost.default.update);
app.delete('/api/v1/blog_posts/:id', _Auth.default.verifyToken, _BlogPost.default.delete);
app.listen(8080);
console.log('app running on port 8080');