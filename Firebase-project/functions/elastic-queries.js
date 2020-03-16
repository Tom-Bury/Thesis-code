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

  TOTAL_FUSE_WH_QUERY: {
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
            "field": "fuseDescription",
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


  // By trial & error: appropriate fixed_interval seems to be:
  //   for interval [timefrom, timeto]
  //      let diff_in_secs = timeto - timefrom
  //      return 2*(diff_in_secs / 1000)
  MAX_WH_DISTRIBUTION_PER_FUSE_QUERY: {
    index: "*",
    body: {
      "aggs": {
        "results": {
          "date_histogram": {
            "field": "@timestamp",
            "fixed_interval": "10m",
            "time_zone": "Europe/Brussels"
          },
          "aggs": {
            "myMaxWhSum": {
              "sum_bucket": {
                "buckets_path": "myBucket>myMaxWh"
              }
            },
            "myAvgSum": {
              "sum_bucket": {
                "buckets_path": "myBucket>myAvgWatts"
              }
            },
            "myBucket": {
              "significant_terms": {
                "field": "fuseDescription",
                "size": 20
              },
              "aggs": {
                "myMaxWh": {
                  "max": {
                    "field": "WHrDelRec"
                  }
                },
                "myAvgWatts": {
                  "avg": {
                    "field": "W1"
                  }
                }
              }
            }
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
            "range": {
              "@timestamp": {
                "gte": "2020-03-06T00:00:00.000Z",
                "lte": "2020-03-06T23:59:59.999Z",
                "format": "strict_date_optional_time"
              }
            }
          }],
          "should": [],
          "must_not": []
        }
      }
    }
  }









}
