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

 // ==
 // == /
 // ==
api.get('/', (req, res) => {
  AU.sendResponse(res, false, 'Hello from the API!');
})

// ==
// == /overview
// ==
api.get('/overview', (req, res) => {
  res.json({
    totalKwh: 'Usage: /api/totalkwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm. The to parameter is optional, if not specified current date is used. Times are also optional, if not specified 00:00 will be used.'
  })
})

// ==
// == /totalKwh
// ==
api.get('/totalKwh', async (req, res) => {
  try {
    const timeframe = AU.getTimeframeFromRequest(req, res);

    let query = QUERIES.TOTAL_WH_QUERY;
    query.body.query.bool.filter[1].range["@timestamp"].gte = timeframe[0];
    query.body.query.bool.filter[1].range["@timestamp"].lte = timeframe[1];

    const result = await client.search(query);
    const maxSum = result.body.aggregations.maxsum.value;
    const minSum = result.body.aggregations.minsum.value;
    const kwh = (maxSum - minSum) / 1000;
    AU.sendResponse(res, false, kwh, timeframe[0], timeframe[1]);

  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})

// ==
// == /fuseKwhBetween
// ==
api.get('/fuseKwhBetween', async (req, res) => {
  try {
    const timeFrom = AU.getDateTimeFromRequest(req, 'from');
    const timeframe = AU.getTimeframeFromRequest(req);
    const queryFuseDescription = AU.getEssentialQueryParamFromRequest(req, 'fuse');

    const minWh = await getFuseWhAt(res, timeFrom, queryFuseDescription);

    let query = QUERIES.MAX_WH_FOR_FUSE_QUERY;
    query.body.query.bool.filter[0].match_phrase.fuseDescription = queryFuseDescription.replace(/_/g, " ");
    query.body.query.bool.filter[1].range["@timestamp"].gte = timeframe[0];
    query.body.query.bool.filter[1].range["@timestamp"].lte = timeframe[1];

    const result = await client.search(query);
    const maxWh = result.body.aggregations.maxFuseWh.value;
    AU.sendResponse(res, false, (maxWh - minWh) / 1000 , timeframe[0], timeframe[1]);

  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})



/**
 * HELPER FUNCTIONS =================================================================================================================
 */

async function getFuseWhAt(res, atTime, queryFuseDescription) {
  try {
    const timeFrom = AU.toElasticDatetimeString(atTime.subtract(1, 'm'));
    const timeTo = AU.toElasticDatetimeString(atTime.add(1, 'm'));

    let query = QUERIES.MAX_WH_FOR_FUSE_QUERY;
    query.body.query.bool.filter[0].match_phrase.fuseDescription = queryFuseDescription.replace(/_/g, " ");
    query.body.query.bool.filter[1].range["@timestamp"].gte = timeFrom;
    query.body.query.bool.filter[1].range["@timestamp"].lte = timeTo;

    const result = await client.search(query);
    return result.body.aggregations.maxFuseWh.value;

  } catch (err) {
    throw err;
  }
}


module.exports = api;
