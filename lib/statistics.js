const request = require("axios");

class Statistics {

    constructor (registryUrl, apiUrl) {

        this.registryUrl = registryUrl || "https://registry.npmjs.org";
        this.apiUrl = apiUrl || "https://api.npmjs.org";

    }

    getUserStats (username, startDate, endDate) {

        let moduleListUri = `/-/_view/browseAuthors?group_level=2&start_key=["${username}"]&end_key=["${username}",{}]`;
        let self = this;

        return new Promise(function (resolve, reject) {

            return request.get(self.registryUrl + moduleListUri)
                .then(function (response) {
                    if (response.data.rows.length === 0) {
                        reject({
                            message: `Username '${username}' not found!`
                        });
                    } else {
                        let moduleNames = [];
                        // Iterate over modules array
                        response.data.rows.forEach(function (moduleObj) {
                            // Push to modules array
                            moduleNames.push(moduleObj.key[1]);
                        });

                        let statsUri = `/downloads/range/${startDate}:${endDate}/${moduleNames.join(",")}`;

                        // Request package stats
                        request.get(self.apiUrl + statsUri).then(function (statsResponse) {
                            resolve(statsResponse.data);
                        }).catch(function (error) {
                            reject({
                                message: "There was a problem getting the statistics data!"
                            });
                        });
                    }

                });

        });

    }

    getPackageStats (packageName, startDate, endDate) {

        let self = this;

        return new Promise(function (resolve, reject) {

            let statsUri = `/downloads/range/${startDate}:${endDate}/${packageName}`;

            // Request package stats
            request.get(self.apiUrl + statsUri).then(function (statsResponse) {
                // Remap result to the same structure as the user stats result
                let result = {};
                result[packageName] = statsResponse.data;
                // Resolve
                resolve(result);
            }).catch(function (error) {
                if (error.message.indexOf("404") > -1) {
                    reject({
                        "message": `The package with the name '${packageName}' could not be found!`
                    });
                } else {
                    reject({
                        message: "There was a problem getting the statistics data!"
                    });
                }
            });

        });

    }

}

module.exports = Statistics;