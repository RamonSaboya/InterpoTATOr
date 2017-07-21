const CAMERA_FILE_ID = "camera-file";
const CAMERA_LABEL_ID = "camera-label";

var camera = null;

var lastCameraData = null;
var cameraFileName = LABEL_TEXT;

// Trata o input do arquivo da câmera
function uploadCamera(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      // Divide o input pelas linhas
      var data = this.result.split('\n');

      cameraFileName = file.name;

      processCamera(data);
    };
  })(file);
  reader.readAsText(file);
}

// Define o listener do evento de upload de arquivo
setChangeListener(CAMERA_FILE_ID, uploadCamera);

// Processa as linhas do input da câmera
function processCamera(data) {
  // Limpa o camp de input do arquivo
  clearFileInput(CAMERA_FILE_ID);

  // Define o nome do arquivo no elemento HTML
  setLabelDivText(CAMERA_LABEL_ID, cameraFileName);

  if (data == null) {
    return;
  }

  // Define a função de hover do botão
  setHoverBoxShadow(CAMERA_LABEL_ID, GREEN);

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

  // Atualiza a luz e o objeto
  processLight(lastLightData);
}

// Veriqua se a camera está definida
function isCameraReady() {
  return camera != null;
}
