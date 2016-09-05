
(function() {
 var app =  angular.module('app', []);
 // A controller that displays hello world
  app.controller('HomeCtrl', function() {
     this.message = "Hello, world";
  });
})();
