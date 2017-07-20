// Vetor no espaço 3D
function Vector(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

// Soma com outro vetor
Vector.prototype.add = function(vector) {
  var x = this.x + vector.x;
  var y = this.y + vector.y;
  var z = this.z + vector.z;

  // Retorna o vetor em um novo objeto
  return new Vector(x, y, z);
};

// Subtrai por outro vetor
Vector.prototype.sub = function(vector) {
  var x = this.x - vector.x;
  var y = this.y - vector.y;
  var z = this.z - vector.z;

  // Retorna o vetor em um novo objeto
  return new Vector(x, y, z);
};

// Encontra a norma do vetor
Vector.prototype.norm = function() {
  var norm = this.dotProduct(this);

  return Math.sqrt(norm);
};

// Calcula o produto escalar com outro vetor
Vector.prototype.dotProduct = function(vector) {
  return (this.x * vector.x + this.y * vector.y + this.z * vector.z);
};

// Calcula o produto vetorial com outro vetor
Vector.prototype.crossProduct = function(vector) {
  var x = (this.y * vector.z) - (this.z * vector.y);
  var y = (this.z * vector.x) - (this.x * vector.z);
  var z = (this.x * vector.y) - (this.y * vector.x);

  return new Vector(x, y, z);
};

// Normaliza o vetor
Vector.prototype.normalize = function() {
  var norm = this.norm();

  if (norm == 0) {
    return;
  }

  // Divide as coordenadas pela norma
  this.x /= norm;
  this.y /= norm;
  this.z /= norm;
};

// Multiplica os compnentes do vetor por uma constant
Vector.prototype.scalarMultiplication = function(k) {
  var x = this.x * k;
  var y = this.y * k;
  var z = this.z * k;

  return new Vector(x, y, z);
};

// Faz a projeção ortogonal em outro vetor
Vector.prototype.orthogonalProjection = function(vector) {
  var k = this.dotProduct(vector) / this.dotProduct(this);

  var projection = this.clone();

  return projection.scalarMultiplication(k);
};

// Ortogonaliza através do processo de Gram-Schmidt
Vector.prototype.gramSchmidt = function(vector) {
  return this.sub(vector.orthogonalProjection(this));
};

// Seta o X e o Y com a função chão
Vector.prototype.round = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  this.z = Math.floor(this.z);
}

// Clona o vetor
Vector.prototype.clone = function() {
  return new Vector(this.x, this.y, this.z);
};

// Pega o vetor em relação as coordenadas baricêntricas do triangulo 2D
function getVectorFromBarycenterCoordinates(p1, p2, p3, barycenterCoordinates) {
  var alpha = barycenterCoordinates.alpha;
  var beta = barycenterCoordinates.beta;
  var gamma = barycenterCoordinates.gamma;

  var px = p1.normal.x * alpha + p2.normal.x * beta + p3.normal.x * gamma;
  var py = p1.normal.y * alpha + p2.normal.y * beta + p3.normal.y * gamma;
  var pz = p1.normal.z * alpha + p2.normal.z * beta + p3.normal.z * gamma;

  return new Vector(px, py, pz);
}
