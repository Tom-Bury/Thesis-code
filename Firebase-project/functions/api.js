/**
 * This file contains the express app representing the API for various functions.
 */

// Constants, libraries, etc.
const AU = require('./api-utils.js');
const QUERIES = require('./elastic-queries.js');
const express = require('express');
const api = express();
const {
  Client
} = require('@elastic/elasticsearch');
const client = new Client({
  node: 'https://tombury:oyjnyEmX4rmqh6bt@60e177cf0f9e45a7b5b92b1043675681.europe-west1.gcp.cloud.es.io:9243'
});

/**
 * API =================================================================================================================
 */

api.get('/', (req, res) => {
  res.json({
    hello: 'world, from the api!'
  });
})


api.get('/totalKwh', (req, res) => {
  try {
    const timeframe = AU.getTimeframeFromRequest(req, res);

    let query = QUERIES.TOTAL_WH_QUERY;
    query.body.query.bool.filter[1].range["@timestamp"].gte = timeframe[0];
    query.body.query.bool.filter[1].range["@timestamp"].lte = timeframe[1]

    client.search(query, (err, result) => {
      if (err) {
        AU.sendResponse(res, true, err);
      } else {
        const maxSum = result.body.aggregations.maxsum.value;
        const minSum = result.body.aggregations.minsum.value;
        const kwh = (maxSum - minSum) / 1000;
        AU.sendResponse(res, false, kwh, timeframe[0], timeframe[1]);
      }
    });

  } catch (err) {
    AU.sendResponse(res, true, err);
  }

})


module.exports = api;
