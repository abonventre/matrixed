var image = require('./image')();
var express = require('express');
var router = express.Router();


module.exports = function() {

  // image -------------------------------------------------------------
  router.get('/', function(req, res) {
      res.send('Hello');
  });

  router.put('/', function(req, res){
    image.changeImage(function(buffer){
      res.status(200).json({'ledData': buffer});
    });

  });

  return router;
};
