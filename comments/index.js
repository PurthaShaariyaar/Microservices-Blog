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

// Data structure (object) to store all comments
const commentsByPostId = {};

/**
 * Route handler to get all comments
 * Either send the entire array with objects of id & comments, or (||) an empty array
 */
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

/**
 * Route handler to create a comment
 * Calls randomBytes to generate a random id for the new comment
 * Extract the content property in the request body
 * Either retrieve all existing comments or (||) initialize comments to an empty array
 * Push the new comment with id & content to the comments array
 * Update the commentsByPostId object with the new comments array
 * When a comment is created -> route handler posts it to the event bus (an event)
 */
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id
    }
  });

  res.status(201).send(comments);
});

/**
 * Route handler to post it received an event and respond with a status of ok
 * Respond by 2 parameters: received event & type via request body
 */
app.post('/events', (req, res) => {
  console.log('Received event.', req.body.type);

  res.send({});
});

// Start the server & listen on port 4001
app.listen(4001, () => {
  console.log('Listening on port 4001...');
});
