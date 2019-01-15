'use strict'
let mongoose = require('mongoose');

let utils = {
    isStringBlank: function (val) {
        if (typeof val === 'string')
            return !(val && val.trim().length != 0);
        else return true;
    },
    isArrayBlank: function (val) {
        if (val instanceof Array)
            return !(val.length != 0);
        else return true;
    },
    dateInUTC: function () {
        let now = new Date();
        let now_utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    },
    isStringType: function (obj) {
        return typeof obj === 'string';
    },
    isArrayType: function (obj) {
        return Array.isArray(obj);
    },
    isObjectType: function (obj) {
        return ((obj === Object(obj)) && !isArrayType(obj));
    },
    isValidObjectID: function (obj) {
        return mongoose.Types.ObjectId.isValid(obj)
    },
    isNull: function (obj) {
        if (obj)
            return false;
        else return true;
    },
    isBoolean: function (val) {
        if (typeof (val) === "boolean") {
            return true;
        }
        if (val == 'true') {
            return true;
        } else if (val == 'false') {
            return true;
        } else {
            return false;
        }
    },
    isMobileNumber: function (value) {
        let reg = /^\+[0-9]{1}[0-9]{5,15}$/;
        if (!(reg.test(value)))
            return false
        else return true;
    },
    convert: function (d) {

        let now = new Date(d);
        let now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return now_utc;
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
        );
    },
    inRange: function (d, start, end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
        );
    },
    validateDate: function (value) {
        let reg = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
        if (!(reg.test(value)))
            return false
        else return true;
    },
    GetFormattedDate: function () {
        let todayTime = new Date();
        let month = todayTime.getMonth() + 1;
        let day = todayTime.getDate();
        let year = todayTime.getFullYear();
        let hours = todayTime.getHours();
        let minutes = todayTime.getMinutes();
        let seconds = todayTime.getSeconds();
        if (month.toString().length < 2)
            month = "0" + month;
        if (day.toString().length < 2)
            day = "0" + day;
        if (hours.toString().length < 2)
            hours = "0" + hours;
        if (minutes.toString().length < 2)
            minutes = "0" + minutes;
        if (seconds.toString().length < 2)
            seconds = "0" + seconds;
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }
}
module.exports = utils;
