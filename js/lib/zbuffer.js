function processTriangle(triangle, index) {
  triangle.sort();
  
  var p1 = triangle.p1;
  var p2 = triangle.p2;
  var p3 = triangle.p3;
  
  var orient = Math.floor((p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x));
  var aux;
  
  if(orient < 0) {
  } else if(orient > 0) {
    aux = p2;
    p2 = p3;
    p3 = aux;
  } else if(p2.x < p1.x && p3.x < p1.x) {
  } else if(p2.x > p1.x && p3.x > p1.x) {
    aux = p2;
    p2 = p3;
    p3 = aux;
  } else if(p2.x < p3.x) {
  } else {
    aux = p2;
    p2 = p3;
    p3 = aux;
  }
  
  triangle.p1 = p1;
  triangle.p2 = p2;
  triangle.p3 = p3;
  
  if(!isTriangle(p1, p2, p3)) {
    return;
  }
  
  if(outOfBounds(p1, p2, p3)) {
    return;
  }
  
  var minY = p1.y;
  var maxY = Math.max(p2.y, p3.y);
  
  var minX = p1.x;
  var maxX = p1.x;
  
  var angular21 = (p2.y - p1.y) / (p2.x - p1.x);
  var angular31 = (p3.y - p1.y) / (p3.x - p1.x);
  var angular32 = (p3.y - p2.y) / (p3.x - p2.x);
  
  var alternate = true;
  
  if(Math.abs(p1.y - p2.y) == 0) {
    minX = Math.min(p1.x, p2.x);
    maxX = Math.max(p1.x, p2.x);
    
    angular21 = angular32;
    
    alternate = false;
  } else if(Math.abs(p1.y - p3.y) == 0) {
    minX = Math.min(p1.x, p3.x);
    maxX = Math.max(p1.x, p3.x);
    
    angular31 = angular32;
    
    alternate = false;
  }
  
  for(var y = Math.max(minY, 0); y <= Math.min(maxY, height - 1); y++) {
    scanline(y, Math.max(Math.floor(minX), 0), Math.min(Math.floor(maxX), width - 1), p1, p2, p3, index);
    
    if(alternate && (y == p2.y || y == p3.y)) {
      if(Math.abs(y - p2.y) == 0) {
        angular21 = angular32;
      } else {
        angular31 = angular32;
      }
      
      alternate = false;
    }
    
    if(angular21 != Infinity && angular21 != -Infinity && angular21 != 0 && !isNaN(angular21)) {
      minX +=  1 / angular21;
    }
    
    if(angular31 != Infinity && angular31 != -Infinity && angular31 != 0 && !isNaN(angular31)) {
      maxX +=  1 / angular31;
    }
  }
}

function scanline(y, minX, maxX, p1, p2, p3) {
  for(var x = minX; x <= maxX; x++) {
    var barycenter = findBarycenter(x, y, p1, p2, p3);
    
    var p13D = points[p1.index];
    var p23D = points[p2.index];
    var p33D = points[p3.index];
    
    var px = p13D.x * barycenter.alpha + p23D.x * barycenter.beta + p33D.x * barycenter.gamma;
    var py = p13D.y * barycenter.alpha + p23D.y * barycenter.beta + p33D.y * barycenter.gamma;
    var pz = p13D.z * barycenter.alpha + p23D.z * barycenter.beta + p33D.z * barycenter.gamma;
    
    var p = new Point3D(px, py, pz);
    
    var n, v, l, r, color;
    
    color = new Vector(0, 0, 0);
  
    if(p.z < zBuffer[y][x]) {
      zBuffer[y][x] = p.z;
      
      var nx = p13D.normal.x * barycenter.alpha + p23D.normal.x * barycenter.beta + p33D.normal.x * barycenter.gamma;
      var ny = p13D.normal.y * barycenter.alpha + p23D.normal.y * barycenter.beta + p33D.normal.y * barycenter.gamma;
      var nz = p13D.normal.z * barycenter.alpha + p23D.normal.z * barycenter.beta + p33D.normal.z * barycenter.gamma;
      
      n = new Vector(nx, ny, nz);
      v = p.toVector().scalarProduct(-1);
      l = ambient.pl.sub(p).toVector();
      
      n.normalize();
      v.normalize();
      l.normalize();
      
      if(v.dotProduct(n) < 0) {
        n = n.scalarProduct(-1);
      }
      
      var colores;
      if (barycenter.dist <= 0.2) {
        colores = new Vector(0.8, 0.1, 0.1);
      } else if (barycenter.dist > 0.2 && barycenter.dist <= 0.4) {
        colores = new Vector(0.1, 0.8, 0.1);
      } else {
        colores = new Vector(0.1, 0.1, 0.8);
      }
      
      if(n.dotProduct(l) < 0) {
       color = ambient.color(l, null, v, null, p, colores);
      } else {
        r = n.scalarProduct(2 * n.dotProduct(l)).sub(l);
        
        if(r.dotProduct(v) < 0) {
         color = ambient.color(l, n, v, null, p, colores);
        } else {
          color = ambient.color(l, n, v, r, p, colores);
        }
      }
  
      paint(x, y, color);
    }
  }
}

