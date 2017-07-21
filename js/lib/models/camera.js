// Câmera virtual
function Camera(c, n, v, d, hx, hy) {
  this.c = c; // Ponto da câmera no espaço 3D
  this.n = n; // Vetor da direção da câmera
  this.v = v; // Vetor da rotação da câmera
  this.d = d; // Escala da câmera
  this.hx = hx; // Tamanho do eixo X
  this.hy = hy; // Tamanho do eixo Y

  this.alpha = []; // Matriz de transformação
}

// Gera a matriz de transformação
Camera.prototype.genAlpha = function() {
  this.n.normalize();

  this.v = this.v.gramSchmidt(this.n);
  this.v.normalize();

  // Vetor ortognal a V e N
  var u = this.n.crossProduct(this.v);

  this.alpha.push([u.x, u.y, u.z]);
  this.alpha.push([this.v.x, this.v.y, this.v.z]);
  this.alpha.push([this.n.x, this.n.y, this.n.z]);
};
