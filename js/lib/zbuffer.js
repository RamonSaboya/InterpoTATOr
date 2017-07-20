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
  if (!isTriangle(p1, p2, p3)) {
    return;
  }

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
    // Chama o algoritmo de scanline
    scanline(y, Math.floor(minX), Math.floor(maxX), p1, p2, p3);

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

// Processa uma linha com o algoritmo de scanline
function scanline(y, minX, maxX, p1, p2, p3) {
  for (var x = minX; x <= maxX; x++) {
    // Caso o pixel esteja fora dos limites da tela
    if (x < 0 || y < 0 || x >= width || y >= height) {
      continue;
    }

    // Coordenadas baricêntricas do ponto em relação ao triângulo
    var barycenter = findBarycenterCoordinates(x, y, p1, p2, p3);

    // Vértices em coordenadas da câmera
    var p13D = points3D[p1.index];
    var p23D = points3D[p2.index];
    var p33D = points3D[p3.index];

    // Encontra o pixel que será pintado na tela
    var px = p13D.x * barycenter.alpha + p23D.x * barycenter.beta + p33D.x * barycenter.gamma;
    var py = p13D.y * barycenter.alpha + p23D.y * barycenter.beta + p33D.y * barycenter.gamma;
    var pz = p13D.z * barycenter.alpha + p23D.z * barycenter.beta + p33D.z * barycenter.gamma;
    var p = new Point3D(px, py, pz);

    var n, v, l, color;

    // Processa o pixel no array do zBuffer
    // Apenas considera o ponto, caso se Z seja menor que o atual conhecido para o X e Y
    if (p.z < zBuffer[y][x]) {
      // Atualiza o Z para o X e Y
      zBuffer[y][x] = p.z;

      // Encontra o vetor N para o ponto
      var nx = p13D.normal.x * barycenter.alpha + p23D.normal.x * barycenter.beta + p33D.normal.x * barycenter.gamma;
      var ny = p13D.normal.y * barycenter.alpha + p23D.normal.y * barycenter.beta + p33D.normal.y * barycenter.gamma;
      var nz = p13D.normal.z * barycenter.alpha + p23D.normal.z * barycenter.beta + p33D.normal.z * barycenter.gamma;
      n = new Vector(nx, ny, nz); // Vetor normal do ponto
      v = p.toVector().scalarMultiplication(-1); // Calcula o vetor que aponta do ponto para a câmera
      l = light.pl.sub(p).toVector(); // Calcula o vetor que aponta do ponto para a luz

      // Normaliza os vetores
      n.normalize();
      v.normalize();
      l.normalize();

      // Caso a normal esteja apontado para o lado oposto, inverte a mesma
      if (v.dotProduct(n) < 0) {
        n = n.scalarMultiplication(-1);
      }

      // Aplica os vetores no Phong Reflection Model
      color = light.phong(n, v, l, p);

      // Pinta o pixel na tela
      // Como 2 vértices tem o Y mínimo, nunca será necessário alterar o coeficiente
      paint(x, y, color);
    }
  }
}
