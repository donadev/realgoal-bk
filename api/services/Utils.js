var moment = require('moment');

module.exports = {
    dayDifference: function(a, b) {
        if(!_.isDate(a)) a = new Date(a);
        if(!_.isDate(b)) b = new Date(b);
        var start = moment(a);
        var end = moment(b);
        return end.diff(a, "days");
    }
}
