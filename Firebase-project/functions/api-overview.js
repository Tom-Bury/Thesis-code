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
        description: 'Optional datetime using the format: DD/MM/YYYY-HH:mm, indicating the end of the timeframe. The hours & minutes part (-HH:mm) is optional. If not given 00:00 is used. If invalid date, like not following the format, is given the current date & time is used.',
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
    }


  }
}
