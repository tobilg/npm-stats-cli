class DateFunctions {

    constructor () {

    }

    getYesterdaysDate () {
        const date = new Date();
        date.setDate(date.getDate()-1);
        return date.getFullYear() + "-" +  (date.getMonth()+1) + '-' + date.getDate();
    }

    isValidDate (dateString) {
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        const d = new Date(dateString);
        if(!d.getTime() && d.getTime() !== 0) return false; // Invalid date
        return d.toISOString().slice(0,10) === dateString;
    }

    getDateDifferenceInDays (startDate, endDate) {
        let timeDiff = (new Date(endDate)).getTime() - (new Date(startDate)).getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    extractYear (dateString) {
        const d = new Date(dateString);
        return d.getFullYear();
    }

    extractMonth (dateString) {
        const d = new Date(dateString);
        return (d.getMonth()+1);
    }

    extractDay (dateString) {
        const d = new Date(dateString);
        return d.getDate();
    }

}

module.exports = DateFunctions;