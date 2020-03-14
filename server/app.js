var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const morgan = require("morgan");
var mongoose = require('mongoose');

const config = require('./config/database');

mongoose.connect(config.database);
// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database ==> ' + config.database);
});
// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

var conn = mongoose.connection;

/** Seting up server to accept cross-origin browser requests */
app.use(cors());
app.use(function (req, res, next) {
    //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// Port Number
const port = 3000;

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/productImages/', express.static('./productImages'));

// for logger
app.use(morgan("dev"));

// Body Parser Middleware
app.use(bodyParser.json());

// passport (used for authentication)
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//routes for api
const users = require('./routes/userRoutes');
const products = require('./routes/productRoutes');
const accounts = require('./routes/accountRoutes');

app.use('/users', users);
app.use('/products', products);
app.use('/accounts', accounts);

// Index Route
app.get('/', (req, res) => {
    // res.send('<h3>Hi! you have reached to the end point of IIFT Server</h3>');
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port >> ' + port);
});