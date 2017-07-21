// Cor RGB
function Color(red, green, blue) {
  this.red = Math.floor(red);
  this.green = Math.floor(green);
  this.blue = Math.floor(blue);
}

// Trunca os elementos da cor para máximo de 255
Color.prototype.truncate = function() {
  this.red = Math.min(this.red, 255);
  this.green = Math.min(this.green, 255);
  this.blue = Math.min(this.blue, 255);
}

// Retorna uma string no formato utilizado pelo canvas
Color.prototype.canvasStyle = function() {
  return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
};
