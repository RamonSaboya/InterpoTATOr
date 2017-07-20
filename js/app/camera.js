const CAMERA_FILE_ID = "camera-file";

var camera = null;

var lastCameraData = null;

function Camera(c, n, v, d, hx, hy) {
  this.c = c; // Ponto da câmera no espaço 3D
  this.n = n; // Vetor da direção da câmera
  this.v = v; // Vetor da rotação da câmera
  this.d = d; // d
  this.hx = hx; // hx
  this.hy = hy; // hy

  this.alpha = []; // Matriz de transformação
}

// Gera a matriz de transformação
Camera.prototype.genAlpha = function() {
  this.n.normalize();

  this.v = this.v.gramSchmidt(this.n);
  this.v.normalize();

  // Vetor ortognal a V e N
  var u = this.n.crossProduct(this.v);

  this.alpha.push([u.x, u.y, u.z]);
  this.alpha.push([this.v.x, this.v.y, this.v.z]);
  this.alpha.push([this.n.x, this.n.y, this.n.z]);
};

// Trata o input do arquivo da câmera
function uploadCamera(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      // Divide o input pelas linhas
      var data = this.result.split('\n');

      processCamera(data);
    };
  })(file);
  reader.readAsText(file);
}

// Define o listener do evento de upload de arquivo
document.getElementById(CAMERA_FILE_ID).addEventListener('change', uploadCamera, false);

// Processa as linhas do input da câmera
function processCamera(data) {
  if (data == null) {
    return;
  }

  // Salva o input
  lastCameraData = data;

  camera = null;

  // Divide as linhas por espaço
  var cd = data[0].split(' ');
  var nd = data[1].split(' ');
  var vd = data[2].split(' ');
  var od = data[3].split(' ');

  var c = new Point3D(cd[0], cd[1], cd[2]);
  var n = new Vector(nd[0], nd[1], nd[2]);
  var v = new Vector(vd[0], vd[1], vd[2]);
  var d = od[0];
  var hx = od[1];
  var hy = od[2];

  camera = new Camera(c, n, v, d, hx, hy);

  // Gera a matriz de transformação
  camera.genAlpha();

  // Limpa o campo do arquivo de input
  document.getElementById(CAMERA_FILE_ID).value = "";

  // Atualiza a luz e o objeto
  processLight(lastLightData);
}

// Veriqua se a camera está definida
function isCameraReady() {
  return camera != null;
}
