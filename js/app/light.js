const LIGHT_FILE_ID = "light-file"

var light = null;

function uploadLight(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(event) {
      var data = this.result.split('\n');
      console.log(data);
    };
  })(file);
  reader.readAsText(file);
}

function processLight(data) {
  light = null;
}

function isLightReady() {
  return light != null;
}