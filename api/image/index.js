var image = require('./image');
var express = require('express');
var router = express.Router();


module.exports = function() {

  // image -------------------------------------------------------------
  router.get('/', function(req, res) {
      res.send('Hello');
  });

  return router;
};
