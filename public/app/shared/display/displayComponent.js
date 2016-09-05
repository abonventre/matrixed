(function(){
  'use strict';
  var app = angular.module('app');

  app.component('displayBox', {
    // defines a two way binding in and out of the component
    bindings: {
      brand:'<'
     },
    // Load the template
    templateUrl: '/app/shared/display/displayView.html',
    controller: function () {
    // A list of menus
      this.menu = [{
        name: "Home",
        component: "home"
      }, {
        name: "About",
        component: "about"
      }, {
        name: "Contact",
        component: "contact"
      }];
    }
  });
})();
