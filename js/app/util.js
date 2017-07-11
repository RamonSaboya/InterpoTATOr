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

Vector.prototype.vectorSacalarProduct = function(v) {
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
  n = this.sacalarProduct(this);
  return Math.sqrt(n);
};

Vector.prototype.getCosine = function(v) {
  return (v.sacalarProduct(this))/(this.getNorm() * v.getNorm());
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
  var scalarProduct = vectorSacalarProduct(v);
  var vNorm = v.getNorm();
  vNorm *= vNorm;

  return v.constantScalarProduct(scalarProduct/vNorm);
};

Vector.prototype.vectorSum(v) {
  var x = this.x + v.x;
  var y = this.y + v.y;
  var z = this.z + v.z;

  return new Vector(x, y, z);
};

Vector.prototype.vectorSub(v) {
  var x = this.x - v.x;
  var y = this.y - v.y;
  var z = this.z - v.z;

  return new Vector(x, y, z);
};

Vector.prototype.gramSchimdt = function() {
  return this.sub(v.ortogonalProjection(this));
};

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y, this.z);
};
