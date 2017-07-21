const LABEL_TEXT = "Escolha um arquivo";
const RED = "rgba(255, 0, 0, 0.6)";
const GREEN = "rgba(0, 255, 0, 0.6)";

function setChangeListener(element, method) {
  document.getElementById(element).addEventListener('change', method, false);
}

function setLabelDivText(element, text) {
  document.getElementById(element).getElementsByTagName("div")[0].innerHTML = text;
}

function setHoverBoxShadow(element, color) {
  document.getElementById(element).style.boxShadow = "0px 0px 3px 2px " + color;

  document.getElementById(element).onmouseover = function() {
    this.style.boxShadow = "none";
  };
  document.getElementById(element).onmouseout = function() {
    this.style.boxShadow = "0px 0px 3px 2px " + color;
  };
}
