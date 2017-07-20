// Triângulo
function Triangle(p1, p2, p3) {
  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;

  this.normal = new Vector(0, 0, 0);

  this.det = null;
}

// Ordena as vértices do triângulo pelo menor y
Triangle.prototype.sort = function() {
  var aux;

  // Compara o y do ponto 1 e 2
  if (this.p1.y > this.p2.y) {
    // Realiza a troca
    aux = this.p1;
    this.p1 = this.p2;
    this.p2 = aux;
  }

  // Compara o y do ponto 1 e 3
  if (this.p1.y > this.p3.y) {
    // Realiza a troca
    aux = this.p1;
    this.p1 = this.p3;
    this.p3 = aux;
  }

  // Compara o y do ponto 2 e 3
  if (this.p2.y > this.p3.y) {
    // Realiza a troca
    aux = this.p2;
    this.p2 = this.p3;
    this.p3 = aux;
  }
};

// Acha a normal da superfície
Triangle.prototype.calculateNormal = function() {
  // Calcula o vetor que vai de P1 a P2
  var x = this.p2.x - this.p1.x;
  var y = this.p2.y - this.p1.y;
  var z = this.p2.z - this.p1.z;
  var v12 = new Vector(x, y, z);

  // Calcula o vetor que vai de P1 para P3
  x = this.p3.x - this.p1.x;
  y = this.p3.y - this.p1.y;
  z = this.p3.z - this.p1.z;
  var v13 = new Vector(x, y, z);

  this.normal = v12.crossProduct(v13);
  this.normal.normalize();
};

// Pré-processa a determinante da matriz de coeficientes para cálculo das coordenadas baricêntricas
Triangle.prototype.calculateCoefficientsDeterminant = function() {
  this.det = (this.p1.x - this.p3.x) * (this.p2.y - this.p3.y) - (this.p2.x - this.p3.x) * (this.p1.y - this.p3.y);
}

// Encontra as coordenadas baricêntricas para o ponto passado
Triangle.prototype.findBarycenterCoordinates = function(x, y) {
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

  var p1 = this.p1;
  var p2 = this.p2;
  var p3 = this.p3;

  this.det = (this.p1.x - this.p3.x) * (this.p2.y - this.p3.y) - (this.p2.x - this.p3.x) * (this.p1.y - this.p3.y);
  var alpha = ((x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (y - p3.y)) / this.det; // Relação com a substituição de R1
  var beta = ((p1.x - p3.x) * (y - p3.y) - (x - p3.x) * (p1.y - p3.y)) / this.det; // Relação com a substituição de R2

  var barycenterCoordinates = {
    alpha: alpha,
    beta: beta,
    gamma: 1.0 - alpha - beta
  };

  return barycenterCoordinates;
}

// Verifica se os pontos formam um triângulo
Triangle.prototype.isTriangle = function() {
  var p1 = this.p1;
  var p2 = this.p2;
  var p3 = this.p3;

  return !((p1.x == p2.x && p1.y == p2.y) || (p1.x == p3.x && p1.y == p3.y) || (p2.x == p3.x && p2.y == p3.y));
}

// Verifica se o triângulo está totalmente fora da tela
Triangle.prototype.outOfBounds = function() {
  var p1 = this.p1;
  var p2 = this.p2;
  var p3 = this.p3;

  // Verifica as coordenadas X
  if (p1.x < 0 && p2.x < 0 && p3.x < 0) {
    return true;
  }
  if (p1.x > width && p2.x > width && p3.x > width) {
    return true;
  }

  // Verifica as coordenadas Y
  if (p1.y < 0 && p2.y < 0 && p3.y < 0) {
    return true;
  }
  if (p1.y > height && p2.y > height && p3.y > height) {
    return true;
  }

  // Tem alguma parte dentro da tela
  return false;
}

// Clona o triângulo
Triangle.prototype.clone = function() {
  return new Triangle(this.p1, this.p2, this.p3);
}
