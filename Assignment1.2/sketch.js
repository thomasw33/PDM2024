let selectedColor = (0);
let colors=['red','orange','yellow','green','cyan','blue','magenta','brown','white','black'];
let x;
let y;
let size = 30;
let dragging = false;

function setup() {
  createCanvas(400, 400);
  background(240);
}

function draw() { 
  fill(150);
  circle(width-30,30,20);
  for(let i=0;i < colors.length;i++) {
    fill(colors[i]);
    stroke(255);
    strokeWeight(1);
    rect(0,i*30,30,30);
    strokeWeight(5);
  }
  stroke(colors[selectedColor])
  fill(selectedColor);
}
 
 function mousePressed() {
  let isInColor = false;
  for(let i=0;i<colors.length;i++) {
    if(mouseX>= 0 && mouseX < size && mouseY >= 0 && mouseY < (colors.length*size)){
      selectedColor=floor(mouseY/size);
      isInColor = true;
      stroke(colors[selectedColor]);
      dragging=false;
    }else{
      x=mouseX;
      y=mouseY;
      dragging=true;
    }
    if(!isInFace) {
      selectedColor = colors('white');
    }
 }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if(dragging){
    line(mouseX,mouseY,pmouseX,pmouseY);
    x=pmouseX;
    y=pmouseY;
  }
 }
 