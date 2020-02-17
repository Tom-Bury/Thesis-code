/**
 * This file contains the express app representing the API for various functions.
 */

const express = require('express');
const api = express();

api.get('/', (req, res) => {
  res.json({
    hello: 'world, from the api!'
  });
})


api.get('/test', (req, res) => {
  res.json({
    hello: 'world, from the api/test!'
  });
})

api.get('/do_calculation', (req, res) => {
  const result = 2 + 40;

  res.json({
    answer: result
  });
})



module.exports = api;
