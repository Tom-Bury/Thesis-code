/**
 * This file contains the express app representing the API for various functions.
 */

// Constants, libraries, etc.
const dayjs = require('dayjs');
var AdvancedFormat = require('dayjs/plugin/utc')
dayjs.extend(AdvancedFormat)

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



const DT = require('./dateTime.js');

/**
 * API =================================================================================================================
 */

// ==
// == HELPER API CALLS
// ==
api.get('/', (req, res) => {
  AU.sendResponse(res, false, 'Hello from the API!');
})


api.get('/currentTime', (req, res) => {
  try {
    AU.sendResponse(res, false, {
      currTimeUTC: DT.getCurrentUTCTimeJS().format(),
      currTimeBeLocal: DT.toLocal(DT.getCurrentUTCTimeJS()).format(),
      epochSeconds: DT.getCurrentUTCTimeJS().unix(),
    });
  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})


api.get('/parseTimeFrame', (req, res) => {
  try {
    AU.sendResponse(res, false, {
      resultUTC: DT.getUTCTimeframeFromLocalRequestDayjs(req).map(d => d.format()),
      resultBeLocal: DT.getUTCTimeframeFromLocalRequestDayjs(req).map(d => DT.toLocal(d).format()),
      resultEpochSeconds: DT.getUTCTimeframeFromLocalRequestDayjs(req).map(d => d.unix()),
    });
  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})


// ==
// == /overview  //TODO
// ==
api.get('/overview', (req, res) => {
  res.send(API_OVERVIEW.API_OVERVIEW);
})

// ==
// == /totalKwh
// ==
api.get('/totalKwh', async (req, res) => {
  try {
    const timeframe = DT.getUTCTimeframeFromLocalRequestDayjs(req);
    const response = await getTotalKwh(timeframe);
    AU.sendResponse(res, false, {
      timeFrom: response.timeFromBeLocal,
      timeTo: response.timeToBeLocal,
      value: response.totalkWh
    });
  } catch (error) {
    AU.sendResponse(res, true, error);
  }

})

// ==
// == /totalKwhMultiple
// ==
api.get('/totalKwhMultiple', async (req, res) => {
  try {
    queryTimeframes = DT.getMultipleUTCTimeframesFromLocalReqDayjs(req);
    const allResults = [];
    queryTimeframes.forEach(tf => {
      allResults.push(getTotalKwh(tf));
    });


    Promise.all(allResults).then(
      vals => {
        const response = vals.map((r, i) => {
          return {
            timeFrom: r.timeFromBeLocal,
            timeTo: r.timeToBeLocal,
            value: r.totalkWh
          }
        })
        AU.sendResponse(res, false, response);
        return;
      }
    ).catch(err => {
      AU.sendResponse(res, true, err);
    });

  } catch (error) {
    AU.sendResponse(res, true, error);
  }
})

// ==
// == /sensorsKwh
// ==
api.get('/sensorsKwh', async (req, res) => {
  try {
    const response = await doAllSensorsWattsAndWattHoursQuery(req);
    AU.sendResponse(res, false, {
      timeFrom: response.timeFromBeLocal,
      timeTo: response.timeToBeLocal,
      values: response.values
    });
  } catch (error) {
    const timeframe = DT.getUTCTimeframeFromLocalRequestDayjs(req);
    const noResults = {};
    Object.entries(QUERIES.SENSOR_IDS).forEach(sensor => {
      noResults[sensor[0]] = {
        fuse: sensor[1].fuse,
        value: 0
      };
    });
    if (error.message === 'No data') {
      AU.sendResponse(res, false, {
        timeFrom: DT.toLocal(timeframe[0]).format(),
        timeTo: DT.toLocal(timeframe[1]).format(),
        values: fuses
      })
    } else {
      AU.sendResponse(res, true, error);
    }
  }
})

// ==
// == /fusesKwh
// ==
api.get('/fusesKwh', async (req, res) => {
  try {
    const sensorResults = await doAllSensorsWattsAndWattHoursQuery(req);
    const fuseResults = {};

    Object.keys(sensorResults.values).forEach(sensorId => {
      const fuseDesc = sensorResults.values[sensorId].fuse;
      const sensorValue = sensorResults.values[sensorId].value;
      if (fuseResults[fuseDesc]) {
        fuseResults[fuseDesc] += sensorValue;
      } else {
        fuseResults[fuseDesc] = sensorValue;
      }
    });

    AU.sendResponse(res, false, {
      timeFrom: sensorResults.timeFromBeLocal,
      timeTo: sensorResults.timeToBeLocal,
      values: fuseResults
    });
  } catch (error) {
    if (error.message === 'No data') {
      const fuses = {};
      const timeframe = DT.getUTCTimeframeFromLocalRequestDayjs(req);
      Object.keys(QUERIES.FUSES).forEach(fuse => fuses[fuse] = 0);
      AU.sendResponse(res, false, {
        timeFrom: DT.toLocal(timeframe[0]).format(),
        timeTo: DT.toLocal(timeframe[1]).format(),
        values: fuses
      });
    } else {
      AU.sendResponse(res, true, error);
    }
  }

})

// ==
// == /allSensors
// ==
api.get('/allSensors', (req, res) => {
  AU.sendResponse(res, false, QUERIES.SENSOR_IDS);
})

// ==
// == /allFuses
// ==
api.get('/allFuses', (req, res) => {
  AU.sendResponse(res, false, QUERIES.FUSES);
})



// ==
// == /weekUsage // SOLVE ME
// ==
api.get('/weekUsage', async (req, res) => {

  function getWeekdayKwhPromise(now, i) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currDayName = days[i];
    const timeframe = [now.day(i).startOf('day'), now.day(i).endOf('day')];
    return new Promise(async (resolve, reject) => {
      try {
        const kwh = await getTotalKwh(timeframe);
        resolve({
          'day': currDayName,
          'timeFrom': AU.toElasticDatetimeString(timeframe[0]),
          'timeTo': AU.toElasticDatetimeString(timeframe[1]),
          'kwh': kwh
        });
      } catch (err) {
        reject(err);
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

    Promise.all(weekKwh).then(result => {
      AU.sendResponse(res, false, result);
      return;
    }).catch(err => AU.sendResponse(res, true, err));
  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})

// ==
// == /todayUsage
// ==
api.get('/todayUsage', async (req, res) => {
  try {
    const now = DT.toLocal(DT.getCurrentUTCTimeJS());
    const timeframe = [now.startOf('day').utc(), now.endOf('day').utc()];
    const kwh = await getTotalKwh(timeframe);
    AU.sendResponse(res, false, {
      timeFrom: kwh.timeFromBeLocal,
      timeTo: kwh.timeToBeLocal,
      value: kwh.totalkWh
    });
  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})

// ==
// == /totalUsagePerDay
// ==
api.get('/totalUsagePerDay', async (req, res) => {

  function getIntervals(req, interval) {
    const tf = DT.getUTCTimeframeFromLocalRequestDayjs(req);
    let startDate = DT.toLocal(tf[0]).startOf(interval);
    let endDate = DT.toLocal(tf[1]).endOf(interval);

    const timeRanges = [];

    // Split in intervals
    while (startDate.isBefore(endDate)) {
      const startCurr = startDate;
      const endCurr = startDate.endOf(interval);
      timeRanges.push([startCurr.utc(), endCurr.utc()])
      startDate = startDate.add(1, interval);
    }

    return timeRanges;
  }

  try {
    const intervals = getIntervals(req, "day");
    const results = intervals.map(interval => getTotalKwh(interval));

    Promise.all(results)
      .then(values => {
        const response = values.map((r, i) => {
          return {
            timeFrom: r.timeFromBeLocal,
            timeTo: r.timeToBeLocal,
            value: r.totalkWh
          }
        });

        AU.sendResponse(res, false, {
          'statistics': AU.getStatistics(response),
          'values': response
        });

        return
      })
      .catch(err => {
        throw err
      });



  } catch (err) {
    AU.sendResponse(res, true, err);
  }
})



// ==
// == /fusesKwhPerInterval    //TODO
// ==
api.get('/fusesKwhPerInterval', async (req, res) => {
  try {
    const interval = AU.getEssentialQueryParamFromRequest(req, "interval");
    let startDate = AU.getDateTimeFromRequest(req, 'from').startOf(interval);
    let intervalAmount;
    let endDate;
    try {
      intervalAmount = parseInt(AU.getEssentialQueryParamFromRequest(req, "intervalAmount"));
    } catch (error) {
      intervalAmount = 1
    }
    try {
      endDate = AU.getDateTimeFromRequest(req, 'to').endOf(interval);
    } catch (error) {
      endDate = dayjs().endOf(interval);
    }

    const query = QUERIES.ALL_SENSORS_W_WH_QUERY.body;

    const timeLabels = [];
    const timeRanges = [];
    const allQueries = [];

    // Split in intervals
    while (startDate.isBefore(endDate.add(intervalAmount, interval))) {
      const currInterval = [AU.toElasticDatetimeString(startDate.subtract(2, 'm')), AU.toElasticDatetimeString(startDate.add(1, 'm'))];
      timeRanges.push(currInterval);
      timeLabels.push(AU.toElasticDatetimeString(startDate));
      let intervalQuery = JSON.parse(JSON.stringify(query)); // Deep clone of query
      intervalQuery.query.bool.filter[1].range["@timestamp"].gte = currInterval[0];
      intervalQuery.query.bool.filter[1].range["@timestamp"].lte = currInterval[1];
      allQueries.push({
        index: '*'
      });
      allQueries.push(intervalQuery);
      startDate = startDate.add(intervalAmount, interval);
    }

    const result = await client.msearch({
      body: allQueries
    });

    const allFuseNames = Object.keys(QUERIES.FUSES);
    const fusesResults = {};
    allFuseNames.forEach(fuse => fusesResults[fuse] = []);

    const responses = result.body.responses;
    responses.map(response => {
      const respFuseValues = {};
      allFuseNames.forEach(fn => respFuseValues[fn] = 0);

      response.aggregations.sensorBuckets.buckets.forEach(bucket => {
        const bucketFuse = bucket.fuse.buckets[0].key;
        respFuseValues[bucketFuse] += bucket.maxWh.value;
      });

      allFuseNames.forEach(fn => fusesResults[fn].push(respFuseValues[fn]));
    });



    // Transform the values to kWh
    allFuseNames.forEach(fn => {
      const kwhs = [];
      for (let i = 1; i < timeLabels.length; i++) {
        const kwh = (fusesResults[fn][i] - fusesResults[fn][i - 1]) / 1000;
        kwhs.push(kwh > 0 ? kwh : 0);
      }
      fusesResults[fn] = kwhs;
    });

    // Make the date labels
    const dateLabels = [];
    for (let i = 0; i < timeLabels.length - 1; i++) {
      dateLabels.push({
        timeFrom: timeLabels[i],
        timeTo: timeLabels[i + 1]
      });
    }


    AU.sendResponse(res, false, {
      // timeLabels,
      // timeRanges,
      timeframes: dateLabels,
      fusesResults
    })

  } catch (error) {
    AU.sendResponse(res, true, error);
  }
})

// ===========================
// ==  DISTRIBUTION QUERIES ======================================================================
// ===========================


// ==
// == /totalWattDistribution
// ==
api.get('/totalWattDistribution', async (req, res) => {
  try {
    const timeframe = DT.getUTCTimeframeFromLocalRequestDayjs(req);
    const timeBetween = timeframe[1].diff(timeframe[0], 'second');

    const query = getDistributionQuery(timeframe, timeBetween);
    const result = await client.search(query);

    const formatted = result.body.aggregations.results.buckets.map(b => {
      return {
        date: DT.epochToLocalTime(b.key).format(),
        dateMillis: b.key,
        value: b.allSensorsAvgW.value
      }
    });

    AU.sendResponse(res, false, formatted);

  } catch (error) {
    AU.sendResponse(res, true, error);
  }
})


// ==
// == /totalWattDistributionMultiple
// ==
api.get('/totalWattDistributionMultiple', async (req, res) => {
  try {
    const queryTimeframes = DT.getMultipleUTCTimeframesFromLocalReqDayjs(req);
    const timesBetween = queryTimeframes.map(tf => tf[1].diff(tf[0], 'second'));
    let allQueries = [];

    queryTimeframes.forEach((tf, i) => {
      let query = JSON.parse(JSON.stringify(getDistributionQuery(tf, timesBetween[i])));
      allQueries.push({
        index: '*'
      });
      allQueries.push(query.body);
    });

    let result = await client.msearch({
      body: allQueries
    });


    if (!result.body.responses.some(resp => resp._shards.failed > 0)) {
      const response = result.body.responses.map((resp, i) => {
        return {
          timeFrom: DT.toLocal(queryTimeframes[i][0]).format(),
          timeTo: DT.toLocal(queryTimeframes[i][1]).format(),
          values: resp.aggregations.results.buckets.map(b => {
            return {
              date: DT.epochToLocalTime(b.key).format(),
              dateMillis: b.key,
              value: b.allSensorsAvgW.value
            }
          })
        }
      });
      AU.sendResponse(res, false, response);
    } else {
      throw new Error('Max buckets');
    }


  } catch (error) {
    AU.sendResponse(res, true, error);
  }
})



// ==
// == /fusesWattDistribution      //TODO (unused)
// ==
api.get('/fusesWattDistribution', async (req, res) => {
  try {
    const timeframe = AU.getTimeframeFromRequest(req, res);
    const timeBetween = AU.getTimeBetween(req);

    const result = await getDistribution(timeframe, timeBetween);
    const rawData = result.body.aggregations.results.buckets.map(b => {
      return {
        date: AU.toElasticDatetimeString(dayjs(b.key)),
        fuses: b.myBucket.buckets.map(bb => {
          return {
            fuse: bb.key,
            value: bb.myAvgWatts.value
          }
        })
      }
    });

    AU.sendResponse(res, false, rawData);
  } catch (error) {
    AU.sendResponse(res, true, error);
  }
})



/**
 * HELPER FUNCTIONS =================================================================================================================
 */

async function getTotalKwh(timeframeDayJs) {
  try {
    const result = await doAllSensorsWattsAndWattHoursQuery(null, timeframeDayJs);
    return result;
  } catch (err) {
    if (err.message === 'No data') {
      return 0
    } else {
      throw err;
    }
  }
}


function getDistributionQuery(timeframe, timeBetween) {
  const query = QUERIES.ALL_SENSORS_DISTRIBUTION;
  query.body.query.bool.filter[0].range["@timestamp"].gte = timeframe[0].utc().unix();
  query.body.query.bool.filter[0].range["@timestamp"].lte = timeframe[1].utc().unix();
  query.body.aggs.results.date_histogram.fixed_interval = (timeBetween / 225).toFixed(0) + 's'
  return query;
}



// TODO: unusesd
async function getDistribution(timeframe, timeBetween) {
  try {
    const query = QUERIES.MAX_WH_DISTRIBUTION_PER_FUSE_QUERY;
    query.body.query.bool.filter[0].range["@timestamp"].gte = timeframe[0];
    query.body.query.bool.filter[0].range["@timestamp"].lte = timeframe[1];
    query.body.aggs.results.date_histogram.fixed_interval = (timeBetween / 400).toFixed(0) + 's'

    let result = await client.search(query);
    let interval = (timeBetween / 400);
    let nbTries = 0;

    // For safety, shouldn't happen
    while (result.body._shards.failed > 0 && nbTries < 5) {
      interval *= 1.5;
      nbTries += 1;
      query.body.aggs.results.date_histogram.fixed_interval = interval.toFixed(0) + 's'
      // eslint-disable-next-line no-await-in-loop
      result = await client.search(query);
    }

    if (result.body._shards.failed === 0) {
      return result;
    } else {
      throw new Error('Max buckets');
    }

  } catch (err) {
    throw err.message;
  }
}


async function doAllSensorsWattsAndWattHoursQuery(req, timeFrame = []) {

  function getFusesWattsAndWattHoursMINQuery(dateTime) {
    const from = dateTime.subtract(1, 'm').utc().unix();
    const to = dateTime.add(1, 'm').utc().unix();

    let query = JSON.parse(JSON.stringify(QUERIES.ALL_SENSORS_W_WH_QUERY.body));
    query.query.bool.filter[1].range["@timestamp"].gte = from;
    query.query.bool.filter[1].range["@timestamp"].lte = to;

    return query;
  }

  function getFusesWattsAndWattHoursMAXQuery(fromDateTime, toDateTime) {
    const from = fromDateTime.utc().unix();
    const to = toDateTime.utc().unix();

    let query = JSON.parse(JSON.stringify(QUERIES.ALL_SENSORS_W_WH_QUERY.body));
    query.query.bool.filter[1].range["@timestamp"].gte = from;
    query.query.bool.filter[1].range["@timestamp"].lte = to;

    return query;
  }

  try {
    let fromDatetime;
    let toDatetime;

    if (timeFrame.length < 2) {
      // --- GET DATETIME INTERVAL ---
      const reqTimeFrame = DT.getUTCTimeframeFromLocalRequestDayjs(req);
      fromDatetime = reqTimeFrame[0];
      toDatetime = reqTimeFrame[1];
    } else {
      fromDatetime = timeFrame[0];
      toDatetime = timeFrame[1];
    }


    // --- MAKE QUERIES ---
    const fromQuery = getFusesWattsAndWattHoursMINQuery(fromDatetime);
    const toQuery = getFusesWattsAndWattHoursMAXQuery(fromDatetime, toDatetime);
    const allQueries = [{
      index: '*'
    }, fromQuery, {
      index: '*'
    }, toQuery];

    const result = await client.msearch({
      body: allQueries
    });

    // --- FORMAT RESPONSE ---
    //    respone = {
    //      timeFrom: string,
    //      timeTo: string,
    //      values: {
    //        sensorID1: {
    //          value: number,
    //          fuse: string
    //        },
    //        sensorID2: {...},
    //        ...
    //      },
    //      totalWh: number
    //    }
    if (result.body.responses.length < 2) {
      throw new Error('Got < 2 results for queries: ' + JSON.stringify(fromQuery) + '\n\n AND \n\n' + JSON.stringify(toQuery));
    } else {
      const sensorWhs = {};
      let totalMinWh;
      let totalMaxWh;

      // MIN & MAX normal
      if (result.body.responses[0].aggregations.sensorBuckets.buckets.length > 0 && result.body.responses[1].aggregations.sensorBuckets.buckets.length > 0) {

        // Add each sensor & their minWh
        result.body.responses[0].aggregations.sensorBuckets.buckets.forEach(b => {
          sensorWhs[b.key] = {
            fuse: b.fuse.buckets[0].key,
            minWh: b.maxWh.value
          }
        });

        // Add the maxWh for each sensor
        result.body.responses[1].aggregations.sensorBuckets.buckets.forEach(b => {
          sensorWhs[b.key].maxWh = b.maxWh.value;
        });

        totalMinWh = result.body.responses[0].aggregations.allSensorsMaxWh.value;
        totalMaxWh = result.body.responses[1].aggregations.allSensorsMaxWh.value;


        // If no proper values for the min-query, look at the minWh values for the max-query
      } else if (result.body.responses[0].aggregations.sensorBuckets.buckets.length === 0 && result.body.responses[1].aggregations.sensorBuckets.buckets.length > 0) {
        result.body.responses[1].aggregations.sensorBuckets.buckets.forEach(b => {
          sensorWhs[b.key] = {
            fuse: b.fuse.buckets[0].key,
            minWh: b.minWh.value,
            maxWh: b.maxWh.value
          }
        });
        totalMinWh = result.body.responses[1].aggregations.allSensorsMinWh.value;
        totalMaxWh = result.body.responses[1].aggregations.allSensorsMaxWh.value;
      } else {
        // No data available
        throw new Error('No data');
      }


      let response = {
        timeFrom: fromDatetime.format(),
        timeTo: toDatetime.format(),
        timeFromEpoch: fromDatetime.utc().unix(),
        timeToEpoch: toDatetime.utc().unix(),
        timeFromBeLocal: DT.toLocal(fromDatetime).format(),
        timeToBeLocal: DT.toLocal(toDatetime).format(),
        values: {},
        totalkWh: (totalMaxWh - totalMinWh) / 1000,
        query: allQueries
      };

      Object.keys(sensorWhs).forEach(sensorWh => {
        if (sensorWhs[sensorWh].maxWh && sensorWhs[sensorWh].minWh) {
          response.values[sensorWh] = {
            fuse: sensorWhs[sensorWh].fuse,
            value: (sensorWhs[sensorWh].maxWh - sensorWhs[sensorWh].minWh) / 1000
          };
        }
      });

      return response
    }
  } catch (err) {
    throw err
  }
}

module.exports = api;
