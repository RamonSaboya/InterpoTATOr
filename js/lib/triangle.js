function Triangle(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;
  this.normal = new Vector(0, 0, 0);
}

Triangle.prototype.sort = function() {
  var aux;
  
  if(this.p1.y > this.p2.y) {
    aux = this.p1;
    this.p1 = this.p2;
    this.p2 = aux;
  }
  if(this.p1.y > this.p3.y) {
    aux = this.p1;
    this.p1 = this.p3;
    this.p3 = aux;
  }
  if (this.p2.y > this.p3.y) {
    aux = this.p2;
    this.p2 = this.p3;
    this.p3 = aux;
  }
};

Triangle.prototype.calculateNormal = function() {
  var x = this.p2.x - this.p1.x;
  var y = this.p2.y - this.p1.y;
  var z = this.p2.z - this.p1.z;
  var v21 = new Vector(x, y, z);

  x = this.p3.x - this.p1.x;
  y = this.p3.y - this.p1.y;
  z = this.p3.z - this.p1.z;
  var v31 = new Vector(x, y, z);

  this.normal = v21.crossProduct(v31);
  this.normal.normalize();
};

Triangle.prototype.clone = function() {
  return new Triangle(this.p1, this.p2, this.p3);
}

function isTriangle(p1, p2, p3) {
  return !((p1.x == p2.x && p1.y == p2.y) || (p1.x == p3.x && p1.y == p3.y) || (p2.x == p3.x && p2.y == p3.y));
}