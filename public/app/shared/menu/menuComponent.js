(function(){
  'use strict';
  var app = angular.module('app');

  app.component('menuBar', {
    // defines a two way binding in and out of the component
    bindings: {
      brand:'<'
     },
    // Load the template
    templateUrl: '/app/shared/menu/menuView.html',
    controller: function () {
      var ctrl = this;
    // A list of menus
      ctrl.menu = [{
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
