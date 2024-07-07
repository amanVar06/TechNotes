const allowedOrigins = require('./allowedOrigins');

// for 3rd party middleware
// lookup object
// !origin allows postman and other tools to access the API
const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 | !origin){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions;