// Processa uma linha com o algoritmo de scanline
function scanline(y, minX, maxX, triangle) {
  // Variáveis auxiliares
  var p1 = triangle.p1;
  var p2 = triangle.p2;
  var p3 = triangle.p3;

  // Vértices em coordenadas da câmera
  var p13D = points3D[p1.index];
  var p23D = points3D[p2.index];
  var p33D = points3D[p3.index];

  for (var x = Math.max(minX, 0); x <= Math.min(maxX, width - 1); x++) {
    // Coordenadas baricêntricas do ponto em relação ao triângulo
    var barycenterCoordinates = triangle.findBarycenterCoordinates(x, y);

    // Encontra o pixel que será pintado na tela
    var pl = getPointFromBarycenterCoordinates(p13D, p23D, p33D, barycenterCoordinates);

    var n, v, l, color;

    // Processa o pixel no array do zBuffer
    // Apenas considera o ponto, caso se Z seja menor que o atual conhecido para o X e Y
    if (pl.z < zBuffer[y][x]) {
      // Atualiza o Z para o X e Y
      zBuffer[y][x] = pl.z;

      n = getVectorFromBarycenterCoordinates(p13D, p23D, p33D, barycenterCoordinates); // Vetor normal do ponto
      v = pl.toVector().scalarMultiplication(-1); // Calcula o vetor que aponta do ponto para a câmera
      l = light.pl.sub(pl).toVector(); // Calcula o vetor que aponta do ponto para a luz

      // Normaliza os vetores
      n.normalize();
      v.normalize();
      l.normalize();

      // Caso a normal esteja apontado para o lado oposto, inverte a mesma
      if (v.dotProduct(n) < 0) {
        n = n.scalarMultiplication(-1);
      }

      // Aplica os vetores no Phong Reflection Model
      color = phongReflectionModel(n, v, l, pl);

      // Pinta o pixel na tela
      // Como 2 vértices tem o Y mínimo, nunca será necessário alterar o coeficiente
      paint(x, y, color);
    }
  }
}
