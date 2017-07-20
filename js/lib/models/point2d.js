// Ponto projeto na tela
function Point2D(x, y, index) {
  this.x = x;
  this.y = y;

  // Index do ponto 3D correspondente
  this.index = index;
  
  this.round();
}

// Seta o X e o Y com a função chão
Point2D.prototype.round = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
};

// Clona o ponto
Point2D.prototype.clone = function() {
  return new Point2D(this.x, this.y, index);
};
