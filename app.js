var express  = require('express');
var app      = express();                               // create our app w/ express
var port     = process.env.PORT || 4001;                // set the port
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

var image = require('./api/image/index')();


// routes ======================================================================
app.use('/api/images', image);

app.get('*', function(req, res) {
        res.sendFile('index.html', options, function(err){
          if (err) {
            console.log(err);
            res.status(err.status).end();
          }
        }); // load the single view file (angular will handle the page changes on the front-end)
    });

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
