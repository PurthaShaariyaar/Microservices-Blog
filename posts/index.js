// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');

// Create an express application
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

// Data structure (object) to store posts (initially empty)
const posts = {};

// Route handler endpoint to get all posts
app.get('/posts', (req, res) => {
  res.send(posts);
});

/**
 * Route handler endpoint to create a new post
 * Calls randomBytes to generate a random id for the new post
 * Extracts the title -> creates a new post object with the generated id & title
 */
app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  };

  res.status(201).send(posts[id]);
});

// Start the server & listen on port 4000
app.listen(4000, () => {
  console.log('Listening on port 4000...');
});

