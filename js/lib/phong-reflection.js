// Aplica os vetores no modelo de phong para encontrar a cor do pixel
function phongReflectionModel(n, v, l, p) {
  var ambient, diffuse, specular, color;
  var lnDot, rvDot;

  // Inicia os vetores dos componentes
  ambient = light.ia.scalarMultiplication(light.ka); // Componente ambiental
  diffuse = new Vector(0, 0, 0); // Componente difuso
  specular = new Vector(0, 0, 0); // Componente especular

  // Produto escalar do vetor que aponta para a luz e do vetor normal
  // Indica se a luz está incidindo no pixel
  lnDot = l.dotProduct(n);

  // O componente difuso só é aplicado se o ângulo entre os vetores L e N for < 90
  if (lnDot > 0) {
    if (light.axis == null) { // Caso para lidar com apenas um vetor difuso
      diffuse = light.id1.clone();
    }
    else { // Caso para lidar com a interpolação linear de dois vetores difusos
      // Fator da interpolação linear, do eixo utilizado
      var f = (light.getAxis(p) - minBB) / (maxBB - minBB);

      // Faz a interpolação linear dos vetores difusos
      var idX = (1 - f) * light.id1.x + f * light.id2.x;
      var idY = (1 - f) * light.id1.y + f * light.id2.y;
      var idZ = (1 - f) * light.id1.z + f * light.id2.z;

      // Salva no formato de vetor
      diffuse = new Vector(idX, idY, idZ);
    }

    // Multiplica o vetor difuso pela cor da luz
    diffuse.x *= light.is.x;
    diffuse.y *= light.is.y;
    diffuse.z *= light.is.z;

    // Multiplica o componente difuso pela constante e pelo produto escalar de L e N
    // Define a intensidade do componente difuso no pixel
    diffuse = diffuse.scalarMultiplication(light.kd * lnDot);

    // Calcula o vetor R, que é a reflexão da luz no pixel
    var r = n.scalarMultiplication(2 * lnDot).sub(l);
    r.normalize();

    // Produto escalar do vetor que aponta para a camera e o vetor da reflexão
    // Indica se a câmera captura a reflexão da luz no pixel
    rvDot = r.dotProduct(v);

    // O componente especular só é aplicado se o ângulo entre os vetores R e V for < 90
    // Dessa forma, o componente especular só está presente, se o difuso também estiver
    if (rvDot > 0) {
      // Define o realce do componente especular no pixel
      var shininess = Math.pow(rvDot, light.n);

      // Multiplica o componente especular pela constante e pelo realce
      // Define a intensidade do componente especular no pixel
      specular = light.is.scalarMultiplication(light.ks * shininess);
    }
  }

  // Somas os componentes aplicados no pixel
  var red = ambient.x + diffuse.x + specular.x;
  var green = ambient.y + diffuse.y + specular.y;
  var blue = ambient.z + diffuse.z + specular.z;

  // Cor do pixel
  color = new Color(red, green, blue);

  return color;
}
