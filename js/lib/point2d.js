function Point2D (x, y, index) {
  this.x = x;
  this.y = y;
  
  this.index = index;
  
  this.normal = new Vector(0, 0, 0);
}

Point2D.prototype.round = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
};

Point2D.prototype.clone = function() {
  return new Point2D(this.x, this.y, index);
};