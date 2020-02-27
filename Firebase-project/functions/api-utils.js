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
      if (req.query[queryParamName].indexOf('-') > -1) {
        return dayjs(req.query[queryParamName], DATETIME_FORMAT);
      } else {
        return dayjs(req.query[queryParamName], DATE_FORMAT);
      }
    } else {
      throw new Error("Request doesn't contain " + queryParamName + " parameter.");
    }
  },


  toElasticDatetimeString: (datetime) => {
    return datetime.format(ELASTIC_DATETIME_FORMAT);
  },



}
