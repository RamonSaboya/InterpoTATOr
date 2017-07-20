// Altura e largura do canvas
var width = document.getElementById('stage').offsetWidth;
var height = document.getElementById('stage').offsetHeight;

// Objeto do canvas
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Define a função de load e redimensionamento do canvas
// Atualiza o tamanho do canvas e re-processa as entradas
window.onresize = window.onload = function(event) {
  // Altura e largura do canvas
  width = document.getElementById('stage').offsetWidth;
  height = document.getElementById('stage').offsetHeight;

  // Atualiza o elemento HTML
  document.getElementById('canvas').width = width;
  document.getElementById('canvas').height = height;

  // Re-processa as entradas
  processCamera(lastCameraData);
};

// Pontos que serão desenhados na tela
var zBuffer;

// Triângulos compostos por pontos projetados na tela
var triangles2D = [];

// Desenha o objeto na tela
function draw() {
  // Limpa o canvas
  ctx.clearRect(0, 0, width, height);

  // Itera sobre todos os triângulos da tela
  for (var c = 0; c < triangles2D.length; c++) {
    var triangle = triangles2D[c];

    // Processa cada triângulo
    processTriangle(triangle);
  }
}

// Pinta um pixel na tela com uma cor
function paint(x, y, color) {
  ctx.fillStyle = "rgb(" + color.x + ", " + color.y + ", " + color.z + ")";
  ctx.fillRect(x, y, 1, 1);
}
