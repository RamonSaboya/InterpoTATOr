// Ponto 3D
function Point3D(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.normal = new Vector(0, 0, 0);
}

// Soma as coordendas com as de outro ponto
Point3D.prototype.add = function(point) {
  var x = this.x + point.x;
  var y = this.y + point.y;
  var z = this.z + point.z;

  // Retorna um ponto em um novo objeto
  return new Point3D(x, y, z);
};

// Subtrai as coordenadas pelas de outro ponto
Point3D.prototype.sub = function(point) {
  var x = this.x - point.x;
  var y = this.y - point.y;
  var z = this.z - point.z;

  // Retorna um ponto em um novo objeto
  return new Point3D(x, y, z);
};

// Realiza a multiplicação por uma constante
Point3D.prototype.scalarMultiplication = function(k) {
  var x = this.x * k;
  var y = this.y * k;
  var z = this.z * k;

  // Retorna um ponto em um novo objeto
  return new Point3D(x, y, z);
};

// Mutiplica o ponto por uma matriz
Point3D.prototype.matrixMultiplication = function(matrix) {
  var x = (this.x * matrix[0][0]) + (this.y * matrix[0][1]) + (this.z * matrix[0][2]);
  var y = (this.x * matrix[1][0]) + (this.y * matrix[1][1]) + (this.z * matrix[1][2]);
  var z = (this.x * matrix[2][0]) + (this.y * matrix[2][1]) + (this.z * matrix[2][2]);

  // Retorna um ponto em um novo objeto
  return new Point3D(x, y, z);
};

// Retorna o ponto na base da camera
Point3D.prototype.changeBase = function(camera) {
  // Ponto em coordenadas do mundo
  var view = this.clone();

  // Coordenadas subtraidas pelo ponto de da camera
  var v = view.sub(camera.c);

  // Multiplicado pela matriz de mudança de base
  var r = v.matrixMultiplication(camera.alpha);

  return r;
};

// Projeta um ponto na tela
Point3D.prototype.projectPoint = function(camera, index) {
  // X e Y do ponto no intervalo [-1, 1]
  var x = (camera.d / camera.hx) * (this.x / this.z);
  var y = (camera.d / camera.hy) * (this.y / this.z);

  // Acomoda o ponto nos limites da tela
  var pp = new Point2D((x + 1) * width / 2, (1 - y) * height / 2, index);

  return pp;
};

// Seta o X, Y e Z com a função chão
Point3D.prototype.round = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  this.z = Math.floor(this.z);
};

// Cria um vetor com as coordenadas do ponto
Point3D.prototype.toVector = function() {
  return new Vector(this.x, this.y, this.z);
};

// Clona o ponto
Point3D.prototype.clone = function() {
  return new Point3D(this.x, this.y, this.z);
};

// Pega o ponto em relação as coordenadas baricêntricas do triangulo 2D
function getPointFromBarycenterCoordinates(p1, p2, p3, barycenterCoordinates) {
  var alpha = barycenterCoordinates.alpha;
  var beta = barycenterCoordinates.beta;
  var gamma = barycenterCoordinates.gamma;

  var px = p1.x * alpha + p2.x * beta + p3.x * gamma;
  var py = p1.y * alpha + p2.y * beta + p3.y * gamma;
  var pz = p1.z * alpha + p2.z * beta + p3.z * gamma;

  return new Point3D(px, py, pz);
}
