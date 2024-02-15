let mike;
let rotation = 0;
let score = 0;
let speed = 3;
let timeRemaining = 15;
let gameOver = false;
let title = true;
let success, fail, normal;
let lastAttempt;
let gameFont;

function preload() {
  mike = loadImage("assets/mike2.png");
  gameFont = loadFont("assets/PressStart2P-Regular.ttf");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  success = color('blue');
  fail = color('red');
  normal = color('white');
  lastAttempt = normal;

  textFont(gameFont);
}

function draw() {
  background(lastAttempt);

  if(title) {
    titleScreen();
  } else if (gameOver) {
    gameDone();
  } else {
    playing();
  }
}

function playing() {
  push();
    translate(width/2,height/2);
    rotate(rotation += speed);
    image(mike,0,0,mike.width/3, mike.height/3);
  pop();

  if (rotation >= 360)
    rotation = 0;

  textSize(12);
  text("Score: " + score, 20,20);
  text("Time: " + ceil(timeRemaining), width-100,20);

  timeRemaining -= deltaTime / 1000;
  if (timeRemaining < 0) {
    lastAttempt = normal;
    gameOver = true;
  }
}

function gameDone() {
  text("Time's Up!", 100,100);
  text("Score: " + score, 100,150);
  text("Press Space to Play Again.", 100,200);
  if(score >= 0) {
    text("You Win!",100,250);
  }else {
    text("You Lose :(",100,250);   
  }
}

function titleScreen() {
  image(mike,50,50,mike.width/10, mike.height/10);
  text("Welcome to Mike the Tiger!", 100,100);
  text("Press Space to Start", 100,150);
}

function keyTyped() {
  if (key === ' ') {
    if (gameOver) {
      gameOver = false; 
      title = true;
    } else if (title) {
      timeRemaining = 15;
      score = 0;
      title = false;
    }
    else {
      if (rotation >= 350 || rotation <= 10){
        score++;
        lastAttempt = success;
      } else {
        score--;
        lastAttempt = fail;
      }
    }
  }
}
