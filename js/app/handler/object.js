const OBJECT_FILE_ID = "object-file";
const OBJECT_LABEL_ID = "object-label";

var points3D = [];

var pointsAmount = 0;
var trianglesAmount = 0;

var lastObjectData = null;
var objectFileName = LABEL_TEXT;

// Trata o input do arquivo do objeto
function uploadObject(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      // Divide o input pelas linhas
      var data = this.result.split('\n');

      objectFileName = file.name;

      processObject(data);
    };
  })(file);
  reader.readAsText(file);
}

// Define o listener do evento de upload de arquivo
setChangeListener(OBJECT_FILE_ID, uploadObject);

// Processa as linhas do input do objeto
function processObject(data) {
  // Limpa o camp de input do arquivo
  clearFileInput(OBJECT_FILE_ID);

  // Define o nome do arquivo no elemento HTML
  setLabelDivText(OBJECT_LABEL_ID, objectFileName);

  if (data == null) {
    return;
  }

  // Define a função de hover do botão
  setHoverBoxShadow(OBJECT_LABEL_ID, GREEN);

  // Salva o input
  lastObjectData = data;

  // Não precisa continuar se a iluminação não estiver definida
  if (!isLightReady()) {
    if (lastLightData == null) {
      setHoverBoxShadow(LIGHT_LABEL_ID, RED);
    }

    return;
  }

  // Não precisa continuar se a câmera não estiver definida
  if (!isCameraReady()) {
    if (lastCameraData == null) {
      setHoverBoxShadow(CAMERA_LABEL_ID, RED);
    }

    return;
  }

  points3D = [];
  triangles2D = [];

  // Define a quantidade de pontos e triangulos
  var amounts = data[0].split(' ');
  pointsAmount = Number(amounts[0]);
  trianglesAmount = Number(amounts[1]);

  // Triangulos no formato de um array de tamanho 3, com index dos pontos
  var triangles = [];

  // Pontos projetados na tela
  var points2D = [];

  // Processa os pontos do objeto
  for (var c = 0; c < pointsAmount; c++) {
    var pointData = data[c + 1].split(' ');
    var point = new Point3D(pointData[0], pointData[1], pointData[2]);

    // Coloca o ponto nas coordenadas da câmera
    point = point.changeBase(camera);

    // Caso tenha sido um definido um eixo para interpolação linear dos vetores difuso
    // Atualizar a Bounding Box do objeto (apenas no eixo escolhido)
    if (light.axis != null) {
      minBB = Math.min(minBB, light.getAxis(point)); // Ponto mínimo
      maxBB = Math.max(maxBB, light.getAxis(point)); // Ponto máximo
    }

    // Salva o ponto
    points3D.push(point);
  }

  // Processa os triângulos do objeto
  for (var c = 0; c < trianglesAmount; c++) {
    var triangleData = data[c + pointsAmount + 1].split(' ');
    var triangleRef = [triangleData[0] - 1, triangleData[1] - 1, triangleData[2] - 1];

    // Salva a referência dos pontos
    triangles.push(triangleRef);

    // Vértices do triângulo
    var p1 = points3D[triangles[c][0]];
    var p2 = points3D[triangles[c][1]];
    var p3 = points3D[triangles[c][2]];

    var triangle = new Triangle3D(p1, p2, p3);
    triangle.calculateNormal();

    // Soma a normal do triângulo na normal dos pontos (iniciada com 0, 0, 0)
    p1.normal = p1.normal.add(triangle.normal);
    p2.normal = p2.normal.add(triangle.normal);
    p3.normal = p3.normal.add(triangle.normal);
  }

  for (var c = 0; c < points3D.length; c++) {
    // Normaliza a normal de todos os pontos
    points3D[c].normal.normalize();

    // Projeta os pontos na tela
    points2D.push(points3D[c].projectPoint(camera, c));
  }

  // Salva todos os triângulos dos pontos projetados na tela
  for (var c = 0; c < triangles.length; c++) {
    var p1 = points2D[triangles[c][0]];
    var p2 = points2D[triangles[c][1]];
    var p3 = points2D[triangles[c][2]];

    triangles2D.push(new Triangle2D(p1, p2, p3));
  }

  // Se a luz e camera estiverem definidas, desenha o objeto
  if (isCameraReady() && isLightReady()) {
    draw();
  }
}

// Veriqua se a camera está definida
function isObjectReady() {
  if (pointsAmount == 0 || trianglesAmount == 0) {
    return false;
  }

  // Verifica se a quantidade de pontos e de triângulos bate com os da entrada
  return points3D.length == pointsAmount && triangles.length == trianglesAmount;
}
