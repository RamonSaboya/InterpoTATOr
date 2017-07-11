/* global Vector */
/* global Point2D */

/* global width */
/* global height */

function Point3D (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.normal = new Vector(0, 0, 0);
}

Point3D.prototype.add = function(point) {
  var x = this.x + point.x;
  var y = this.y + point.y;
  var z = this.z + point.z;

  return new Point3D(x, y, z);
};

Point3D.prototype.sub = function(point) {
  var x = this.x - point.x;
  var y = this.y - point.y;
  var z = this.z - point.z;

  return new Point3D(x, y, z);
};

Point3D.prototype.scalarProduct = function(k) {
  var x = this.x * k;
  var y = this.y * k;
  var z = this.z * k;

  return new Point3D(x, y, z);
};

Point3D.prototype.matrixProduct = function(matrix) {
  var x = (matrix[0][0] * this.x) + (matrix[0][1] * this.y) + (matrix[0][2] * this.z);
  var y = (matrix[1][0] * this.x) + (matrix[1][1] * this.y) + (matrix[1][2] * this.z);
  var z = (matrix[2][0] * this.x) + (matrix[2][1] * this.y) + (matrix[2][2] * this.z);

  return new Point3D(x, y, z);
};

Point3D.prototype.changeBase = function(camera) {
  var view = this.clone();
  
  var v = view.sub(camera.c);
  
  return v.matrixProduct(camera.alfa);
};

Point3D.prototype.projectPoint = function(camera) {
  var x = (camera.d / camera.hx) * (this.x / this.z);
  var y = (camera.d / camera.hy) * (this.y / this.z);
  
  var pp = new Point2D(x, y);
  
  var spp = new Point2D((pp.x + 1) * width / 2, (1 - pp.y) * height / 2);
  
  spp = spp.round();
  
  spp.normal = this.normal.clone();
  
  return spp;
};

Point3D.prototype.round = function() {
  var x = Math.round(this.x);
  var y = Math.round(this.y);
  var z = Math.round(this.z);
  
  return new Point3D(x, y, z);
};

Point3D.prototype.clone = function() {
  return new Point3D(this.x, this.y, this.z);
};