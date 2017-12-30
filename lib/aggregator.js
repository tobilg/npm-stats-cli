const DateFunctions = require("./dateFunctions");

// Instantiate DateFunctions class
const dateFunctions = new DateFunctions();

class Aggregator {

    constructor () {
    }

    aggregate (granularity, byPackage, data) {

        let self = this;
        return new Promise(function (resolve, reject) {

            let result = {};

            switch (granularity) {
                case "yearly":
                    result = self.toYear(data, byPackage);
                    break;
                case "monthly":
                    result = self.toMonth(data, byPackage);
                    break;
                case "daily":
                    result = self.toDay(data, byPackage);
                    break;
                default:
                    break;
            }

            resolve(result);

        });
    }

    toYear (data, byPackage) {

        let output = {
            years: {}
        };

        // Iterate over the per-module data
        Object.getOwnPropertyNames(data).forEach(function (moduleName) {
            data[moduleName].downloads.forEach(function (downloadObj) {
                const currentYear = dateFunctions.extractYear(downloadObj.day);
                // Check if an entry for that year exists
                if (!output.years.hasOwnProperty(currentYear)) {
                    // Create new year entry
                    output.years[currentYear] = {
                        downloads: 0
                    };
                    // Create packages map
                    if (byPackage) {
                        output.years[currentYear].packages = {};
                    }
                }
                if (byPackage) {
                    if (!output.years[currentYear].packages.hasOwnProperty(moduleName)) {
                        // Create new year entry
                        output.years[currentYear].packages[moduleName] = {
                            downloads: 0
                        };
                    }
                    // Add to package download count
                    output.years[currentYear].packages[moduleName].downloads += downloadObj.downloads;
                    // Add to yearly download count
                    output.years[currentYear].downloads += downloadObj.downloads;
                } else {
                    // Add to yearly download count
                    output.years[currentYear].downloads += downloadObj.downloads;
                }
            });
        });

        return output;

    }

    toMonth (data, byPackage) {

        let self = this;

        let output = {
            years: {}
        };

        // Iterate over the per-module data
        Object.getOwnPropertyNames(data).forEach(function (moduleName) {
            data[moduleName].downloads.forEach(function (downloadObj) {
                const currentYear = dateFunctions.extractYear(downloadObj.day).toString();
                const currentMonth = dateFunctions.extractMonth(downloadObj.day).toString();
                // Check if an entry for that year exists
                if (!output.years.hasOwnProperty(currentYear)) {
                    // Create new year entry
                    output.years[currentYear] = {
                        downloads: 0,
                        months: {}
                    };
                }
                if (!output.years[currentYear].months.hasOwnProperty(currentMonth)) {
                    // Create new month entry
                    output.years[currentYear].months[currentMonth] = {
                        downloads: 0
                    };
                    // Create packages map
                    if (byPackage) {
                        output.years[currentYear].months[currentMonth].packages = {};
                    }
                }
                if (byPackage) {
                    if (!output.years[currentYear].months[currentMonth].packages.hasOwnProperty(moduleName)) {
                        // Create new year entry
                        output.years[currentYear].months[currentMonth].packages[moduleName] = {
                            downloads: 0
                        };
                    }
                    // Add to package download count
                    output.years[currentYear].months[currentMonth].packages[moduleName].downloads += downloadObj.downloads;
                    // Add to monthly download count
                    output.years[currentYear].months[currentMonth].downloads += downloadObj.downloads;
                    // Add to yearly download count
                    output.years[currentYear].downloads += downloadObj.downloads;
                } else {
                    // Add to monthly download count
                    output.years[currentYear].months[currentMonth].downloads += downloadObj.downloads;
                    // Add to yearly download count
                    output.years[currentYear].downloads += downloadObj.downloads;
                }
            });
        });

        return output;

    }

    toDay (data, byPackage) {

        let output = {
            years: {}
        };

        // Iterate over the per-module data
        Object.getOwnPropertyNames(data).forEach(function (moduleName) {
            data[moduleName].downloads.forEach(function (downloadObj) {
                const currentYear = dateFunctions.extractYear(downloadObj.day).toString();
                const currentMonth = dateFunctions.extractMonth(downloadObj.day).toString();
                const currentDay = dateFunctions.extractDay(downloadObj.day).toString();
                // Check if an entry for that year exists
                if (!output.years.hasOwnProperty(currentYear)) {
                    // Create new year entry
                    output.years[currentYear] = {
                        downloads: 0,
                        months: {}
                    };
                }
                if (!output.years[currentYear].months.hasOwnProperty(currentMonth)) {
                    // Create new month entry
                    output.years[currentYear].months[currentMonth] = {
                        downloads: 0,
                        days: {}
                    };
                }
                if (!output.years[currentYear].months[currentMonth].days.hasOwnProperty(currentDay)) {
                    // Create new month entry
                    output.years[currentYear].months[currentMonth].days[currentDay] = {
                        downloads: 0
                    };
                    // Create packages map
                    if (byPackage) {
                        output.years[currentYear].months[currentMonth].days[currentDay].packages = {};
                    }
                }
                if (byPackage) {
                    if (!output.years[currentYear].months[currentMonth].days[currentDay].packages.hasOwnProperty(moduleName)) {
                        // Create new year entry
                        output.years[currentYear].months[currentMonth].days[currentDay].packages[moduleName] = {
                            downloads: 0
                        };
                    }
                    // Add to package download count
                    output.years[currentYear].months[currentMonth].days[currentDay].packages[moduleName].downloads += downloadObj.downloads;
                    // Add to daily download count
                    output.years[currentYear].months[currentMonth].days[currentDay].downloads += downloadObj.downloads;
                    // Add to monthly download count
                    output.years[currentYear].months[currentMonth].downloads += downloadObj.downloads;
                    // Add to yearly download count
                    output.years[currentYear].downloads += downloadObj.downloads;
                } else {
                    // Add to daily download count
                    output.years[currentYear].months[currentMonth].days[currentDay].downloads += downloadObj.downloads;
                    // Add to monthly download count
                    output.years[currentYear].months[currentMonth].downloads += downloadObj.downloads;
                    // Add to yearly download count
                    output.years[currentYear].downloads += downloadObj.downloads;
                }
            });
        });

        return output;

    }

}

module.exports = Aggregator;
