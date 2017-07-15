function Barycenter(alpha, beta, gamma, dist) {
  this.alpha = alpha;
  this.beta = beta;
  this.gamma = gamma;
  this.dist = dist;
}

function findBarycenter(x, y, p1, p2, p3) {
  var denom = ((p1.x - p3.x) * (p2.y - p3.y)) - ((p1.y - p3.y) * (p2.x - p3.x));
  
	var	alpha = ((p2.y - p3.y) * (x - p3.x) - ((p3.x - p2.x) * (p3.y - y))) / denom;
	var	beta = (((p3.y - p1.y) * (x - p3.x)) - ((p1.x - p3.x) * (p3.y - y))) / denom;
	var	gamma = 1.0 - alpha - beta;
	
	var dist = barycenterDist(alpha, beta, gamma);
  return new Barycenter(alpha, beta, gamma, dist);
}

function barycenterDist(alpha, beta, gamma){
  return Math.sqrt((alpha - (1/3)) * (alpha - (1/3)) + (beta - (1/3)) *(beta - (1/3)) + (gamma - (1/3)) * (gamma - (1/3)));
}