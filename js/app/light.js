const LIGHT_FILE_ID = "light-file"

var light = null;

var minBB = Infinity;
var maxBB = -Infinity;

var lastLightData = null;

function Light(pl, ka, ia, kd, id1, ks, is, n, axis, id2) {
  this.pl = pl;
  this.ka = ka;
  this.ia = ia;
  this.kd = kd;
  this.id1 = id1;
  this.ks = ks;
  this.is = is;
  this.n = n;
  this.axis = axis;
  this.id2 = id2;
}

Light.prototype.phong = function(n, v, l, p, x, y) {
  var ambient, diffuse, specular, color;
  var lnDot, rvDot;
  
  lnDot = l.dotProduct(n);
  
  ambient = this.ia.scalarProduct(this.ka);
  diffuse = new Vector(0, 0, 0);
  specular = new Vector(0, 0, 0);
  
  if(lnDot > 0) {
    if(this.axis == null) {
      diffuse = this.id1.clone();
    } else {
      var f = (this.getAxis(p) - minBB) / (maxBB - minBB);
      
      var idX = (1 - f) * this.id1.x + f * this.id2.x;
      var idY = (1 - f) * this.id1.y + f * this.id2.y;
      var idZ = (1 - f) * this.id1.z + f * this.id2.z;
      
      diffuse = new Vector(idX, idY, idZ);
    }
    
    diffuse = diffuse.scalarProduct(this.kd * lnDot);
    
    var r = n.scalarProduct(2 * lnDot).sub(l);
    r.normalize();
    
    rvDot = r.dotProduct(v);

    if(rvDot > 0) {
      specular = this.is.scalarProduct(this.ks * Math.pow(rvDot, this.n));
    }
  }
  
  ambient.round();
  diffuse.round();
  specular.round();
  
  color = new Vector(0, 0, 0);
  
  color = color.add(ambient);
  color = color.add(diffuse);
  color = color.add(specular);
  
  color.x = Math.min(color.x, 255);
  color.y = Math.min(color.y, 255);
  color.z = Math.min(color.z, 255);
  
  return color;
};

Light.prototype.getAxis = function(point) {
  if(this.axis == 0) {
    return point.x;
  } else if(this.axis == 1) {
    return point.y;
  } else {
    return point.z;
  }
}

function uploadLight(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      var data = this.result.split('\n');
      
      processLight(data);
    };
  })(file);
  reader.readAsText(file);
}

document.getElementById(LIGHT_FILE_ID).addEventListener('change', uploadLight, false);

function processLight(data) {
  if(data == null) {
    return;
  }
  
  lastLightData = data;
  
  light = null;

  minBB = Infinity;
  maxBB = -Infinity;
  
  var pld = data[0].split(' ');
  var iad = data[2].split(' ');
  var id1d = data[4].split(' ');
  var isd = data[6].split(' ');
  
  var pl = new Point3D(pld[0], pld[1], pld[2]);
  var ka = data[1];
  var ia = new Vector(iad[0], iad[1], iad[2]);
  var kd = data[3];
  var id1 = new Vector(id1d[0], id1d[1], id1d[2]);
  var ks = data[5];
  var is = new Vector(isd[0], isd[1], isd[2]);
  var n = data[7];
  var axis = null;
  var id2 = null;
  
  if(data.length > 9) {
    axis = data[8];
    
    var id2d = data[9].split(' ');
    id2 = new Vector(id2d[0], id2d[1], id2d[2]);
  }
  
  light = new Light(pl, ka, ia, kd, id1, ks, is, n, axis, id2);
  
  light.pl = light.pl.changeBase(camera);
  
  document.getElementById(LIGHT_FILE_ID).value = "";
  
  processObject(lastObjectData);
}

function isLightReady() {
  return light != null;
}