// Luz
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
