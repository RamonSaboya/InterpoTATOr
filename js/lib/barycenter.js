// Coordenadas baricêntricas de um ponto em relação a um triângulo
function BarycenterCoordinates(alpha, beta, gamma) {
  this.alpha = alpha;
  this.beta = beta;
  this.gamma = gamma;
}

// Encontra as coordenadas baricêntricas de um ponto em relação a um triângulo
function findBarycenterCoordinates(x, y, p1, p2, p3) {
  /* Encontra as coordenadas baricêntricas, desenvolvendo o seguinte cálculo:
    X = alfa * X1 + beta * X2 + gama * X3
    Y = alfa * Y1 + beta * Y2 + gama * Y3
    
    Como temos que alfa + beta + gama = 1, podemos
    X = alfa * X1 + beta * X2 + (1 - alfa - gama) * X3
    Y = alfa * Y1 + beta * Y2 + (1 - alfa - gama) * Y3
    
    Organizando
    X = alfa * (X1 - X3) + beta * (X2 - X3) + X3
    Y = alfa * (Y1 - Y3) + beta * (Y2 - Y3) + Y3
    
    Dessa forma, com R sendo a coordenada (X, Y)
    | alfa || (X1 - X3) (X2 - X3) | = R - R3
    | beta || (Y1 - Y3) (Y2 - Y3) |
    
    Assim, é possível achar o alfa e beta fazendo uma relação das determinantes das matrizes
  */

  // Determinante da matriz
  var denom = (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);

  var alpha = ((x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (y - p3.y)) / denom; // Relação com a substituição de R1
  var beta = ((p1.x - p3.x) * (y - p3.y) - (x - p3.x) * (p1.y - p3.y)) / denom; // Relação com a substituição de R2
  var gamma = 1.0 - alpha - beta;

  return new BarycenterCoordinates(alpha, beta, gamma);
}
