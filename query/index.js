// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Create an express applicaiton
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

// Bypass CORS error
app.use(cors());

// Data structure to store all posts (including comments) essentially an object
const posts = {};

/**
 * Event handler to check type of event & proceed with next logic
 */

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, postId, status, content } = data;

    const post = posts[postId];

    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

/**
 * Route handler to send all posts
 */
app.get('/posts', (req, res) => {
  res.send(posts);
});

/**
 * Route handler to handle all post events
 * Destructure the data from the request body: type & data
 * Calls handleEvent to pass in the type & data parameters
 */
app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

/**
 * Start listening on port 4002
 * As soon as the query service is up > requests a get of all events
 */
app.listen(4002, async () => {
  console.log('Listening on port 4002...');

  try {
    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
      console.log('Processing event: ', event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
