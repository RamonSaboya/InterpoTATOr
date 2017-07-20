// Processa um triângulo com o Bresenham Algorithm
function processTriangle(triangle) {
  // Ordena os vértices do triângulo pelo menor Y
  triangle.sort();

  // Variáveis auxilares dos vértices
  var p1 = triangle.p1; // Ponto de menor Y
  var p2 = triangle.p2;
  var p3 = triangle.p3;

  // Rotação dos vértices P2 e P3 em relação a P1
  // Caso que seja igual a 0, significa que P2 e P3 são colineares
  var orient = Math.floor((p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x));

  // Garante que os vértices estejam com a relação correta
  // Auxilia na coêrencia geométrica
  var aux;
  if (orient < 0) {
    // Caso os vértices P2 e P3 já estão foram escolhidos corretamente na ordenação
    // Não é necessário trocar
  }
  else if (orient > 0) {
    // Caso os vértices P2 e P3 não foram escolhidos corretamente
    // Realiza a troca
    aux = p2;
    p2 = p3;
    p3 = aux;
  }
  else if (p2.x < p1.x && p3.x < p1.x) {
    // Caso os vértices P2 e P3 estejam ambos a direita de P1
    // Não é necessário trocar
  }
  else if (p2.x > p1.x && p3.x > p1.x) {
    // Caso os vértices P2 e P3 estejam ambos a esquerda de P1
    // Realiza a troca
    aux = p2;
    p2 = p3;
    p3 = aux;
  }
  else if (p2.x < p3.x) {
    // Caso o vértice P2 seja o vértice de menor X
    // Não é necessário trocar
  }
  else {
    // Caso o vértice P3 seja o vértice de menor X
    // Realiza a troca
    aux = p2;
    p2 = p3;
    p3 = aux;
  }

  // Atualiza as referências do triângulo
  triangle.p1 = p1;
  triangle.p2 = p2;
  triangle.p3 = p3;

  // Verifica se os pontos formam um triângulo
  if (!triangle.isTriangle()) {
    return;
  }

  // Verifica se alguma parte do triângulo está dentro da tela
  if (triangle.outOfBounds()) {
    return;
  }

  triangle.calculateCoefficientsDeterminant();

  var minY = p1.y;
  var maxY = Math.max(p2.y, p3.y);

  // Pixel do vértice superior do triângulo
  var minX = p1.x;
  var maxX = p1.x;

  // Coeficientes angulares das arestas do triângulo
  var angular21 = (p2.y - p1.y) / (p2.x - p1.x); // X mínimo
  var angular31 = (p3.y - p1.y) / (p3.x - p1.x); // X máximo
  var angular32 = (p3.y - p2.y) / (p3.x - p2.x);

  // Define se ainda é necessário alterar o coeficiente do triângulo
  var alternate = true;

  if (Math.abs(p1.y - p2.y) == 0) { // P1 e P2 são colineares
    // Ajusta os limites de X
    minX = Math.min(p1.x, p2.x);
    maxX = Math.max(p1.x, p2.x);

    // Atualiza o coeficiente angular do X mínimo
    angular21 = angular32;

    // Como 2 vértices tem o Y mínimo, nunca será necessário alterar o coeficiente
    alternate = false;
  }
  else if (Math.abs(p1.y - p3.y) == 0) { // P1 e P3 são colineares
    // Ajusta os limites de X
    minX = Math.min(p1.x, p3.x);
    maxX = Math.max(p1.x, p3.x);

    // Atualiza o coeficiente angular do X máximo
    angular31 = angular32;

    // Como 2 vértices tem o Y mínimo, nunca será necessário alterar o coeficiente
    alternate = false;
  }

  // Itera sobre todas as linhas do triângulo
  for (var y = minY; y <= maxY; y++) {
    // Chama o algoritmo de scanline se a linha estiver localizada na tela
    if (y >= 0 && y < height) {
      scanline(y, Math.floor(minX), Math.floor(maxX), triangle);
    }

    // Verifica se é necessário alterar os coeficientes angulares
    if (alternate && (y == p2.y || y == p3.y)) {
      if (Math.abs(y - p2.y) == 0) { // P1 e P2 são colineares
        angular21 = angular32;
      }
      else { // P1 e P3 são colineares
        angular31 = angular32;
      }

      // Só pode haver uma alternação no coeficiente angular
      alternate = false;
    }

    // Caso o coeficiente angular do X mínimo seja válido
    if (angular21 != Infinity && angular21 != -Infinity && angular21 != 0 && !isNaN(angular21)) {
      // Atualiza o X mínimo
      minX += 1 / angular21;
    }

    // Caso o coeficiente angular do X máximo seja válido
    if (angular31 != Infinity && angular31 != -Infinity && angular31 != 0 && !isNaN(angular31)) {
      // Atualiza o X máximo
      maxX += 1 / angular31;
    }
  }
}
