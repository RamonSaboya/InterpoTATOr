var width = document.getElementById('stage').offsetWidth;
var height = document.getElementById('stage').offsetHeight;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

window.onresize = window.onload = function(event) {
  width = document.getElementById('stage').offsetWidth;
  height = document.getElementById('stage').offsetHeight;
  
  document.getElementById('canvas').width = width;
  document.getElementById('canvas').height = height;
};

var zBuffer;

var triangles2D = [];
var triangles3D = [];

function draw() {
  if(!isLightReady()) {
    alert("Você precisa definir a iluminação.");
    
    return;
  }
  
  if(!isCameraReady()) {
    alert("Você precisa definir a câmera.");
    
    return;
  }
  
  if(!isTextureReady()) {
    alert("Você precisa definir a textura.");
    
    return;
  }
  
  if(!isObjectReady()) {
    alert("Você precisa definir o objeto.");
    
    return;
  }
  
  ctx.clearRect(0, 0, width, height);
  
  for(var c = 0; c < triangles2D.length; c++) {
    var triangle = triangles2D[c];
    
    processTriangle(triangle, c);
  }
}

function paint(x, y, color) {
  ctx.fillStyle = "rgb(" + color.x + ", " + color.y + ", " + color.z + ")";
  ctx.fillRect(x, y, 1, 1);
}