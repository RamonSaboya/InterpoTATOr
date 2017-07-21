const LIGHT_FILE_ID = "light-file";
const LIGHT_LABEL_ID = "light-label";

var light = null;

var minBB = Infinity;
var maxBB = -Infinity;

var lastLightData = null;
var lightFileName = LABEL_TEXT;

// Trata o input do arquivo da iluminação
function uploadLight(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      var data = this.result.split('\n');

      lightFileName = file.name;

      processLight(data);
    };
  })(file);
  reader.readAsText(file);
}

// Define o listener do evento de upload de arquivo
setChangeListener(LIGHT_FILE_ID, uploadLight);

// Processa as linhas do input da iluminação
function processLight(data) {
  // Limpa o camp de input do arquivo
  clearFileInput(LIGHT_FILE_ID);

  // Define o nome do arquivo no elemento HTML
  setLabelDivText(LIGHT_LABEL_ID, lightFileName);

  if (data == null) {
    return;
  }

  // Define a função de hover do botão
  setHoverBoxShadow(LIGHT_LABEL_ID, GREEN);

  // Salva o input
  lastLightData = data;

  // Não precisa continuar se a câmera não estiver definida
  if (!isCameraReady()) {
    if (lastCameraData == null) {
      setHoverBoxShadow(CAMERA_LABEL_ID, RED);
    }

    return;
  }

  light = null;

  minBB = Infinity;
  maxBB = -Infinity;

  // Divide as linhas por espaço
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

  if (data.length > 9) {
    axis = data[8];

    var id2d = data[9].split(' ');
    id2 = new Vector(id2d[0], id2d[1], id2d[2]);
  }

  light = new Light(pl, ka, ia, kd, id1, ks, is, n, axis, id2);

  // Muda a base da luz para a base da câmera
  light.pl = light.pl.changeBase(camera);

  // Atualiza a luz e o objeto
  processObject(lastObjectData);
}

// Veriqua se a iluminação está definida
function isLightReady() {
  return light != null;
}
