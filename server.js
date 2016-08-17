var getPixels = require("get-pixels");
var colors = require("colors");

getPixels("gifs/walk.gif", function(err, pixels) {
  if(err) {
    console.log("Bad image path");
    return;
  }
  console.log(pixels.dimension);
  if(pixels.dimension === 3) { // 3D is a static image
    console.log('This is an image.'.bgRed);
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
