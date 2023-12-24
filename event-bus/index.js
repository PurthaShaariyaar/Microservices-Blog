// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Create an express application
const app = express();

// Use bodyParser middleware to parse JSON in the request body
app.use(bodyParser.json());

