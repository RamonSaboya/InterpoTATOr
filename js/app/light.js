const LIGHT_FILE_ID = "light-file"

var light = null;

var minBB = Infinity;
var maxBB = -Infinity;

var lastLightData = null;

function Light(pl, ka, ia, kd, id1, ks, is, n, axis, id2) {
  this.pl = pl; // Posição da luz no espaço 3D
  this.ka = ka; // Constante da cor ambiental
  this.ia = ia; // Vetor da cor ambiental (RGB)
  this.kd = kd; // Constante de cor difusa
  this.id1 = id1; // Vetor da cor difusa (Intensidade)
  this.ks = ks; // Constante da cor especular
  this.is = is; // Vetor da cor especular (RGB)
  this.n = n; // Constante de rugosidade
  this.axis = axis; // Eixo da interpolação linear
  this.id2 = id2; // Vetor da segunda cor difusa (Intensidade)
}

// Aplica os vetores no modelo de phong para encontrar a cor do ponto
Light.prototype.phong = function(n, v, l, p) {
  var ambient, diffuse, specular, color;
  var lnDot, rvDot;

  // Inicia os vetores de cor
  ambient = this.ia.scalarMultiplication(this.ka); // Componente ambiental
  diffuse = new Vector(0, 0, 0); // Componente difuso
  specular = new Vector(0, 0, 0); // Componente especular

  // Produto escalar do vetor que aponta para a luz e do vetor normal
  // Indica se a luz está incidindo no ponto
  lnDot = l.dotProduct(n);

  // O componente difuso só é aplicado se o ângulo entre os vetores L e N for < 90
  if (lnDot > 0) {
    if (this.axis == null) { // Caso para lidar com apenas um vetor difuso
      diffuse = this.id1.clone();
    }
    else { // Caso para lidar com a interpolação linear de dois vetores difusos
      // Fator da interpolação linear, do eixo utilizado
      var f = (this.getAxis(p) - minBB) / (maxBB - minBB);

      // Faz a interpolação linear dos vetores difusos
      var idX = (1 - f) * this.id1.x + f * this.id2.x;
      var idY = (1 - f) * this.id1.y + f * this.id2.y;
      var idZ = (1 - f) * this.id1.z + f * this.id2.z;

      // Salva no formato de vetor
      diffuse = new Vector(idX, idY, idZ);
    }

    // Multiplica o vetor difuso pela cor da luz
    diffuse.x *= this.is.x;
    diffuse.y *= this.is.y;
    diffuse.z *= this.is.z;

    // Multiplica o componente difuso pela constante e pelo produto escalar de L e N
    // Define a intensidade do componente difuso no ponto
    diffuse = diffuse.scalarMultiplication(this.kd * lnDot);

    // Calcula o vetor R, que é a reflexão da luz no ponto
    var r = n.scalarMultiplication(2 * lnDot).sub(l);
    r.normalize();

    // Produto escalar do vetor que aponta para a camera e o vetor da reflexão
    // Indica se a câmera captura a reflexão da luz no ponto
    rvDot = r.dotProduct(v);

    // O componente especular só é aplicado se o ângulo entre os vetores R e V for < 90
    // Dessa forma, o componente especular só está presente, se o difuso também estiver
    if (rvDot > 0) {
      // Define o realce do componente especular no ponto
      var shininess = Math.pow(rvDot, this.n);

      // Multiplica o componente especular pela constante e pelo realce
      // Define a intensidade do componente especular no ponto
      specular = this.is.scalarMultiplication(this.ks * shininess);
    }
  }

  // Define todos os componentes como inteiros
  ambient.round();
  diffuse.round();
  specular.round();

  // Cor do ponto armazenada no formato de um vetor
  color = new Vector(0, 0, 0);

  // Somas os componentes aplicados no ponto
  color = color.add(ambient);
  color = color.add(diffuse);
  color = color.add(specular);

  // Trunca os componentes RGB da cor em 255
  color.x = Math.min(color.x, 255);
  color.y = Math.min(color.y, 255);
  color.z = Math.min(color.z, 255);

  return color;
};

// Retorna a coordenada do ponto, no eixo utilizado
Light.prototype.getAxis = function(point) {
  if (this.axis == 0) {
    return point.x;
  }
  else if (this.axis == 1) {
    return point.y;
  }
  else {
    return point.z;
  }
}

// Trata o input do arquivo da iluminação
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

// Define o listener do evento de upload de arquivo
document.getElementById(LIGHT_FILE_ID).addEventListener('change', uploadLight, false);

// Processa as linhas do input da iluminação
function processLight(data) {
  if (data == null) {
    return;
  }

  // Salva o input
  lastLightData = data;

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

  // Limpa o campo do arquivo de input
  document.getElementById(LIGHT_FILE_ID).value = "";

  // Atualiza a luz e o objeto
  processObject(lastObjectData);
}

// Veriqua se a iluminação está definida
function isLightReady() {
  return light != null;
}
