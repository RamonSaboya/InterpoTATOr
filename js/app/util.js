function Vector (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector.prototype.add = function(v) {
  var x = this.x + v.x;
  var y = this.y + v.y;
  var z = this.z + v.z;

  return new Vector(x, y, z);
};

Vector.prototype.sub = function(v) {
  var x = this.x - v.x;
  var y = this.y - v.y;
  var z = this.z - v.z;

  return new Vector(x, y, z);
};

Vector.prototype.vectorscalarProduct = function(v) {
  var n = (this.x * v.x) + (this.y * v.y) + (this.z * v.z);
  return n;
};

Vector.prototype.crossProduct = function(v) {
  var x = (this.y * v.z) - (this.z * v.y);
  var y = (this.z * v.x) - (v.z * this.x);
  var z = (this.x * v.y) - (this.y * v.x);

  return new Vector(x, y, z);
};

Vector.prototype.getNorm = function() {
  n = this.scalarProduct(this);
  return Math.sqrt(n);
};

Vector.prototype.getCosine = function(v) {
  return (v.scalarProduct(this))/(this.getNorm() * v.getNorm());
};

Vector.prototype.normalize = function(){
  norm = this.getNorm();
  if (norm == 0) return;
  this.x /= norm;
  this.y /= norm;
  this.z /= norm;
};

Vector.prototype.constantScalarProduct = function(k) {
  var x = this.x * k;
  var y = this.y * k;
  var z = this.z * k;

  return new Vector(x, y, z);
};

Vector.prototype.ortogonalProjection = function(v) {
  var scalarProduct = vectorscalarProduct(v);
  var vNorm = v.getNorm();
  vNorm *= vNorm;

  return v.constantScalarProduct(scalarProduct/vNorm);
};

Vector.prototype.sum(v) {
  var x = this.x + v.x;
  var y = this.y + v.y;
  var z = this.z + v.z;

  return new Vector(x, y, z);
};

Vector.prototype.gramSchimdt = function() {
  return this.sub(v.ortogonalProjection(this));
};

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y, this.z);
};

function Point3D (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.normal = new Vector(0, 0, 0);
}

Point3D.prototype.sum = function(p) {
  var x = this.x + p.x;
  var y = this.y + p.y;
  var z = this.z + p.z;

  return new Point3D(x, y, z);
};

Point3D.prototype.sub = function(p) {
  var x = this.x - p.x;
  var y = this.y - p.y;
  var z = this.z - p.z;

  return new Point3D(x, y, z);
};

Point3D.prototype.toBase = function(matrix) {
  var x = (matrix[0][0] * this.x) + (matrix[0][1] * this.y) + (matrix[0][2] * this.z);
  var y = (matrix[1][0] * this.x) + (matrix[1][1] * this.y) + (matrix[1][2] * this.z);
  var z = (matrix[2][0] * this.x) + (matrix[2][1] * this.y) + (matrix[2][2] * this.z);

  return new Point3D(x, y, z);
};

Point3D.prototype.clone = function() {
  return new Point3D(this.x, this.y, this.z);
};

Point3D.prototype.toView = function(cam) {
  var view = this.clone();
  var v = view.sub(cam.c);
  return v.toBase(cam.alfa);
};

Point3D.prototype.getScreenPoint = function(cam) {
  var x = (cam.d/cam.hx) * (this.x/this.z);
  var y = (cam.d/cam.hy) * (this.y/this.z);

};

Point3D.prototype.constantScalarProduct = function(k) {
  var x = this.x * k;
  var y = this.y * k;
  var z = this.z * k;

  return new Point3D(x, y, z);
};

function Point2D (x, y) {
  this.x = x;
  this.y = y;
  this.normal = new Vector(0, 0, 0);
};

Point2D.prototype.clone = function() {
  return new Point2D(this.x, this.y);
};

function Triangle(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = new Vector(0, 0, 0);
}

Triangle.prototype.sort = function() {
  if(this.p1.y > this.p2.y) {
    var a = this.p2.clone();
    this.p2 = this.p1;
    this.p1 = this.p2;
  }
  if(this.p2.y > this.p3.y) {
    var a = this.p2.clone();
    this.p2 = this.p3;
    this.p3 = a;
  }
  if (this.p1.y > this.p2.y) {
    var a = this.p1.clone();
    this.p1 = this.p2;
    this.p2 = a;
  }
};

Triangle.prototype.calculateNormal = function() {
  this.sort();
  var x = this.p2.x - this.p1.x;
  var y = this.p2.y - this.p1.y;
  var z = this.p2.z - this.p1.z;
  var v21 = new Vector(x, y, z);

  x = this.p3.x - this.p2.x;
  y = this.p3.y - this.p2.y;
  z = this.p3.z - this.p2.z;
  var v32 = new Vector(x, y, z);

  this.normal = v21.getNormal(v32);
  this.normal.normalize();
};

Triangle.prototype.getScreenTiangle = function(cam) {
  var p1 = this.p1.getScreenPoint(cam);
  var p2 = this.p2.getScreenPoint(cam);
  var p3 = this.p3.getScreenPoint(cam);

  return new Triangle(p1, p2, p3);
};

Triangle.prototype.getBaricentricalPoint3D(cb) {
  var a = this.p1.clone();
  var b = this.p2.clone();
  var c = this.p3.clone();

  a = a.scalarProduct(cb.alpha);
  b = b.scalarProduct(cb.beta);
  c = c.scalarProduct(cb.gama);

  return new Point3D(a.x +b.x + c.x, a.y + b.y + c.y, a.z + b.z + c.z);
};

Triangle.prototype.getBaricentricalVector(cb) {
  var a = this.p1.normal.clone();
  var b = this.p2.normal.clone();
  var c = this.p3.normal.clone();
  a = a.scalarProduct(cb.alpha);
  b = b.scalarProduct(cb.beta);
  c = c.scalarProduct(cb.gama);

  a.sum(b);
  a.sum(c);

  return new Vector(a.x, a.y, a.z);
};
