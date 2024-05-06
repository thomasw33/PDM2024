let squishedBug;
let timer = 30;
let bugs = [];
let squishedBugs = 0;
let gameState = 'title';
let customFont;
let backgroundSound;
let sounds;
let port;
let joyX = 0, joyY = 0, sw = 0;
let connectButton;

function preload() {
  bug = loadImage('assets/bug.png');
  squishedBug = loadImage('assets/squished_bug.png');
  customFont = loadFont('assets/Arial.ttf');

  // Load background music
  backgroundSound = new Tone.Player('assets/background_music.mp3', () => {
    backgroundSound.loop = true;
    backgroundSound.volume.value = 0.5;
    backgroundSound.start();
  }).toDestination();

  // Load other sounds
  sounds = {
    'death': new Tone.Player('assets/bug_death.mp3').toDestination(),
    'miss': new Tone.Player('assets/bug_missed.mp3').toDestination(),
    'start': new Tone.Player('assets/start_music.mp3').toDestination(),
    'end': new Tone.Player('assets/end_music.mp3').toDestination()
  };
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

  // Start background music
  if (backgroundSound && backgroundSound.loaded) {
    backgroundSound.loop = true;
    backgroundSound.volume.value = 0.5;
    backgroundSound.start();
  }

  // Port setup
  port = createSerial();
  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
}

function draw() {
  background(200);

  let str = port.readUntil("\n");
  if (str !== null) {
    let data = str.split(",");
    joyX = parseInt(data[0]);
    joyY = parseInt(data[1]);
    sw = parseInt(data[2]);
  }

  if (gameState === 'title') {
    if (!sounds['start'].state) {
      sounds['start'].loop = true;
      sounds['start'].volume.value = 0.5;
      sounds['start'].start();
    }
    titleScreen();
  } else if (gameState === 'playing') {
    if (!backgroundSound.state) {
      backgroundSound.loop = true;
      backgroundSound.volume.value = 0.5;
      backgroundSound.start();
    }
    playGame();
  } else if (gameState === 'gameOver') {
    if (!sounds['end'].state) {
      sounds['end'].loop = true;
      sounds['end'].volume.value = 0.5;
      sounds['end'].start();
    }
    backgroundSound.stop();
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

  // Joystick and switch controls
  if (sw === 0) {
    for (let bug of bugs) {
      if (bug.contains(joyX, joyY)) {
        squishedBugs++;
        bug.squish();
        sounds['death'].start();
        for (let b of bugs) {
          b.increaseSpeed();
        }
        break;
      }
    }
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
  sounds['start'].stop();
  sounds['end'].stop();
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

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}