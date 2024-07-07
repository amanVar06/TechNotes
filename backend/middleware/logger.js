const {format} = require('date-fns');
const {v4: uuidv4} = require('uuid');

const fs = require('fs');
const fsPromises = fs.promises;

const path = require('path');


// helper function
const logEvents = async(message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;


    try{
        if(!fs.existsSync(path.join(__dirname, "..", 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, "..", 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, "..", 'logs', logFileName), logItem);
    }
    catch(err){
        console.log(err);
    }
}

// actual middleware
const logger = (req, res, next) => {
    const logMessage = `${req.method}\t${req.url}\t${req.ip}\t${req.headers.origin}`;
    logEvents(logMessage, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
}

// next in middleware is a function that when invoked, executes the next middleware in the stack

module.exports = { logger, logEvents };