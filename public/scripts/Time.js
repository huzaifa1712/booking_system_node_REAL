let moment = require('moment');
module.exports = class Time{
    static startAndEndTimes(day,times,isoWeekNum,year){
    var isoWeekDay = moment(day,"dddd").isoWeekday();
    var startTimeString = isoWeekDay + "-" + times[0] + "-" + isoWeekNum + "-" + year;
    var endTimeString =  isoWeekDay + "-" + times[1] + "-" + isoWeekNum + "-" + year;

    var startDate = moment(startTimeString, "E-hh:mma-WW-YYYY");
    console.log(startDate.format("E-hh:mma-WW-YYYY"));
    var endDate = moment(endTimeString, "E-hh:mma-WW-YYYY");
    console.log(endDate.format("E-hh:mma-WW-YYYY"));

    return {
      startDate:startDate.toDate(),
      endDate:endDate.toDate()
    }

  }
}
