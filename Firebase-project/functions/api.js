/**
 * This file contains the express app representing the API for various functions.
 */

const express = require('express');
const api = express();


const {
  Client
} = require('@elastic/elasticsearch');
const client = new Client({
  node: 'https://tombury:oyjnyEmX4rmqh6bt@60e177cf0f9e45a7b5b92b1043675681.europe-west1.gcp.cloud.es.io:9243'
});

const TOTAL_WH_QUERY = {
  index: "*",
  body: {
    "aggs": {
      "minsum": {
        "sum_bucket": {
          "buckets_path": "sensor-bucket>min"
        }
      },
      "maxsum": {
        "sum_bucket": {
          "buckets_path": "sensor-bucket>max"
        }
      },
      "sensor-bucket": {
        "terms": {
          "field": "sensorId.keyword",
          "order": {
            "_key": "desc"
          },
          "size": 100
        },
        "aggs": {
          "avg": {
            "avg": {
              "field": "WHrDelRec"
            }
          },
          "min": {
            "min": {
              "field": "WHrDelRec"
            }
          },
          "max": {
            "max": {
              "field": "WHrDelRec"
            }
          }
        }
      }
    },
    "size": 0,
    "_source": {
      "excludes": []
    },
    "stored_fields": ["*"],
    "script_fields": {},
    "docvalue_fields": [{
      "field": "@timestamp",
      "format": "date_time"
    }],
    "query": {
      "bool": {
        "must": [],
        "filter": [{
            "match_all": {}
          },
          {
            "range": {
              "@timestamp": {
                "format": "strict_date_hour_minute",
                "gte": "2019-12-05T00:00",
                "lte": "2019-12-06T00:00"
              }
            }
          }
        ],
        "should": [],
        "must_not": []
      }
    }
  }
};


api.get('/', (req, res) => {
  res.json({
    hello: 'world, from the api!'
  });
})


api.get('/test', (req, res) => {
  client.search(
    TOTAL_WH_QUERY, (err, result) => {
      if (err) {
        sendResponse(res, true, err);
      }
      else {
        const maxSum = result.body.aggregations.maxsum.value;
        const minSum = result.body.aggregations.minsum.value;
        const kwh = (maxSum - minSum) / 1000;
        sendResponse(res, false, kwh);
      }
    })
})

api.get('/do_calculation', (req, res) => {
  const result = 2 + 40;

  res.json({
    answer: result
  });
})



function sendResponse(res, isError, value) {
  res.send({
    isError: isError,
    value: value
  });
}

module.exports = api;
