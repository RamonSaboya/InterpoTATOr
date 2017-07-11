/* global Vector */
/* global Point3D */

/* global camera */

const LIGHT_FILE_ID = "light-file"

var light = null;

function Light(pl, ka, ia, kd, od, ks, il, n) {
  this.pl = pl;
  this.originalPl = pl;
  this.ka = ka;
  this.ia = ia;
  this.kd = kd;
  this.od = od;
  this.ks = ks;
  this.il = il;
  this.n = n;
}

Light.prototype.getCor = function(L, N, V, R, p) {
  var a;
  var l = this.ia.clone();
  l = l.multiplicar(this.ka); // Ia * Ka
  if(N != null) {
    var pe_nl = N.produtoEscalar(L); // <N, L>
    a = new Vector(this.od.x*this.il.x, this.od.y*this.il.y, this.od.z*this.il.z); // ISSO É O CORRETO

    a = a.multiplicar(this.kd*pe_nl); //ISSO É O CORRETO

    l = new Vector(l.x+a.x, l.y+a.y, l.z+a.z); //ISSO É O CERTO
  }
  if(R != null) {
    var pe_rv = R.produtoEscalar(V); // <R, V>
    var aux = pe_rv;
    for (var i = 0; i < this.n; i++) pe_rv *= aux; // n é a cte de rugosidade | <R, V> ^n
    a = this.il.clone(); // vetor Il
    a = a.multiplicar(this.ks*pe_rv); // Ks * <R, V>^n * Il
    l = l.add(a); // l + Ks * <R, V>^n * Il
  }
  l.x = Math.round(l.x);
  l.y = Math.round(l.y);
  l.z = Math.round(l.z);
  l.x = Math.min(l.x,255);
  l.y = Math.min(l.y,255);
  l.z = Math.min(l.z,255);
  return l;
};

function uploadLight(event) {
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

function processLight(data) {
  light = null;
  
  var pld = data[0].split(' ');
  var iad = data[2].split(' ');
  var odd = data[4].split(' ');
  var ild = data[6].split(' ');
  
  var pl = new Point3D(pld[0], pld[1], pld[2]);
  var ka = data[1];
  var ia = new Vector(iad[0], iad[1], iad[2]);
  var kd = data[3];
  var od = new Vector[odd[0], odd[1], odd[2]];
  var ks = data[4];
  var il = new Vector[ild[0], ild[1], ild[2]];
  var n = data[7];
  
  light = new Light(pl, ka, ia, kd, od, ks, il, n);
  
  light.pl = light.pl.projectPoint(camera);
}

function isLightReady() {
  return light != null;
}