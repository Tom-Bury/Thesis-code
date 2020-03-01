/**
 * This file contains the express app representing the API for various functions.
 */

// Constants, libraries, etc.
const dayjs = require('dayjs');
const API_OVERVIEW = require('./api-overview.js')
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
  res.send(API_OVERVIEW.API_OVERVIEW)
})

// ==
// == /totalKwh
// ==
api.get('/totalKwh', async (req, res) => {
  try {
    const timeframe = AU.getTimeframeFromRequest(req, res);
    const kwh = await getTotalKwh(timeframe);
    AU.sendResponse(res, false, {
      timeFrom: timeframe[0],
      timeTo: timeframe[1],
      value: kwh
    });

  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})

// ==
// == /fuseKwh
// ==
api.get('/fuseKwh', async (req, res) => {
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
    AU.sendResponse(res, false, {
      timeFrom: timeframe[0],
      timeTo: timeframe[1],
      value: (maxWh - minWh) / 1000
    });

  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})

// ==
// == /weekUsage
// ==
api.get('/weekUsage', async (req, res) => {

  function getWeekdayKwhPromise(now, i) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currDayName = days[i];
    const timeframe = [now.day(i).startOf('day'), now.day(i).endOf('day')].map(AU.toElasticDatetimeString);
    return new Promise(async (resolve, reject) => {
      try {
        const kwh = await getTotalKwh(timeframe);
        resolve({
          'day': currDayName,
          'timeFrom': timeframe[0],
          'timeTo': timeframe[1],
          'kwh': kwh
        });
      } catch (err) {
        throw err;
      }
    });
  }

  try {
    const now = dayjs().hour(12).minute(0).second(0).millisecond(0);
    const weekKwh = [];

    if (now.day() === 0) {
      for (i = -6; i < 1; i++) {
        weekKwh.push(getWeekdayKwhPromise(now, i));
      }
    } else {
      for (i = 1; i < 8; i++) {
        weekKwh.push(getWeekdayKwhPromise(now, i));
      }
    }

    AU.sendResponse(res, false, await Promise.all(weekKwh));
  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})

// ==
// == /todayUsage
// ==
api.get('/todayUsage', async (req, res) => {
  try {
    const now = dayjs();
    const timeframe = [now.startOf('day'), now.endOf('day')].map(AU.toElasticDatetimeString);
    const kwh = await getTotalKwh(timeframe);
    AU.sendResponse(res, false, kwh, timeframe[0], timeframe[1]);
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

async function getTotalKwh(timeframe) {
  try {
    let query = QUERIES.TOTAL_WH_QUERY;
    query.body.query.bool.filter[1].range["@timestamp"].gte = timeframe[0];
    query.body.query.bool.filter[1].range["@timestamp"].lte = timeframe[1];

    const result = await client.search(query);
    const maxSum = result.body.aggregations.maxsum.value;
    const minSum = result.body.aggregations.minsum.value;
    const kwh = (maxSum - minSum) / 1000;
    return kwh;

  } catch (err) {
    throw err;
  }
}

module.exports = api;
