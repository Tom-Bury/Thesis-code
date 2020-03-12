const DATE_FORMAT = 'DD/MM/YYYY';
const TIME_FORMAT = 'HH:mm';
const DATETIME_FORMAT = DATE_FORMAT + '-' + TIME_FORMAT;
const ELASTIC_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm'
const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

module.exports = {

  /**
   * Send the given value as response to the express respons res.
   * Indicate errors with isError.
   * Indicate used timeframe with timeFrom & timeTo
   */
  sendResponse: (res, isError, value) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({
      isError,
      value: isError ? value.name + "::" + value.message : value
    });
  },

  getEssentialQueryParamFromRequest: (req, queryParamName) => {
    if (req.query[queryParamName]) {
      return req.query[queryParamName];
    } else {
      throw new Error("Request doesn't contain " + queryParamName + " parameter.");
    }
  },


  /**
   * Return an array depicting the dayjs timeframe form the given express request req.
   */
  getTimeframeFromRequest: (req) => {
    let fromDatetime;
    let toDatetime;

    try {
      fromDatetime = module.exports.getDateTimeFromRequest(req, "from");
    } catch (err) {
      throw err;
    }

    try {
      toDatetime = module.exports.getDateTimeFromRequest(req, "to");
    } catch (err) {
      toDatetime = dayjs();
    }

    return [fromDatetime, toDatetime].map(module.exports.toElasticDatetimeString);
  },

  /**
   * Get the date(time) from the given query parameter with name queryParamName from the given express request req.
   * Returns a dayjs object representing that date.
   */
  getDateTimeFromRequest: (req, queryParamName) => {
    if (req.query[queryParamName]) {
      let result;
      if (req.query[queryParamName].indexOf('-') > -1) {
        result = dayjs(req.query[queryParamName], DATETIME_FORMAT);
      } else {
        result = dayjs(req.query[queryParamName], DATE_FORMAT);
      }

      if (result.toString() === "Invalid Date") {
        throw new Error("Datetime for '" + queryParamName + "' parameter doesn't follow the format.")
      } else {
        return result;
      }
    } else {
      throw new Error("Request doesn't contain " + queryParamName + " parameter.");
    }
  },


  toElasticDatetimeString: (datetime) => {
    return datetime.format(ELASTIC_DATETIME_FORMAT);
  },


  /**
   * Given a request, returns the time between to & from parameters in seconds.
   */
  getTimeBetween: (req) => {
    let fromDatetime;
    let toDatetime;

    try {
      fromDatetime = module.exports.getDateTimeFromRequest(req, "from");
    } catch (err) {
      throw err;
    }

    try {
      toDatetime = module.exports.getDateTimeFromRequest(req, "to");
    } catch (err) {
      toDatetime = dayjs();
    }
    return toDatetime.diff(fromDatetime) / 1000;
  },



  /**
   * Calculates various statistics from the given array of formatted result values.
   * --> format: {
        timeFrom: elasticTimeString,
        timeTo: elasticTimeString,
        kwh: kwh
      }
   *
   * Calculated statistics: total average, total weekday average
   */
  getStatistics: (formattedResult) => {
    /**
     * FORMAT:  {
        timeFrom: elasticTimeString,
        timeTo: elasticTimeString,
        kwh: kwh
      }
     */

    const bareValues = formattedResult.map(r => r.kwh);
    const isWeekend = formattedResult.map(r => {
      const dayNb = dayjs(r.timeFrom, ELASTIC_DATETIME_FORMAT).day();
      return dayNb === 0 || dayNb === 6;
    })

    const nbNonZeroValues = bareValues.filter(n => n > 0).length;
    const totalSum = bareValues.reduce((a, b) => a + b, 0);
    const totalAvg = totalSum / nbNonZeroValues;

    const weekdayValues = bareValues.filter((v, i) => !isWeekend[i]);
    const weekdaySum = weekdayValues.reduce((a, b) => a + b, 0);
    const nbNonZeroWeekdayValues = weekdayValues.filter(n => n > 0).length;
    const weekdayAvg = weekdaySum / nbNonZeroWeekdayValues;

    return {
      totalAvg,
      weekdayAvg
    }
  },



  splitInIntervals: (startDate, endDate, interval) => {
    const timeRanges = [];

    // Split in intervals
    while (startDate.isBefore(endDate)) {
      const startDay = module.exports.toElasticDatetimeString(startDate);
      const endDay = module.exports.toElasticDatetimeString(startDate.endOf(interval));
      timeRanges.push([startDay, endDay])
      startDate = startDate.add(1, interval);
    }

    return timeRanges;
  }



}
