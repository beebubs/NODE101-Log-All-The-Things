# NODE101-Log-All-The-Things

The purpose of this project was to practice transforming data by using node to build a logger.

This was the exit criteria:
1. Every request to your server must be logged to the console
2. Every request to your server must be logged to a file
3. The log file is named log.csv and must be csv format
4. Must use fs.appendFile, do not use fs.appendFileSync
5. Expose an endpoint (does not require authentication) http://localhost:3000/logs that will return a json object with all the logs
6. All tests must pass
