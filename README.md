# npm-stats-cli
A command line interface for npm registry statistics and insights, either per user or per package. 

It supports flexible outputs, such as JSON, ASCII chart, CSV and TSV. Also, it can aggregate the data on daily, monthly and yearly levels. 

## Installation

You can install `npm-stats` as a global package in the usual way:

```bash
$ npm install npm-stats -g
```

## Usage

### Getting help

By typing 

```bash
$ npm-stats --help
```

you can display the complete list of possible flags:

```text
npm-stats usage:
--------------------------
 
Arguments:
--package <packageName>     The package name to gather statistics from.
--user <userName>           The name of the NPM registry user to gather statistics from.
                            This will generate statistics for all public modules of the user.
--by-package                This can be used to gather user-level statistics by package name.
--granularity <granularity> The level of aggregation ('daily', 'monthly', 'yearly'). Default is 'monthly'.
--output <type>             How the statistics should be generated ('json', 'chart', 'csv', 'tsv'). Default is 'json'.
--start <startDate>         The start date (in 'YYYY-MM-DD' format).
--end <endDate>             The end date (in 'YYYY-MM-DD' format).
--registry-url              The URL of the registry endpoint, including the protocol. Default is 'https://registry.npmjs.org'.
--api-url                   The URL of the registry API endpoint, including the protocol. Default is 'https://api.npmjs.org'.
 
Hints:
Either --package or --user flags are mandatory. If neither --start or --end is specified,
the data from yesterday will be used.
```

## Getting user-level statistics

### Basic usage

```bash
$ npm-stats --user tobilg
```

This will output the download statistics of all of the user `tobilg`'s packages from yesterday, aggregated to monthly level, and output as JSON.

```bash
{"years":{"2017":{"downloads":25,"months":{"12":{"downloads":25}}}}}
```

### Specifying granularity and output type

```bash
$ npm-stats --user tobilg --granularity daily --output tsv
```

This will output the download statistics of all of the user `tobilg`'s packages from yesterday, aggregated to daily level, and output as TSV.

```bash
year    month   day     downloads
2017    12      29      25
```

### Getting by-package level statistics

```bash
$ npm-stats --user tobilg --granularity daily --output tsv --by-package
```

This will output the download statistics of all of the user `tobilg`'s packages from yesterday (on package level), aggregated to daily level, and output as TSV.

```bash
year    month   day     package downloads
2017    12      29      buffered-queue  1
2017    12      29      ceph-admin-ops-client   0
2017    12      29      facebook-events-by-location     0
2017    12      29      facebook-events-by-location-core        11
2017    12      29      fs2obj  8
2017    12      29      kafka-node-slim 0
2017    12      29      marathon-event-bus-client       0
2017    12      29      marathon-event-bus-mock 0
2017    12      29      marathon-validate       0
2017    12      29      mesos-framework 0
2017    12      29      mesos-operator-api-client       0
2017    12      29      mesosctl        0
2017    12      29      mesosdns-cli    0
2017    12      29      mesosdns-client 0
2017    12      29      mesosdns-http-agent     0
2017    12      29      no-kafka-slim   5
```

### Specifying start and end dates

The given [limits](https://github.com/npm/registry/blob/master/docs/download-counts.md#limits) of the npm registry API apply:

* 365 days of data
* Earliest date for which data will be returned is `2015-01-10`

```bash
$ npm-stats --user tobilg --start 2017-12-01 --end 2017-12-05 --granularity daily --output tsv
```

This will output the download statistics of all of the user `tobilg`'s packages from `2017-12-01` to `2017-12-05`, aggregated to daily level, and output as TSV.

```bash
year    month   day     downloads
2017    12      1       72
2017    12      2       39
2017    12      3       14
2017    12      4       139
2017    12      5       79
```

### Getting a ASCII chart from the statistics

```bash
$ npm-stats --user tobilg --granularity daily --output chart --start 2017-10-01 --end 2017-11-30
```

This will output the download statistics of all of the user `tobilg`'s packages from `2017-10-01` to `2017-11-30`, aggregated to daily level, and output as ASCII chart.

```text
     296.00 ┤           ╭╮                                                  
     277.00 ┤           ││       ╭╮                                         
     258.00 ┤       ╭╮  ││       ││                                         
     239.00 ┤       ││  ││       ││                                         
     220.00 ┤       ││ ╭╯│       ││                                         
     201.00 ┤       ││ │ │       ││                                         
     182.00 ┤       ││ │ │       │╰─╮                                       
     163.00 ┤ ╭╮    ││ │ │       │  │        ╭╮                             
     144.00 ┤ ││╭╮  ││╭╯ │       │  │        ││                             
     125.00 ┤ │││╰╮ │││  │╭╮╭╮   │  │    ╭╮ ╭╯│                   ╭╮   ╭╮   
     106.00 ┼╮│╰╯ │ │││  │││││ ╭╮│  ╰╮╭╮ ││╭╯ ╰╮                ╭╮││  ╭╯╰╮  
      87.00 ┤││   ╰╮│╰╯  ││││╰─╯╰╯   ╰╯│ │╰╯   │ ╭╮      ╭─╮   ╭╯│││ ╭╯  │  
      68.00 ┤╰╯    ││    ││╰╯          │ │     │ ││╭╮    │ ╰╮ ╭╯ ╰╯│ │   ╰╮ 
      49.00 ┤      ││    ││            │ │     │ │╰╯│  ╭─╯  │ │    │ │    │ 
      30.00 ┤      ╰╯    ││            ╰─╯     ╰─╯  │  │    │ │    │ │    ╰ 
      11.00 ┤            ╰╯                         ╰──╯    ╰─╯    ╰─╯      
```

## Getting package-level statistics

The `--by-package` flag is enabled automatically by default, so it doesn't need to be specified.

### Basic usage

```bash
$ npm-stats --package axios
```

This will output the download statistics of the `axios` package from yesterday, aggregated to monthly level, and output as JSON.

```bash
{"years":{"2017":{"downloads":75897,"months":{"12":{"downloads":75897,"packages":{"axios":{"downloads":75897}}}}}}}
```

### Other options

The other options and possibilities are the same as for the user-level statistics (see above).
