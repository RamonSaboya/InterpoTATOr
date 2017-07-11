const CAMERA_FILE_ID = "camera-file"

var camera = null;

function Camera(c, n, v, d, hx, hy) {
  this.c = c;
  this.n = n;
  this.v = v;
  this.d = d;
  this.hx = hx;
  this.hy = hy;
  this.alpha = [];
}
Camera.prototype.genAlpha = function() {
  this.n.normalize();
  
  this.v = this.v.gramSchmidt(this.n);
  this.v.normalize();
  
  var u = this.n.crossProduct(this.v);
  
  this.alpha.push([u.x, u.y, u.z]);
  this.alpha.push([this.v.x, this.v.y, this.v.z]);
  this.alpha.push([this.n.x, this.n.y, this.n.z]);
};
Camera.prototype.changeBase = function(p) {
  p = p.clone();
  
  var s = p.sub(this.c);
  var bp = s.toBase(this.alfa);
  return bp;
};
Camera.prototype.projectPoint = function(p) {
  var x = (this.d / this.hx) * (p.x / p.z);
  var y = (this.d / this.hy) * (p.y / p.z);
  
  var pp = new Point2D(x, y);
  
  var spp = new Ponto2D((pp.x + 1) * width / 2, (1 - pp.y) * height / 2);
  
  // Criar método round point
  spp.x = Math.round(spp.x);
  spp.y = Math.round(spp.y);
  
  spp.normal = p.normal.clone();
  
  return spp;
};

function uploadCamera(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      var data = this.result.split('\n');
      console.log(data);
    };
  })(file);
  reader.readAsText(file);
}

function processCamera(data) {
  camera = null;
  
  var cd = data[0].split(' ');
  var nd = data[1].split(' ');
  var vd = data[2].split(' ');
  var od = data[3].split(' ');
  
  var c = new Point3D(cd[0], cd[1], cd[2]);
  var n = new Vector(nd[0], nd[1], nd[2]);
  var v = new Vector[vd[0], vd[1], vd[2]];
  var d = od[0];
  var hx = od[1];
  var hy = od[2];
  
  camera = new Camera(c, n, v, d, hx, hy);
}

function isCameraReady() {
  return camera != null;
}