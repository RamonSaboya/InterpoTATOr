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

var displayTriangless = [];
var zBuffer;

function draw() {
  if(!isLightReady()) {
    alert("Você precisa definir a iluminação.");
    
    return;
  }
  
  if(!isCameraReady()) {
    alert("Você precisa definir a câmera.");
    
    return;
  }
  
  if(!isObjectReady()) {
    alert("Você precisa definir o objeto.");
    
    return;
  }
}