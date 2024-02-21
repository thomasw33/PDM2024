let bug;
let squishedBug;
let timer = 30;
let bugs = [];
let squishedBugs = 0;
let gameState = 'title';
let customFont;

function preload() {
  bug = loadImage('assets/bug.png');
  squishedBug = loadImage('assets/squished_bug.png');
  customFont = loadFont('assets/Arial.ttf');
}

class Animation {
  constructor(spriteSheet, frameCount) {
    this.spriteSheet = spriteSheet;
    this.frame = 0;
    this.frameCount = frameCount;
  }

  show() {
    image(
      this.spriteSheet.get(
        this.frame * this.spriteSheet.width / this.frameCount,
        0,
        this.spriteSheet.width / this.frameCount,
        this.spriteSheet.height
      ),
      -this.spriteSheet.width / (2 * this.frameCount),
      -this.spriteSheet.height / 2
    );

    this.frame = (this.frame + 1) % this.frameCount;
  }

  setSpriteSheet(spriteSheet) {
    this.spriteSheet = spriteSheet;
    this.frameCount = (this.spriteSheet === squishedBug) ? 1 : spriteSheet.width / spriteSheet.height;
  }
}

function setup() {
  createCanvas(600, 600);
  frameRate(15);
}

function draw() {
  background(200);

  if (gameState === 'title') {
    titleScreen();
  } else if (gameState === 'playing') {
    playGame();
  } else if (gameState === 'gameOver') {
    gameOverScreen();
  }
}

function titleScreen() {
  textFont(customFont);
  textSize(24);
  fill(0);
  let titleText = 'Welcome To Bug Squish!';
  text(titleText, width / 2 - textWidth(titleText) / 2, height / 2 - 50);

  textSize(12);
  let startText = 'Click to Start';
  text(startText, width / 2 - textWidth(startText) / 2, height / 2 + 50);
}

function playGame() {
  textFont(customFont);
  textSize(12);
  
  background(0, 255, 0, 50);

  fill(0);
  text(`Time: ${timer}`, 20, 30);
  text(`Squished Bugs: ${squishedBugs}`, 20, 60);

  for (let i = bugs.length - 1; i >= 0; i--) {
    let bug = bugs[i];
    bug.update();
    bug.display();
  }

  if (frameCount % 15 === 0 && timer > 0) {
    timer--;
  }

  if (timer === 0) {
    gameState = 'gameOver';
  }
}

function gameOverScreen() {
  textFont(customFont);
  textSize(48);
  let gameOverText = 'Game Over!';
  let scoreText = `Score: ${squishedBugs}`;
  text(gameOverText, width / 2 - textWidth(gameOverText) / 2, height / 2 - 50);
  text(scoreText, width / 2 - textWidth(scoreText) / 2, height / 2 + 50);

  textSize(24);
  let restartText = 'Click to Start Again';
  text(restartText, width / 2 - textWidth(restartText) / 2, height / 2 + 100);
}

function mousePressed() {
  if (gameState === 'title') {
    gameState = 'playing';
    startGame();
  } else if (gameState === 'gameOver') {
    resetGame();
  } else {
    for (let bug of bugs) {
      if (bug.contains(mouseX, mouseY)) {
        squishedBugs++;
        bug.squish();

        for (let b of bugs) {
          b.increaseSpeed();
        }
      }
    }
  }
}

function startGame() {
  timer = 30;
  squishedBugs = 0;
  bugs = [];

  for (let i = 0; i < 10; i++) {
    bugs.push(new Bug());
  }
}

function resetGame() {
  gameState = 'title';
}

class Bug {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = 5;
    this.angle = atan2(random(-1, 1), random(-1, 1));
    this.size = 64;
    this.animation = new Animation(bug, 4);
    this.squished = false;
    this.squishTimer = 0;
  }

  update() {
    if (!this.squished) {
      this.x += this.speed * cos(this.angle);
      this.y += this.speed * sin(this.angle);

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.angle = atan2(random(-1, 1), random(-1, 1));
        this.x = constrain(this.x, 0, width - 5);
        this.y = constrain(this.y, 0, height - 5);
      }
    } else {
      if (this.squishTimer > 0) {
        this.squishTimer--;
      } else {
        this.squished = false;
        this.size = 64;
        this.squishTimer = 0;
      }
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    if (this.squished) {
      this.animation.setSpriteSheet(squishedBug);
      rotate(this.angle);
    } else {
      rotate(atan2(sin(this.angle), cos(this.angle)));
      this.animation.setSpriteSheet(bug);
    }

    this.animation.show();
    pop();
  }

  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.size / 2;
  }

  squish() {
    this.squished = true;
    this.size = 0;
    this.squishTimer = 15;
  }

  increaseSpeed() {
    this.speed++;
  }
}
