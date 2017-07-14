const LIGHT_FILE_ID = "light-file"

var light = null;

function Light(pl, ka, ia, kd, od1, ks, il, n, ex, od2) {
  this.pl = pl;
  this.ka = ka;
  this.ia = ia;
  this.kd = kd;
  this.od1 = od1;
  this.ks = ks;
  this.il = il;
  this.n = n;
  this.ex = ex;
  this.od2 = od2;
}

Light.prototype.color = function(l, n, v, r, p, x, y) {
  var a;
  
  var color = this.ia.scalarProduct(this.ka);

  if(n != null) {
    var nl = n.dotProduct(l);
    
    a = new Vector(this.od.x * this.il.x, this.od.y * this.il.y, this.od.z * this.il.z);
    a = a.scalarProduct(this.kd * nl);

    color = color.add(a);
  }
  
  if(r != null) {
    var rv = r.dotProduct(v);
    
    var aux = rv;
    for (var c = 0; c < this.n; c++) {
      rv *= aux;
    }
    
    a = this.il.scalarProduct(this.ks * rv);
    
    color = color.add(a);
  }
  
  color.x = Math.round(color.x);
  color.y = Math.round(color.y);
  color.z = Math.round(color.z);
  
  color.x = Math.min(color.x, 255);
  color.y = Math.min(color.y, 255);
  color.z = Math.min(color.z, 255);
  
  return color;
};

function uploadLight(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      var data = this.result.split('\n');
      
      if(!isCameraReady()) {
        alert("Você precisa escolher a camera.");
        document.getElementById(LIGHT_FILE_ID).value = "";
        
        return;
      }
      
      processLight(data);
    };
  })(file);
  reader.readAsText(file);
}

document.getElementById(LIGHT_FILE_ID).addEventListener('change', uploadLight, false);

function processLight(data) {
  light = null;
  
  var pld = data[0].split(' ');
  var iad = data[2].split(' ');
  var od1d = data[4].split(' ');
  var ild = data[6].split(' ');
  
  var pl = new Point3D(pld[0], pld[1], pld[2]);
  var ka = data[1];
  var ia = new Vector(iad[0], iad[1], iad[2]);
  var kd = data[3];
  var od1 = new Vector(od1d[0], od1d[1], od1d[2]);
  var ks = data[5];
  var il = new Vector(ild[0], ild[1], ild[2]);
  var n = data[7];
  var ex = null;
  var od2 = null;
  
  if(data.length > 8) {
    ex = data[8];
    
    var od2d = data[9].split(' ');
    od2 = new Vector(od2d[0], od2d[1], od2d[2]);
  }
  
  light = new Light(pl, ka, ia, kd, od1, ks, il, n, ex, od2);
  
  light.pl = light.pl.changeBase(camera);
}

function isLightReady() {
  return light != null;
}