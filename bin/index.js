#!/usr/bin/env node

// Global modules
const argv = require("minimist")(process.argv.slice(2));

// Local modules
const Statistics = require("../lib/statistics");
const DateFunctions = require("../lib/dateFunctions");
const Formatter = require("../lib/formatter");
const Aggregator = require("../lib/aggregator");

// Instantiate DateFunctions class
const dateFunctions = new DateFunctions();

// Check definitions / allowed values
const checks = {
    allowedGranularities: ["daily", "monthly", "yearly"],
    allowedOutputs: ["json", "chart", "csv", "tsv"]
};

if (argv.hasOwnProperty("help")) {
    console.log("npm-stats usage:");
    console.log("--------------------------");
    console.log(" ");
    console.log("Arguments:");
    console.log("--package <packageName>     The package name to gather statistics from.");
    console.log("--user <userName>           The name of the NPM registry user to gather statistics from.");
    console.log("                            This will generate statistics for all public modules of the user.");
    console.log("--by-package                This can be used to gather user-level statistics by package name.");
    console.log("--granularity <granularity> The level of aggregation ('daily', 'monthly', 'yearly'). Default is 'monthly'.");
    console.log("--output <type>             How the statistics should be generated ('json', 'chart', 'csv', 'tsv'). Default is 'json'.");
    console.log("--start <startDate>         The start date (in 'YYYY-MM-DD' format).");
    console.log("--end <endDate>             The end date (in 'YYYY-MM-DD' format).");
    console.log("--registry-url              The URL of the registry endpoint, including the protocol. Default is 'https://registry.npmjs.org'.");
    console.log("--api-url                   The URL of the registry API endpoint, including the protocol. Default is 'https://api.npmjs.org'.");
    console.log(" ");
    console.log("Hints:");
    console.log("Either --package or --user flags are mandatory. If neither --start or --end is specified,");
    console.log("the data from yesterday will be used.");
    console.log(" ");
    process.exit(0);
} else {
    // Set registry and API URLs
    let registryUrl = "https://registry.npmjs.org";
    let apiUrl = "https://api.npmjs.org";
    if (argv.hasOwnProperty("registry-url")) {
        registryUrl = argv["registry-url"];
    }
    if (argv.hasOwnProperty("api-url")) {
        apiUrl = argv["api-url"];
    }

    // Instantiate statistics gathering module
    let statistics = new Statistics(registryUrl, apiUrl);

    // Handle byPackage
    let byPackage = null;
    if (argv.hasOwnProperty("by-package")) {
        byPackage = true;
    } else {
        byPackage = false;
    }

    // Handle granularity
    let granularity = null;
    if (argv.hasOwnProperty("granularity")) {
        // Check if an allowed granularity is used
        if (checks.allowedGranularities.indexOf(argv["granularity"].toLowerCase()) > -1) {
            granularity = argv["granularity"];
        } else {
            console.log(`Error: Specified granularity '${argv["granularity"]}', which is not one of '${checks.allowedGranularities.join("', '")}'!`);
            process.exit(-1);
        }
    } else {
        granularity = "monthly";
    }

    // Handle output type
    let outputType = null;
    if (argv.hasOwnProperty("output")) {
        // Check if an allowed granularity is used
        if (checks.allowedOutputs.indexOf(argv["output"].toLowerCase()) > -1) {
            outputType = argv["output"];
        } else {
            console.log(`Error: Specified output type '${argv["output"]}', which is not one of '${checks.allowedOutputs.join("', '")}'!`);
            process.exit(-1);
        }
    } else {
        outputType = "json";
    }

    // Handle startDate and endDate
    let startDate = null;
    let endDate = null;
    if ((!argv.hasOwnProperty("start") && argv.hasOwnProperty("end")) || (argv.hasOwnProperty("start") && !argv.hasOwnProperty("end"))) {
        console.log(`Error: Specify both --start and --end flags in the 'YYYY-MM-DD' format!`);
        process.exit(-1);
    } else if (argv.hasOwnProperty("start") && argv.hasOwnProperty("end")) {
        // Check if --start has a valid format
        if (dateFunctions.isValidDate(argv["start"])) {
            startDate = argv["start"];
        } else {
            console.log(`Error: Please specify --start as correct date and in 'YYYY-MM-DD' format. Received '${argv["start"]}'`);
            process.exit(-1);
        }
        // Check if --end has a valid format
        if (dateFunctions.isValidDate(argv["end"])) {
            endDate = argv["end"];
        } else {
            console.log(`Error: Please specify --end as correct date and in 'YYYY-MM-DD' format. Received '${argv["end"]}'`);
            process.exit(-1);
        }
    } else {
        startDate = dateFunctions.getYesterdaysDate();
        endDate = dateFunctions.getYesterdaysDate();
    }
    // Make sure start date lies before the end date
    if (dateFunctions.getDateDifferenceInDays(startDate, endDate) < 0) {
        console.log(`Error: The --start date must smaller than the --end date!`);
        process.exit(-1);
    }

    // Instantiate aggregator
    const aggregator = new Aggregator();

    // Instantiate formatter
    const formatter = new Formatter();

    // Distinguish between user and package mode
    if (argv.hasOwnProperty("package")) {

        // Activate per-package
        byPackage = true;

        statistics.getPackageStats(argv["package"], startDate, endDate)
            .then(aggregator.aggregate.bind(aggregator, granularity, byPackage))
            .then(formatter.format.bind(formatter, outputType, byPackage))
            .then(function (output) {
                console.log(output);
            }).catch(function (error) {
            console.log("Error: " + error.message);
            process.exit(-1);
        });

    } else if (argv.hasOwnProperty("user")) {

        statistics.getUserStats(argv["user"], startDate, endDate)
            .then(aggregator.aggregate.bind(aggregator, granularity, byPackage))
            .then(formatter.format.bind(formatter, outputType, byPackage))
            .then(function (output) {
                console.log(output);
            }).catch(function (error) {
                console.log("Error: " + error.message);
                process.exit(-1);
            });

    } else {
        console.log("Error: Please specify either the --user or the --package flags!");
        process.exit(-1);
    }

}
