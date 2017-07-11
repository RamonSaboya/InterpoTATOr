/* global Vector */
/* global Point3D */

function Triangle(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = new Vector(0, 0, 0);
}

Triangle.prototype.sort = function() {
  var aux;
  
  if(this.p1.y > this.p2.y) {
    aux = this.p1.clone();
    this.p1 = this.p2;
    this.p2 = aux;
  }
  if(this.p2.y > this.p3.y) {
    aux = this.p2.clone();
    this.p2 = this.p3;
    this.p3 = aux;
  }
  if (this.p1.y > this.p2.y) {
    aux = this.p1.clone();
    this.p1 = this.p2;
    this.p2 = aux;
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

  this.normal = v21.crossProduct(v32);
  this.normal.normalize();
};

Triangle.prototype.projectTriangle = function(camera) {
  var p1 = this.p1.projectPoint(camera);
  var p2 = this.p2.projectPoint(camera);
  var p3 = this.p3.projectPoint(camera);

  return new Triangle(p1, p2, p3);
};

Triangle.prototype.getCentroidPoint3D = function(barycenter) {
  var p1 = this.p1.clone();
  var p2 = this.p2.clone();
  var p3 = this.p3.clone();

  p1 = p1.scalarProduct(barycenter.alpha);
  p2 = p2.scalarProduct(barycenter.beta);
  p3 = p3.scalarProduct(barycenter.gama);

  return new Point3D(p1.x + p2.x + p3.x, p1.y + p2.y + p3.y, p1.z + p2.z + p3.z);
};

Triangle.prototype.getCentroidVector = function(barycenter) {
  var a = this.p1.normal.clone();
  var b = this.p2.normal.clone();
  var c = this.p3.normal.clone();
  
  a = a.scalarProduct(barycenter.alpha);
  b = b.scalarProduct(barycenter.beta);
  c = c.scalarProduct(barycenter.gamma);

  a.add(b);
  a.add(c);

  return new Vector(a.x, a.y, a.z);
};
