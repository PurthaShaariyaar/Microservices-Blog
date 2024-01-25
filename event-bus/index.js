// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Create an express application
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

// Array to store all events
const events = [];

/**
 * Route handler to post each event per service to query service
 * Extract the body of the request
 * Each post includes a catch error block
 */
app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post('http://posts-clusterip-srv:4000/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://comments-srv:4001/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://query-srv:4002/events', event).catch((err) => {
    console.log(err.message);
  });

  axios.post('http://moderation-srv:4003/events', event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'OK' });
});

/**
 * Request handler to send all events upon request
 */
app.get('/events', (req, res) => {
  res.send(events);
});

// Start the server and listen on port 4005
app.listen(4005, () => {
  console.log('Listening on port 4005...');
});
