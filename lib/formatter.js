const os = require("os");
const asciichart = require("asciichart");

class Formatter {

    constructor () {
    }

    format (outputType, byPackage, data) {
        let self = this;
        return new Promise(function (resolve, reject) {

            let result = "";

            switch (outputType) {
                case "json":
                    result = self.toJSON(data);
                    break;
                case "chart":
                    result = self.toChart(data);
                    break;
                case "csv":
                    result = self.toCSV(data, byPackage);
                    break;
                case "tsv":
                    result = self.toTSV(data, byPackage);
                    break;
                default:
                    break;
            }

            resolve(result);

        });
    }

    toJSON (data) {
        return JSON.stringify(data);
    }

    toChart (data) {

        let downloadArray = [];
        let chartOutput = "";
        let config = {
            offset:  3,
            height:  15
        };

        Object.getOwnPropertyNames(data.years).forEach(function (year) {

            // Check for months
            if (data.years[year].hasOwnProperty("months")) {
                // Iterate over months
                Object.getOwnPropertyNames(data.years[year].months).forEach(function (month) {
                    // Check for days
                    if (data.years[year].months[month].hasOwnProperty("days")) {
                        // Iterate over days
                        Object.getOwnPropertyNames(data.years[year].months[month].days).forEach(function (day) {
                            downloadArray.push(data.years[year].months[month].days[day].downloads);
                        });
                    } else {
                        downloadArray.push(data.years[year].months[month].downloads);
                    }
                });
            } else {
                downloadArray.push(data.years[year].downloads);
            }

        });

        if (downloadArray.length > 1) {
            chartOutput = asciichart.plot(downloadArray, config)
        } else {
            chartOutput = "Error: There must be more than one data point to be able to display a chart!"
        }

        return chartOutput;

    }

    toCSV (data, byPackage) {
        return this.flatten(data, ",", byPackage);
    }

    toTSV (data, byPackage) {
        return this.flatten(data, "\t", byPackage);
    }

    flatten (data, delimiter, byPackage) {
        let headerType = "year";
        let headerObj = {
            "year": ["year", "downloads"],
            "month": ["year", "month", "downloads"],
            "day": ["year", "month", "day", "downloads"]
        };
        let byPackageHeaderObj = {
            "year": ["year", "package", "downloads"],
            "month": ["year", "month", "package", "downloads"],
            "day": ["year", "month", "day", "package", "downloads"]
        };
        let formattedOutput = "";

        Object.getOwnPropertyNames(data.years).forEach(function (year) {
            if (byPackage) {
                // Check for months
                if (data.years[year].hasOwnProperty("months")) {
                    // Set header type
                    headerType = "month";
                    // Iterate over months
                    Object.getOwnPropertyNames(data.years[year].months).forEach(function (month) {
                        // Check for days
                        if (data.years[year].months[month].hasOwnProperty("days")) {
                            // Daily granularity
                            // Set header type
                            headerType = "day";
                            // Iterate over days
                            Object.getOwnPropertyNames(data.years[year].months[month].days).forEach(function (day) {
                                // Iterate over packages
                                Object.getOwnPropertyNames(data.years[year].months[month].days[day].packages).forEach(function (packageName) {
                                    formattedOutput += year + delimiter;
                                    formattedOutput += month + delimiter;
                                    formattedOutput += day + delimiter;
                                    formattedOutput += packageName + delimiter;
                                    formattedOutput += data.years[year].months[month].days[day].packages[packageName].downloads;
                                    formattedOutput += os.EOL;
                                });
                            });
                        } else {
                            // Monthly granularity
                            // Iterate over packages
                            Object.getOwnPropertyNames(data.years[year].months[month].packages).forEach(function (packageName) {
                                formattedOutput += year + delimiter;
                                formattedOutput += month + delimiter;
                                formattedOutput += packageName + delimiter;
                                formattedOutput += data.years[year].months[month].packages[packageName].downloads;
                                formattedOutput += os.EOL;
                            });
                        }
                    });
                } else {
                    // Yearly granularity
                    // Iterate over packages
                    Object.getOwnPropertyNames(data.years[year].packages).forEach(function (packageName) {
                        formattedOutput += year + delimiter;
                        formattedOutput += packageName + delimiter;
                        formattedOutput += data.years[year].packages[packageName].downloads;
                        formattedOutput += os.EOL;
                    });
                }
            } else {
                // Check for months
                if (data.years[year].hasOwnProperty("months")) {
                    // Set header type
                    headerType = "month";
                    // Iterate over months
                    Object.getOwnPropertyNames(data.years[year].months).forEach(function (month) {
                        // Check for days
                        if (data.years[year].months[month].hasOwnProperty("days")) {
                            // Daily granularity
                            // Set header type
                            headerType = "day";
                            // Iterate over days
                            Object.getOwnPropertyNames(data.years[year].months[month].days).forEach(function (day) {
                                formattedOutput += year + delimiter;
                                formattedOutput += month + delimiter;
                                formattedOutput += day + delimiter;
                                formattedOutput += data.years[year].months[month].days[day].downloads;
                                formattedOutput += os.EOL;
                            });
                        } else {
                            // Monthly granularity
                            formattedOutput += year + delimiter;
                            formattedOutput += month + delimiter;
                            formattedOutput += data.years[year].months[month].downloads;
                            formattedOutput += os.EOL;
                        }
                    });
                } else {
                    // Yearly granularity
                    formattedOutput += year + delimiter;
                    formattedOutput += data.years[year].downloads;
                    formattedOutput += os.EOL;
                }
            }
        });

        // Add the respective header line
        if (byPackage) {
            formattedOutput = (byPackageHeaderObj[headerType].join(delimiter) + os.EOL).concat(formattedOutput);
        } else {
            formattedOutput = (headerObj[headerType].join(delimiter) + os.EOL).concat(formattedOutput);
        }

        return formattedOutput;

    }

}

module.exports = Formatter;
