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
      
      if(!isLightReady()) {
        alert("Você precisa escolher a iluminação.");
        document.getElementById(OBJECT_FILE_ID).value = "";
        
        return;
      }
      
      processObject(data);
    };
  })(file);
  reader.readAsText(file);
}

document.getElementById(OBJECT_FILE_ID).addEventListener('change', uploadObject, false);

function processObject(data) {
  triangles2D = [];
  triangles3D = [];
  
  points = [];
  triangles = [];

  var amounts = data[0].split(' ');
  
  pointsAmount = Number(amounts[0]);
  trianglesAmount = Number(amounts[1]);
  
  var points2D = [];

  for(var c = 0; c < pointsAmount; c++) {
    var pointData = data[c + 1].split(' ');
    var point = new Point3D(pointData[0], pointData[1], pointData[2]);
    
    point = point.changeBase(camera);
    
    points.push(point);
  }

  for(var c = 0; c < trianglesAmount; c++) {
    var triangleData = data[c + pointsAmount + 1].split(' ');
    
    var triangleRef = [triangleData[0] - 1, triangleData[1] - 1, triangleData[2] - 1];
    
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
    
    points2D.push(points[c].projectPoint(camera, c));
  }
  
  for(var c = 0; c < triangles.length; c++) {
    var p1 = points[triangles[c][0]];
    var p2 = points[triangles[c][1]];
    var p3 = points[triangles[c][2]];
    
    var triangle3D = new Triangle(p1, p2, p3);
    triangle3D.calculateNormal();
    triangles3D.push(triangle3D);
    
    p1 = points2D[triangles[c][0]];
    p2 = points2D[triangles[c][1]];
    p3 = points2D[triangles[c][2]];
    
    triangles2D.push(new Triangle(p1, p2, p3));
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