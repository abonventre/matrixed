var SerialPort = require('serialport');
var prompt = require('prompt');
var rc = require('rgb-random-array');

var usbPort;



var gamma = 1.7;

var gammatable = [];

for (var i = 0; i < 256; i++) {
  // gammatable[i] = (int)(pow((float)i / 255.0, gamma) * 255.0 + 0.5);
  gammatable[i] = Math.floor(Math.pow(i/255.0,gamma)*255.0+0.5);
}

console.log(gammatable);

function listSerialPorts(err, ports){
  var index = 0;
  ports.forEach(function(port) {
    index++;
    console.log(index);
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
  });
  promptForPort(ports);
}

function promptForPort(ports) {
  prompt.start();
  prompt.get(['port'], function (err, result) {
    var newPort = ports[result.port-1].comName;
    console.log('Chosen Port: ', newPort);
    setPort(newPort);
  });
}
function waitForData() {
  usbPort.on('data', function(data){
    console.log('Data: ' + data);
  });
}

function setPort(port) {
  usbPort = new SerialPort(port, function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }
    console.log("Port set as: ", port);
    // promptForRGB();
    // genSendLED();
    var interval = setInterval(genSendLED,200);
  });


}

function sendMessage(message){
  console.log('boo: ', message);
    console.log('test');
    usbPort.write(message, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written: ',message);
      promptForRGB();
    });

}

function promptForMessage() {
  prompt.start();
  prompt.get(['message'], function (err, result) {
    sendMessage(result.message);
    waitForData();
  });
}

function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return rgb;
}

function promptForRGB() {
  // prompt.start();
  // prompt.get(['led', 'red','green','blue'], function (err, result) {
  //   var hex = rgb2hex(result.red*1, result.green*1, result.blue*1);
  //   var led = rc();
  //   // ledArray.write("?", "utf-8");
  //   // ledArray.write(result.led*1);]
  //   // ledArray.write(hex);
  //   console.log(led);
  //
  //   sendMessage(new Buffer([0x2A, result.green*1, result.red*1, result.blue*1, led[1], led[0], led[2]]));
  //   waitForData();
  // });
  prompt.start();
  prompt.get(['change'], function (err, result) {
    if (result.change === 'a'){
      var leds = 544;
      var bufferArray = [0x2A];

      for (var i = 0; i < leds; i++) {
        var led = rc();
        bufferArray.push(gammatable[led[1]], gammatable[led[0]], gammatable[led[2]]);
      }
      sendMessage(new Buffer(bufferArray));
      // waitForData();
    }

  });
}

function genSendLED () {
  var leds = 544;
  var bufferArray = [0x2A];

  for (var i = 0; i < leds; i++) {
    var led = rc();
    bufferArray.push(gammatable[led[1]], gammatable[led[0]], gammatable[led[2]]);
  }
  sendMessage(new Buffer(bufferArray));
}

SerialPort.list(listSerialPorts);



// SerialPort.list(function (err, ports) {
//   var index = 0;
//
//   //
//   // Start the prompt
//   //
//   prompt.start();
//
//   //
//   // Get two properties from the user: username and email
//   //
//   prompt.get(['port'], function (err, result) {
//     //
//     // Log the results.
//     //
//     console.log('Chosen Port: ', ports[result.port-1].comName);
//   });
// });
