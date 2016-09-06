(function(){
  'use strict';
  var app = angular.module('app');

  app.component('displayBox', {
    // defines a two way binding in and out of the component
    bindings: {
      ledData:'<'
     },
    // Load the template
    templateUrl: '/app/shared/display/displayView.html',
    controller: function () {
      var ctrl = this;
      ctrl.rows = 16;
      ctrl.columns = 34;


      if(ctrl.ledData.length != (ctrl.rows * ctrl.columns * 3)){
        ctrl.ledData.shift();
      }


      ctrl.getNumber = function(num) {
          return new Array(num);
      }


      ctrl.returnColor = function(row,column) {
        var color = {
          red: null,
          green: null,
          blue: null
        };
        var adjustedColumn = 0;
        if(row & 1){
          adjustedColumn = column;
        }else{
          adjustedColumn = (ctrl.columns-1) - column;
        }
        var currentLED = (row*ctrl.columns + adjustedColumn) * 3;
        color.red = ctrl.ledData[currentLED] || 0;
        color.green = ctrl.ledData[currentLED+1] || 0;
        color.blue = ctrl.ledData[currentLED+2] || 0;
        return {"background-color" : 'rgba(' + color.red + ',' + color.green + ',' + color.blue + ',1)'};
      }
    }
  });
})();
