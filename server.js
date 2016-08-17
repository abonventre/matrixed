var getPixels = require("get-pixels");
var colors = require("colors");
var ndarray = require("ndarray");

var matrixWidth = 34,
    matrixHeight = 16;

getPixels("images/r2d2.jpg", function(err, pixels) {
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

    xInterval = Math.floor(imageWidth / matrixWidth);
    yInterval = Math.floor(imageWidth / matrixHeight);

    for (var i = 0; i < matrixWidth; i++) {
      for (var j = 0; j < matrixHeight; j++) {
        console.log('x: '.bgMagenta,i*xInterval);
        console.log('y: '.bgCyan,j*yInterval);
        console.log('Color:'.inverse);
        console.log("R: ".red, pixels.get(i*xInterval, j*yInterval, 0));
        console.log("G: ".green, pixels.get(i*xInterval, j*yInterval, 1));
        console.log("B: ".blue, pixels.get(i*xInterval, j*yInterval, 2));
        console.log("Brightness: ".gray, pixels.get(i*xInterval, j*yInterval, 3));
        for (var k = 0; k < 4; k++) {
          image.push( pixels.get(i*xInterval, j*yInterval, k));
        }

      }
    }
    console.log(image);

  }else if(pixels.dimension === 4){ // 4D include frames making it a gif
    console.log('This is a gif.'.bgBlue);
    console.log('Color:'.inverse);
    console.log("R: ".red, pixels.get(1, 200, 150, 0));
    console.log("G: ".green, pixels.get(1, 200, 150, 1));
    console.log("B: ".blue, pixels.get(1, 200, 150, 2));
    console.log("Brightness: ".gray, pixels.get(1, 200, 150, 3));
  }else{
    console.log('Could not identify the selected image.'.bgRed);
  }

});
