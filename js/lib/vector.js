function Vector (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector.prototype.cosineBetween = function(vector) {
  return this.dotProduct(vector) / (this.norm() * vector.norm());
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
  return (this.x * vector.x + this.y * vector.y + this.z * vector.z);
};

Vector.prototype.crossProduct = function(vector) {
  var x = (this.y * vector.z) - (this.z * vector.y);
  var y = (this.z * vector.x) - (this.x * vector.z);
  var z = (this.x * vector.y) - (this.y * vector.x);

  return new Vector(x, y, z);
};

Vector.prototype.normalize = function() {
  var norm = this.norm();
  
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

Vector.prototype.orthogonalProjection = function(vector) {
  var k = this.dotProduct(vector) / this.dotProduct(this);
  
  var projection = this.clone();

  return projection.scalarProduct(k);
};

Vector.prototype.gramSchmidt = function(vector) {
  return this.sub(vector.orthogonalProjection(this));
};

Vector.prototype.round = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  this.z = Math.floor(this.z);
}

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y, this.z);
};