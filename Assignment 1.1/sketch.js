function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(220);
  noStroke();
  fill('chartreuse');
  rect(55,20,100,50);
  fill('white');
  stroke(0);
  circle(80,45,40);
  fill('white');
  stroke(0);
  square(110,25,40);

  noStroke();
  fill('white');
  square(50,150,100);
  fill(0,75,85,0.5);
  circle(100,185,50);
  fill(120,75,90,0.4);
  circle(115,215,50);
  fill(240,75,85,0.4);
  circle(85,215,50);
  

}
