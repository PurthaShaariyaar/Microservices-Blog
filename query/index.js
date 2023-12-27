// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an express applicaiton
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

// Bypass CORS error
app.use(cors());

// Data structure to store all posts (including comments) essentially an object
const posts = {};

/**
 * Route handler to send all posts
 */
app.get('/posts', (req, res) => {
  res.send(posts);
});

/**
 * Route handler to handle all post events
 * Destructure the data from the request body: type & data
 * Runs 2 type checks (if statement) -> associate the id the posts & insert in destructured data
 */
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content });
  }

  console.log(posts);

  res.send({});
});

// Start the server & listen on port 4002
app.listen(4002, () => {
  console.log('Listening on port 4002...');
});
