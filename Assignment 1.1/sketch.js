function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  noStroke();
  fill('chartreuse');
  rect(50,20,100,50);
  fill('white');
  stroke(0);
  strokeWeight(0.5);
  circle(75,45,40);
  fill('white');
  stroke(0);
  strokeWeight(0.5);
  square(105,25,40);

  noStroke();
  fill('white');
  square(50,100,100);
  fill(0,75,85,0.5);
  circle(100,135,50);
  fill(120,75,90,0.4);
  circle(115,165,50);
  fill(240,75,85,0.4);
  circle(85,165,50);
  
  noStroke();
  fill('black');
  rect(200,20,100,50);
  fill('yellow');
  arc(225,45,40,40,-140,140, PIE);
  fill(15,100,100);
  ellipse(275,45,40,40);
  rect(255,45,40,20);
  fill('white');
  circle(265,45,12);
  circle(285,45,12);
  fill('blue');
  circle(265,45,7);
  circle(285,45,7);

  noStroke();
  fill('navy');
  square(200,100,100);
  fill('green');
  stroke(255);
  strokeWeight(1.5);
  circle(250,150,50);
  fill('red');
  stroke(255);
  strokeWeight(1.5);
  beginShape();
  vertex(245,141);
  vertex(250,125);
  vertex(255,141);
  vertex(274,141);
  vertex(260,155);
  vertex(265,171);
  vertex(250,160);
  vertex(235,171);
  vertex(240,155);
  vertex(226,141);
  vertex(245,141);
  endShape();



}
