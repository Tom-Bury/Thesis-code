const DATE_FORMAT = 'DD/MM/YYYYZ';
const DATETIME_FORMAT = 'DD/MM/YYYY-HH:mmZ'

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


var utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

LOCAL_OFFSET = 120;
LOCAL_OFFSET_WINTER = 60;
LOCAL_OFFSET_STRING = '+02:00';
LOCAL_OFFSET_STRING_WINTER = '+01:00';


function getCurrentTimeJS(utcOffset) {
  return dayjs().utcOffset(utcOffset);
}

function localTimeStringToUTCTimeJS(str) {
  let result;
  if (str.indexOf('-') > -1) {
    result = dayjs.utc(str + LOCAL_OFFSET_STRING, DATETIME_FORMAT);
    result = result.isAfter(dayjs('29/03/2020-03:00', DATETIME_FORMAT)) ? result : dayjs.utc(str + LOCAL_OFFSET_STRING_WINTER, DATETIME_FORMAT);
  } else {
    result = dayjs.utc(str  + LOCAL_OFFSET_STRING, DATE_FORMAT);
    result = result.isAfter(dayjs('29/03/2020-03:00', DATETIME_FORMAT)) ? result : dayjs.utc(str + LOCAL_OFFSET_STRING_WINTER, DATE_FORMAT);
  }

  if (result.toString() === "Invalid Date") {
    throw new Error("Datetime for '" + queryParamName + "' parameter doesn't follow the format.")
  } else {
    return result;
  }
}

function getParameterFromRequest(req, queryParamName) {
  if (req.query[queryParamName]) {
    return req.query[queryParamName];
  } else {
    throw new Error("Request doesn't contain " + queryParamName + " parameter.");
  }
}




module.exports = {

  toLocal: (dateJs) => {
    const offset = dateJs.isAfter(dayjs('29/03/2020-03:00', DATETIME_FORMAT)) ? LOCAL_OFFSET : LOCAL_OFFSET_WINTER;
    return dateJs.utcOffset(offset);
  },

  getCurrentUTCTimeJS: () => {
    return getCurrentTimeJS(0);
  },


  localtimeStringToUTCTimeJS: (str) => {
    return localTimeStringToUTCTimeJS(str);
  },


  epochToUTCTime: (epochs) => {
    return dayjs(epochs).utc();
  },

  epochToLocalTime: (epochs) => {
    return module.exports.toLocal(module.exports.epochToUTCTime(epochs));
  },


  /**
   * Return an array depicting the UTC dayjs timeframe from the given express request req.
   */
  getUTCTimeframeFromLocalRequestDayjs: (req) => {
    let fromDatetime;
    let toDatetime;

    try {
      fromDatetime = module.exports.localtimeStringToUTCTimeJS(getParameterFromRequest(req, 'from'));
    } catch (err) {
      throw err;
    }

    try {
      toDatetime = module.exports.localtimeStringToUTCTimeJS(getParameterFromRequest(req, 'to'));
    } catch (err) {
      toDatetime = module.exports.getCurrentUTCTimeJS();
    }

    return [fromDatetime, toDatetime];
  },


  /**
   * Fetches the timeframes query parameter from the given request.
   * That parameter should be an array of {from, to} objects.
   * Returns list of DayJS timeframes
   */
  getMultipleUTCTimeframesFromLocalReqDayjs: (req) => {
    // timeframes should be an array of {from, to} objects. If not followed: ignore
    const timeframes = JSON.parse(getParameterFromRequest(req, 'timeframes'));

    const queryTimeframes = timeframes.map(timeframe => {
      if (timeframe['from'] && timeframe['to']) {
        return [module.exports.localtimeStringToUTCTimeJS(timeframe['from']), module.exports.localtimeStringToUTCTimeJS(timeframe['to'])];
      } else {
        return null;
      }
    }).filter(el => el !== null);

    return queryTimeframes
  },





}
