const {logEvents} = require('./logger');

// it replaces the default error handler in Express
const errorHandler = (err, req, res, next) => {
    const logMessage = `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`;

    logEvents(logMessage, 'errorLog.log');

    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500;
    res.status(status)
    res.json({message: err.message, isError: true});
    // for managing error more appropriately in frontend using RTK Query (this flag is looked up by RTK query)

    next();
}

module.exports = errorHandler;