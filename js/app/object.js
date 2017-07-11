const OBJECT_FILE_ID = "object-file"

var points = [];
var triangles = [];

var pointsAmount = 0;
var trianglesAmount = 0;

function uploadObject(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      var data = this.result.split('\n');
      
      if(!isCameraReady()) {
        alert("Você precisa escolher a câmera.");
        
        return;
      }
      
      processObject(data);
    };
  })(file);
  reader.readAsText(file);
}

function processObject(data) {
  points = [];
  triangles = [];

  var amounts = data[0].split(' ');
  
  pointsAmount = amounts[0];
  trianglesAmount = amounts[1];
  
  var points2D = [];

  for(var c = 0; c < pointsAmount; c++) {
    var pointData = data[c + 1].split(' ');
    var point = new Point3D(pointData[0], pointData[1], pointData[2]);
    
    point = point.changeBase(camera);
    
    points.push(point);
  }

  for(var c = 0; c < trianglesAmount; c++) {
    var triangleData = data[c + pointsAmount + 1].split(' ');
    var triangleRef = [pointData[0] - 1, pointData[1] - 1, pointData[2] - 1];
    
    triangles.push(triangleRef);
    
    var p1 = points[triangles[c][0]];
    var p2 = points[triangles[c][1]];
    var p3 = points[triangles[c][2]];
    
    var triangle = new Triangle(p1, p2, p3);
    
    triangle.calculateNormal();
    
    p1.normal = p1.normal.add(triangle.normal);
    p2.normal = p2.normal.add(triangle.normal);
    p3.normal = p3.normal.add(triangle.normal);
  }
  
  for(var c = 0; c < points.length; c++) {
    points[c].normal.normalize();
    
    points2D.push(points[c].projectPoint(camera));
  }
  
  for(var c = 0; c < triangles.length; c++) {
    var p1 = points2D[triangles[c][0]];
    var p2 = points2D[triangles[c][1]];
    var p3 = points2D[triangles[c][2]];
    
    displayTriangles.push(new Triangle(p1, p2, p3));
  }
  
  zBuffer = new Array(height);
  for(var c = 0; c < zBuffer.length; c++) {
    zBuffer[c] = new Array(width);
    
    for(var cpp = 0; cpp < zBuffer[c].length; cpp++) {
      zBuffer[c][cpp] = Infinity;
    }
  }
  
  draw();
}

function isObjectReady() {
  if(pointsAmount == 0|| trianglesAmount == 0) {
    return false;
  }
  
  return points.length == pointsAmount && triangles.length == trianglesAmount;
}