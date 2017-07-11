function Vector (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector.prototype.cosineBetween = function(vector) {
  return this.dotProduct(vector) / (this.getNorm() * vector.getNorm());
};

Vector.prototype.add = function(vector) {
  var x = this.x + vector.x;
  var y = this.y + vector.y;
  var z = this.z + vector.z;

  return new Vector(x, y, z);
};

Vector.prototype.sub = function(vector) {
  var x = this.x - vector.x;
  var y = this.y - vector.y;
  var z = this.z - vector.z;
  
  return new Vector(x, y, z);
};

Vector.prototype.norm = function() {
  var norm = this.dotProduct(this);
  
  return Math.sqrt(norm);
};

Vector.prototype.dotProduct = function(vector) {
  var xProduct = this.x * vector.x;
  var yProduct = this.y * vector.y;
  var zProduct = this.z * vector.z;
  
  return xProduct + yProduct + zProduct;
};

Vector.prototype.crossProduct = function(vector) {
  var x = (this.y * vector.z) - (this.z * vector.y);
  var y = (this.z * vector.x) - (this.x * vector.z);
  var z = (this.x * vector.y) - (this.y * vector.x);

  return new Vector(x, y, z);
};

Vector.prototype.normalize = function() {
  var norm = this.getNorm();
  
  if (norm == 0) {
    return;
  }
  
  this.x /= norm;
  this.y /= norm;
  this.z /= norm;
};

Vector.prototype.scalarProduct = function(constant) {
  var x = this.x * constant;
  var y = this.y * constant;
  var z = this.z * constant;

  return new Vector(x, y, z);
};

Vector.prototype.ortogonalProjection = function(v) {
  var k = this.dotProduct(v) / this.dotProduct(this);
  
  var projection = this.clone();

  return projection.scalarProduct(k);
};

Vector.prototype.gramSchimdt = function(vector) {
  return this.sub(vector.ortogonalProjection(this));
};

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y, this.z);
};