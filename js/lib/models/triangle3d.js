// Triângulo de pontos 3D
function Triangle3D(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;

  this.normal = new Vector(0, 0, 0);
}

// Acha a normal da superfície
Triangle3D.prototype.calculateNormal = function() {
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
Triangle3D.prototype.clone = function() {
  return new Triangle(this.p1, this.p2, this.p3);
}
