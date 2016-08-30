var SerialPort = require('serialport');
var getPixels = require("get-pixels");
var colors = require("colors");
var ndarray = require("ndarray");
var imshow = require("ndarray-imshow");

var gamma = 1.7,
    gammaTable = [];

for (var i = 0; i < 256; i++) {
  gammaTable[i] = Math.floor(Math.pow(i/255.0,gamma)*255.0+0.5);
}

var matrixWidth = 34,
    matrixHeight = 16;

function listSerialPorts(err, ports){
  ports.forEach(function(port) {
    if(port.manufacturer === "Teensyduino"){
      setPort(port.comName);
    }
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
    });
}

function setPort(port) {
  usbPort = new SerialPort(port, function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }
    console.log("Port set as: ", port);
    makePhoto();
    // promptForRGB();
    // genSendLED();
    // var interval = setInterval(genSendLED,200);
  });
}

function sendPhoto (pixels, frames, frame) {
  var imageBuffer = [0x2A];
  var count = 0;
  var xBegin = 0;
  var xEnd = 0;
  var xInc = 0;
  var row = 0;
  for (var y = 0; y < matrixHeight; y++) {
    if(y & 1) {
      // console.log('Odd');
      // Odd Numbered Rows
      xbegin = 0;
      xend = matrixWidth;
      xinc = 1;
    }else{
      // console.log('Even');
      // Even Numbered Rows
      xbegin = matrixWidth-1;
      xend = -1;
      xinc = -1;
    }
    for (var x = xbegin; x != xend; x += xinc) {
      // console.log('X: ',x, ' Y: ', y);
        // console.log(image[i]);
        var red = 0;
        var green = 0;
        var blue= 0;
        if(frames > 0){
            console.log(pixels.get(frame-1, x, y, 0));

          red = gammaTable[pixels.get(frame-1, x, y, 0)];
          green = gammaTable[pixels.get(frame-1, x, y, 1)];
          blue = gammaTable[pixels.get(frame-1, x, y, 2)];
        }else{
          red = gammaTable[pixels.get(x, y, 0)];
          green = gammaTable[pixels.get(x, y, 1)];
          blue = gammaTable[pixels.get(x, y, 2)];
        }


        imageBuffer.push(red, green, blue);
      }
  }
  // console.log('Length: ',imageBuffer.length);
  sendMessage(new Buffer(imageBuffer));
}

SerialPort.list(listSerialPorts);

function makePhoto() {
  getPixels("gifs/walk.gif", function(err, pixels) {
    if(err) {
      console.log("Bad image path");
      return;
    }
    // console.log(pixels.dimension);
    var imageWidth = 0,
        imageHeight = 0;

    var xInterval = 0,
        yInterval = 0;

    var image = [];

    if(pixels.dimension === 3) { // 3D is a static image
      console.log('This is an image.'.bgRed);
      console.log(pixels.shape);

      imageWidth = pixels.shape[0];
      imageHeight = pixels.shape[1];

      var imageMatrix;

      if (imageWidth == matrixWidth && imageHeight == matrixHeight) {
        console.log('Right Size');
        imageMatrix = pixels;
      }else{
        console.log('Cropping');
        xInterval = Math.floor(imageWidth / matrixWidth);
        yInterval = Math.floor(imageHeight / matrixHeight);

        console.log('Width: '.magenta,imageWidth);
        console.log('Height: '.cyan,imageHeight);
        console.log('Xint: '.bgMagenta,xInterval);
        console.log('Yint: '.bgCyan,yInterval);

        for (var i = 0; i < matrixWidth; i++) {
          for (var j = 0; j < matrixHeight; j++) {
            // console.log('x: '.bgMagenta,i*xInterval);
            // console.log('y: '.bgCyan,j*yInterval);
            // console.log('Color:'.inverse);
            // console.log("R: ".red, pixels.get(i*xInterval, j*yInterval, 0));
            // console.log("G: ".green, pixels.get(i*xInterval, j*yInterval, 1));
            // console.log("B: ".blue, pixels.get(i*xInterval, j*yInterval, 2));
            // console.log("Brightness: ".gray, pixels.get(i*xInterval, j*yInterval, 3));
            for (var k = 0; k < 4; k++) {
              image.push(pixels.get(i*xInterval, j*yInterval, k));
            }

          }
        }
        imageMatrix = ndarray(new Float64Array(image), [matrixWidth, matrixHeight, 4]);
      }


      sendPhoto(imageMatrix, 0);


      // console.log(imageMatrix.shape);
      // imshow(imageMatrix);

    }else if(pixels.dimension === 4){ // 4D include frames making it a gif
      console.log('This is a gif.'.bgBlue);
      console.log(pixels.shape);



      imageWidth = pixels.shape[1];
      imageHeight = pixels.shape[2];

      if (imageWidth == matrixWidth && imageHeight == matrixHeight) {
        console.log('Right Size');
        imageMatrix = pixels;
      }else{
        console.log('Cropping');

        xInterval = Math.floor(imageWidth / matrixWidth);
        yInterval = Math.floor(imageHeight / matrixHeight);

        console.log('Width: '.magenta,imageWidth);
        console.log('Height: '.cyan,imageHeight);
        console.log('Xint: '.bgMagenta,xInterval);
        console.log('Yint: '.bgCyan,yInterval);
        for (var l = 0; l < pixels.shape[0]; l++){
          for (var i = 0; i < matrixWidth; i++) {
            for (var j = 0; j < matrixHeight; j++) {
              // console.log('x: '.bgMagenta,i*xInterval);
              // console.log('y: '.bgCyan,j*yInterval);
              // console.log('Color:'.inverse);
              // console.log("R: ".red, pixels.get(i*xInterval, j*yInterval, 0));
              // console.log("G: ".green, pixels.get(i*xInterval, j*yInterval, 1));
              // console.log("B: ".blue, pixels.get(i*xInterval, j*yInterval, 2));
              // console.log("Brightness: ".gray, pixels.get(i*xInterval, j*yInterval, 3));
              for (var k = 0; k < 4; k++) {
                image.push(pixels.get(l, i*xInterval, j*yInterval, k));
              }

            }
        }

        }
        var imageMatrix = ndarray(new Float64Array(image), [pixels.shape[0], matrixWidth, matrixHeight, 4]);
      }
      console.log('Done');
      console.log(imageMatrix.shape);
      if(imageMatrix.shape[0] > 1){
        var currFrame = 1;
        setInterval(function() {
            console.log(currFrame);
            sendPhoto(imageMatrix, imageMatrix.shape[0], currFrame);
            if(currFrame < imageMatrix.shape[0]-1){
              currFrame++;
            }else{
              currFrame = 1;
            }

          }
        , 100);
      }else{
          sendPhoto(imageMatrix, imageMatrix.shape[0], 1);
      }



      // console.log(imageMatrix.shape);
      // imshow(imageMatrix);

    }else{
      console.log('Could not identify the selected image.'.bgRed);
    }

  });
}
