module.exports = {
  API_OVERVIEW: {
    totalKwh: {
      usage: '/api/totalKwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns the total electricity usage in kWh between the timeframe [from, to].',
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

    fuseKwh: {
      usage: '/api/fuseKwh?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm&fuse=fuse_name',
      description: 'Returns the total electricity usage in kWh between the timeframe [from, to] for the given fuse.',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh',
        optional: true
      }, {
        name: 'fuse',
        description: 'Name of the fuse to get the usage for. Name as used in Elasticsearch & Kibana. Spaces in the name should be underscores (_).',
        optional: false
      }]
    },

    weekUsage: {
      usage: '/api/weekUsage',
      description: 'Returns an array of {day, timeFrom, timeTo, kwh} objects reflecting the total electricity usage in kWh for each day of the current week.',
      parameters: []
    },

    todayUsage: {
      usage: '/api/todayUsage',
      description: 'Returns the total electricity usage in kWh for the current day.',
      parameters: []
    },

    totalUsagePerDay: {
      usage: '/api/totalUsagePerDay?from=DD/MM/YYYY&to=DD/MM/YYYY',
      description: 'Returns an array of {statistics: {totalAvg, weekdayAvg}, values: {timeFrom, timeTo, kWh}} objects reflecting the total electricity usage in kWh for each day of the given date interval (inclusive).',
      parameters: [{
        name: 'from',
        description: 'Start date of the interval using format DD/MM/YYYY.',
        optional: false
      }, {
        name: 'to',
        description: 'End date of the interval using format DD/MM/YYYY. If not given today\'s date is used.',
        optional: true
      }]
    },

    totalWattDistribution: {
      usage: '/api/totalWattDistribution?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns an array of {date, value} objects representing the average of Watts used at that moment in time. Datapoints will be distributed between the given [from, to] interval.',
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

    fusesWattDistribution: {
      usage: '/api/fusesWattDistribution?from=DD/MM/YYYY-HH:mm&to=DD/MM/YYYY-HH:mm',
      description: 'Returns an array of {date, fuses} objects, where fuses is an array of {fuse, value} objects representing the average Watts used by each fuse at that moment in time. Datapoints will be distributed between the given [from, to] interval.',
      parameters: [{
        name: 'from',
        description: 'See /totalKwh',
        optional: false
      }, {
        name: 'to',
        description: 'See /totalKwh',
        optional: true
      }]
    }


  }
}
