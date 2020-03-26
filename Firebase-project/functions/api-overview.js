module.exports = {
  API_OVERVIEW: {
    totalKwh: {
      usage: '/api/totalKwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns the total electricity usage in kWh between the timeframe [from, to].',
      resultFormat: '{timeFrom: string, timeTo: string, value: number}',
      parameters: [{
        name: 'from',
        description: 'Datetime using the format: DD/MM/YYYY-HH:mm, indicating the beginning of the timeframe. The hours & minutes part (-HH:mm) is optional. If not given 00:00 is used.',
        optional: false
      }, {
        name: 'to',
        description: 'Optional datetime using the format: DD/MM/YYYY-HH:mm, indicating the end of the timeframe. The hours & minutes part (-HH:mm) is optional. If not given 00:00 is used. If an invalid date is given, like not following the format, the current date & time is used.',
        optional: true
      }]
    },

    totalKwhMultiple: {
      usage: '/api/totalKwhMultiple?timeframes=[{from:DD/MM/YYYY-HH:mm, to: DD/MM/YYYY-HH:mm}, ...]',
      description: 'Returns the total electricity usage in kWh between the given [from, to] timeframes.',
      resultFormat: 'Array of {timeFrom: string, timeTo: string, value: number} for each properly formatted input timeframe.',
      parameters: [{
        name: 'timeframes',
        description: 'JSON object which is an array of {from: string, to: string} objects. The both from & to are required. For the datetime value the same formatting rules are applied as for /totalKwh.',
        optional: false
      }]
    },

    allSensors: {
      usage: '/api/allSensors',
      description: 'Returns information for each sensor.',
      resultFormat: '{sensorID: {fuse: string, usageCategories: string[]}}',
      parameters: []
    },

    allFuses: {
      usage: '/api/allFuses',
      description: 'Returns information for each fuse / circuit / fuse_description.',
      resultFormat: '{fuse: {sensorId: string, concentratorId: string, gatewayId: string}',
      parameters: []
    },

    sensorsKwh: {
      usage: '/api/sensorsKwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns the total electricity usage in kWh between the timeframe [from, to] for each sensor. Also gives fusedescription for each sensor.',
      resultFormat: '{timeFrom: string, timeTo: string, values: {sensorID: {fuse: string, value: number}}[]}',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh.',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh.',
        optional: true
      }]
    },

    fusesKwh: {
      usage: '/api/fusesKwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns the total electricity usage in kWh between the timeframe [from, to] for each fuse / circuit / fuse_description.',
      resultFormat: '{timeFrom: string, timeTo: string, values: {fuse: number}[]}',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh.',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh.',
        optional: true
      }]
    },

    todayUsage: {
      usage: '/api/todayUsage',
      description: 'Returns the total electricity usage in kWh for the current day.',
      resultFormat: '{timeFrom: string, timeTo: string, value: number}',
      parameters: []
    },

    totalUsagePerDay: {
      usage: '/api/totalUsagePerDay?from=DD/MM/YYYY&to=DD/MM/YYYY',
      description: 'Returns the total electricity usage in kWh for each day of the given date interval (inclusive), as wel as some statistics about these values.',
      resultFormat: '{statistics: {totalAvg: number, weekdayAvg: number, max: {timeFrom: string, timeTo: string, value: number}, min: {timeFrom: string, timeTo: string, value: number}},  values: {timeFrom: string, timeTo: string, value: number}[]}',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh',
        optional: true
      }]
    },

    totalWattDistribution: {
      usage: '/api/totalWattDistribution?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns an array of {date, value} objects representing the average of Watts used at that moment in time. Datapoints will be distributed between the given [from, to] interval.',
      resultFormat: '{date: string, dateMillis: number, value: number}[]',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh',
        optional: true
      }]
    },

    totalWattDistributionMultiple: {
      usage: '/api/totalWattDistributionMultiple?timeframes=[{from:DD/MM/YYYY-HH:mm, to: DD/MM/YYYY-HH:mm}, ...]',
      description: 'Returns for each timeframe an array of {date, value} objects representing the average Watts used at that moment in time. Datapoints will be distributed between the given [from, to] interval.',
      resultFormat: 'An array with for each properly formatted timeframe an object: {timeFrom: string, timeTo: string, values: {date: string, dateMillis: number, value: number}[]}',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh',
        optional: true
      }]
    },

    // fuseKwh: {
    //   usage: '/api/fuseKwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm&fuse=fuse_name',
    //   description: 'Returns the total electricity usage in kWh between the timeframe [from, to] for the given fuse.',
    //   parameters: [{
    //     name: 'from',
    //     description: 'See /totalKwh',
    //     optional: false
    //   }, {
    //     name: 'to',
    //     description: 'See /totalKwh',
    //     optional: true
    //   }, {
    //     name: 'fuse',
    //     description: 'Name of the fuse to get the usage for. Name as used in Elasticsearch & Kibana. Spaces in the name should be underscores (_).',
    //     optional: false
    //   }]
    // },

    // weekUsage: {
    //   usage: '/api/weekUsage',
    //   description: 'Returns an array of {day, timeFrom, timeTo, kwh} objects reflecting the total electricity usage in kWh for each day of the current week.',
    //   parameters: []
    // },

    // todayUsage: {
    //   usage: '/api/todayUsage',
    //   description: 'Returns the total electricity usage in kWh for the current day.',
    //   parameters: []
    // },





    // fusesWattDistribution: {
    //   usage: '/api/fusesWattDistribution?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
    //   description: 'Returns an array of {date, fuses} objects, where fuses is an array of {fuse, value} objects representing the average Watts used by each fuse at that moment in time. Datapoints will be distributed between the given [from, to] interval.',
    //   parameters: [{
    //     name: 'from',
    //     description: 'See /totalKwh',
    //     optional: false
    //   }, {
    //     name: 'to',
    //     description: 'See /totalKwh',
    //     optional: true
    //   }]
    // }


  }
}
