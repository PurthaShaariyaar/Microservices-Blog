// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// Create an express application
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

// Bypass CORS error
app.use(cors());

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
 * When a post is created -> a route handler posts it to the event bus (an event)
 */
app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  };

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id, title
    }
  });

  res.status(201).send(posts[id]);
});

/**
 * Route handler to post it received an event and respond with a status of ok
 * Respond by 2 parameters: received event & type via request body
 */
app.post('/events', (req, res) => {
  console.log('Received event.', req.body.type);

  res.send({});
});

// Start the server & listen on port 4000
app.listen(4000, () => {
  console.log('v55');
  console.log('Listening on port 4000...');
});

