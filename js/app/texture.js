const TEXTURE_FILE_ID = "texture-file";

var texture = [];

function Texture(textureVector, width, height) {
  this.textureVector = textureVector;
  this.width = width;
  this.height = height;
}

Texture.prototype.getPixel = function(x, y) {
  x = Math.abs(Math.round(x));
  y = Math.abs(Math.round(y));
  
  x = x % this.width;
  y = y % this.height;
  
  var index = (x * 4) + (y * this.width);
  
  var data = this.textureVector;
  
  var red = data[index];
  var green = data[index + 1];
  var blue = data[index + 2];
  
  textureVector = new Vector(red, blue, green);
  textureVector.normalize();
  
  return textureVector;
};

function uploadTexture(event) {
  var file = event.target.files[0];
  
  var imageContext = document.createElement("canvas").getContext("2d");
  var image = new Image;
  
  image.src = URL.createObjectURL(file);

  image.onload = function() {
    imageContext.drawImage(image, 0, 0);
    
    var width = image.naturalWidth;
    var height = image.naturalHeight;

    processTexture(imageContext.getImageData(0, 0, width, height).data, width, height);
  }
}

document.getElementById(TEXTURE_FILE_ID).addEventListener('change', uploadTexture, false);

function processTexture(data, width, height) {
  texture.push(new Texture(data, width, height));
}

function isTextureReady() {
  return texture.length > 0;
}