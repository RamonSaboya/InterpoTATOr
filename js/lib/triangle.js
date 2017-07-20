// Triângulo
function Triangle(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = new Vector(0, 0, 0);
}

// Ordena as vértices do triângulo pelo menor y
Triangle.prototype.sort = function() {
  var aux;

  // Compara o y do ponto 1 e 2
  if (this.p1.y > this.p2.y) {
    // Realiza a troca
    aux = this.p1;
    this.p1 = this.p2;
    this.p2 = aux;
  }

  // Compara o y do ponto 1 e 3
  if (this.p1.y > this.p3.y) {
    // Realiza a troca
    aux = this.p1;
    this.p1 = this.p3;
    this.p3 = aux;
  }

  // Compara o y do ponto 2 e 3
  if (this.p2.y > this.p3.y) {
    // Realiza a troca
    aux = this.p2;
    this.p2 = this.p3;
    this.p3 = aux;
  }
};

// Acha a normal da superfície
Triangle.prototype.calculateNormal = function() {
  // Calcula o vetor que vai de P1 a P2
  var x = this.p2.x - this.p1.x;
  var y = this.p2.y - this.p1.y;
  var z = this.p2.z - this.p1.z;
  var v12 = new Vector(x, y, z);

  // Calcula o vetor que vai de P1 para P3
  x = this.p3.x - this.p1.x;
  y = this.p3.y - this.p1.y;
  z = this.p3.z - this.p1.z;
  var v13 = new Vector(x, y, z);

  this.normal = v12.crossProduct(v13);
  this.normal.normalize();
};

// Clona o triângulo
Triangle.prototype.clone = function() {
  return new Triangle(this.p1, this.p2, this.p3);
}

// Verifica se os pontos formam um triângulo
function isTriangle(p1, p2, p3) {
  return !((p1.x == p2.x && p1.y == p2.y) || (p1.x == p3.x && p1.y == p3.y) || (p2.x == p3.x && p2.y == p3.y));
}
