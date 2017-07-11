/* global Vector */

function Point2D (x, y) {
  this.x = x;
  this.y = y;
  this.normal = new Vector(0, 0, 0);
}

Point2D.prototype.round = function() {
  var x = Math.round(this.x);
  var y = Math.round(this.y);
  
  return new Point2D(x, y);
};

Point2D.prototype.clone = function() {
  return new Point2D(this.x, this.y);
};