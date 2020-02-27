module.exports = {
  TOTAL_WH_QUERY: {
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
            "field": "sensorId",
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
      "stored_fields": [
        "*"
      ],
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
                  "gte": "2020-02-19T00:00",
                  "lte": "2020-02-19T20:59"
                }
              }
            }
          ],
          "should": [],
          "must_not": []
        }
      }
    }
  },

  MAX_WH_FOR_FUSE_QUERY: {
    index: "*",
    body: {
      "aggs": {
        "maxFuseWh": {
          "max": {
            "field": "WHrDelRec"
          }
        }
      },
      "size": 0,
      "stored_fields": [
        "*"
      ],
      "script_fields": {},
      "docvalue_fields": [{
        "field": "@timestamp",
        "format": "date_time"
      }],
      "_source": {
        "excludes": []
      },
      "query": {
        "bool": {
          "must": [],
          "filter": [{
              "match_phrase": {
                "fuseDescription": "Vloerdoos bureau 1"
              }
            },
            {
              "range": {
                "@timestamp": {
                  "gte": "2020-02-27T13:23:16.322Z",
                  "lte": "2020-02-27T13:38:16.322Z",
                  "format": "strict_date_optional_time"
                }
              }
            }
          ],
          "should": [],
          "must_not": []
        }
      }
    }
  },









}
