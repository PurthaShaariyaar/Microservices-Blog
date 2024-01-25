// Install required modules
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Create an express application
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

/**
 * Route handler to update the status data of a comment & send it to the event bus
 * Extract the content in the request body
 * Check the type property & filter the moderated word -> update status
 * Async & await post
 */
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        content: data.content,
        postId: data.postId,
        status
      }
    });
  }

  res.send({});
});

// Start the server & listen on
app.listen(4003, () => {
  console.log('Listening on port 4003...');
});
