var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var auth = require('./middleware/auth');
var network = require('./lib/network')
var keepalive = require('./lib/keepalive')

let config = process.env.PROD ? network.production : network.development;

//keepalive(config);

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(auth(config));

app.use('/transaction', require("./routes/transaction"));
app.use('/account', require("./routes/account"));
app.use('/manager', require("./routes/manager"));

var port = process.env.PORT || 8000;

app.listen(port);