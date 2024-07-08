require('dotenv').config();
const express = require('express');
const app = express(); 
const path = require('path');
const {logger} = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
const {logEvents } = require('./middleware/logger');

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));
// it lets our app to accept requests from other origins

// ability to parse json data
app.use(express.json());
// it lets our app to recieve and parse JSON data 

app.use(cookieParser());
// it lets our app to parse cookies

// express.static is a built-in middleware function in Express. It serves static files and is based on serve-static.
app.use("/", express.static(path.join(__dirname, 'public')));

// app.use(express.static('public'));
// another way to serve static files, because it is relative to where your index.js/server.js file is located.

app.use("/", require('./routes/root'));
app.use("/api/v1/auth", require('./routes/authRoutes'));
app.use("/api/v1/users", require('./routes/userRoutes'));
app.use("/api/v1/notes", require('./routes/noteRoutes'));

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
        return;
    }else if(req.accepts("json")){
        res.json({message: "404 Not Found"});
        return;
    }else {
        res.type('txt').send('404 Not Found');    
    }
});


app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});