var getPixels = require("get-pixels");
var ndarray = require("ndarray");
var fs = require('fs');

// TODO: Move to some kind of config...
var matrixWidth = 34;
var matrixHeight = 16;

var gamma = 1.7,
    gammaTable = [];

for (var i = 0; i < 256; i++) {
  gammaTable[i] = Math.floor(Math.pow(i/255.0,gamma)*255.0+0.5);
}

// Function : getUrlPixels
// Returns : ndArray of pixels in proper dimension for matrix
function getUrlPixels(imageUrl, callback) {
  getPixels(imageUrl, function(err, pixels) {

    console.log(imageUrl);

    if(err) {
      console.log("Bad image path");
      return {'err': err};
    }

    // Initialize image dimensions
    var imageWidth = 0,
        imageHeight = 0;

    // Intervals to downsize image to fit matrix
    var xInterval = 0,
        yInterval = 0;

    // Initialize image array
    var image = [];
    var imageMatrix;

    // Check if the imageUrl is for a photo
    if(pixels.dimension === 3) { // 3D is a static image
      console.log('This is a photo.');

      // Set image dimensions using shape of ndArray returned by get-pixels
      imageWidth = pixels.shape[0];
      imageHeight = pixels.shape[1];




      // Check if the image is already the proper dimensions
      if (imageWidth == matrixWidth && imageHeight == matrixHeight) {
        console.log('Image is already correct size.');
        // Skip resizing and just set the imageMatrix as the pixels
        imageMatrix = pixels;

      }else{
        console.log('Cropping Image');

        // Find necessary interval to downsize image
        xInterval = Math.floor(imageWidth / matrixWidth);
        yInterval = Math.floor(imageHeight / matrixHeight);

        // Iterate through matrix x and y and push each pixels values to an array
        for (var i = 0; i < matrixWidth; i++) {
          for (var j = 0; j < matrixHeight; j++) {
            for (var k = 0; k < 4; k++) {
              image.push(pixels.get(i*xInterval, j*yInterval, k));
            }

          }
        }

        // Recreate an ndArray representing the image array
        imageMatrix = ndarray(new Float64Array(image), [matrixWidth, matrixHeight, 4]);

      }



    // Check if the imageUrl is for a gif
    }else if(pixels.dimension === 4){ // 4D include frames making it a gif
      console.log('This is a gif');

      // Set image dimensions using shape of ndArray returned by get-pixels
      imageWidth = pixels.shape[1];
      imageHeight = pixels.shape[2];

      // Check if the image is already the proper dimensions
      if (imageWidth == matrixWidth && imageHeight == matrixHeight) {
        console.log('Gif is already right size.');
        imageMatrix = pixels;

      }else{

        console.log('Cropping the gif');

        // Find necessary interval to downsize image
        xInterval = Math.floor(imageWidth / matrixWidth);
        yInterval = Math.floor(imageHeight / matrixHeight);

        // Iterate through all frames and matrix x and y and rgb brightness values
        for (var l = 0; l < pixels.shape[0]; l++){
          for (var i = 0; i < matrixWidth; i++) {
            for (var j = 0; j < matrixHeight; j++) {
              for (var k = 0; k < 4; k++) {
                image.push(pixels.get(l, i*xInterval, j*yInterval, k));
              }

            }
        }

        }
        imageMatrix = ndarray(new Float64Array(image), [pixels.shape[0], matrixWidth, matrixHeight, 4]);
      }

    }else{
      console.log('Could not identify the selected image.'.bgRed);
      return {'err': 'Image is not compatible.'};
    }
    callback(imageMatrix);
  });
}

// Function : convertToRGBBuffer
// Returns : Pixels as buffer containing just RGB data
function convertToRGBList(pixels, callback){
    // Initialize imageBuffer with start byte '*'
    var imageBuffer = [0x2A];
    var count = 0;
    var xBegin = 0;
    var xEnd = 0;
    var xInc = 0;
    var row = 0;

    if(pixels.dimension === 3) {
      frames = 0;
    }else if (pixels.dimension === 4){
      frames = pixels.shape[0];
    }else{
      return {'err': 'image cannot be identified.'}
    }

    //Iterate over matrix x and y
    for (var y = 0; y < matrixHeight; y++) {
      // Check if row is even or odd to alternate direction of row
      // This is to work with a snaking led pattern
      if(y & 1) {
        // Odd Numbered Rows
        xbegin = 0;
        xend = matrixWidth;
        xinc = 1;
      }else{
        // Even Numbered Rows
        xbegin = matrixWidth-1;
        xend = -1;
        xinc = -1;
      }
      for (var x = xbegin; x != xend; x += xinc) {
          // Initialize the rgb values
          var red = 0;
          var green = 0;
          var blue= 0;

          // Check if the image is a gif
          if(frames > 0){
            // Use gamma table to adjust gamma for led display
            red = gammaTable[pixels.get(frame-1, x, y, 0)];
            green = gammaTable[pixels.get(frame-1, x, y, 1)];
            blue = gammaTable[pixels.get(frame-1, x, y, 2)];
          }else{
            red = gammaTable[pixels.get(x, y, 0)];
            green = gammaTable[pixels.get(x, y, 1)];
            blue = gammaTable[pixels.get(x, y, 2)];
          }
          // Push rgb values onto imageBuffer
          imageBuffer.push(red, green, blue);
        }
    }
    console.log('Buffer completed.');
    callback(imageBuffer);
}

module.exports = function() {

  var image = {};

  image.changeImage = function(callback){
    getUrlPixels('./images/dog.jpg', function(imageBuffer){
      convertToRGBList(imageBuffer, callback);
    });
  };

  return image;

};
