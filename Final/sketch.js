let player, game;
const startX = 100, startY = 100;
const canvasWidth = 640, canvasHeight = 480;
let score = 0;
let backgroundImg;
let castleImg, voldyImg;
let wizardImg, confusedImg;
let backgroundSound, gameSound, finalSound, bludgerSound, snitchSound;
let gameStarted = false;
let port; 

function preload() {
  backgroundImg = loadImage('assets/hogwarts.png'); 
  castleImg = loadImage('assets/castle.png'); 
  voldyImg = loadImage('assets/voldy.png'); 
  wizardImg = loadImage('assets/wizard.png'); 
  confusedImg = loadImage('assets/confused.png'); 

  backgroundSound = new Tone.Player('assets/title.mp3', () => {
    backgroundSound.loop = true;
    backgroundSound.volume.value = 0.5;
    if (!gameStarted) {
      backgroundSound.start();
    }
  }).toDestination();

  gameSound = new Tone.Player('assets/game.mp3').toDestination();
  finalSound = new Tone.Player('assets/final.mp3').toDestination();
  bludgerSound = new Tone.Player('assets/bludger.mp3').toDestination();
  snitchSound = new Tone.Player('assets/snitch.mp3').toDestination();
}

function setup() {
  port = createSerial();
  createCanvas(canvasWidth, canvasHeight);

  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);

  player = new Player(startX, canvasHeight * 0.75 - 40);
  game = new Game(player, Game.States.Start);
  frameRate(60);
}

function draw() {
  background(220);

  let str = port.readUntil("\n");
  let values = str.split(",");
  if (values.length > 2) {
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);

    if (joyX > 0) {
      player.moveRight();
    } else if (joyX < 0) {
      player.moveLeft();
    }

    if (joyY > 0) {
      player.moveDown();
    } else if (joyY < 0) {
      player.moveUp();
    }
  }

  switch (game.currentState) {
    case Game.States.Start:
      image(castleImg, 0, 0, canvasWidth, canvasHeight);
      fill(255);
      textAlign(CENTER);
      textSize(48);
      text("Welcome to Quidditch Match!", canvasWidth / 2, canvasHeight / 2 - 50);
      break;
    case Game.States.Play:
      image(backgroundImg, 0, 0, canvasWidth, canvasHeight); 
      break;
    case Game.States.GameOver:
      image(voldyImg, 0, 0, canvasWidth, canvasHeight);
      break;
  }

  switch (game.currentState) {
    case Game.States.Start:
      game.drawTitleScreen();
      break;
    case Game.States.Play:
      game.update();
      game.player.display();
      game.snitch.display();
      game.bludgers.forEach(bludger => bludger.display());
      textSize(20);
      fill(255); 
      text("Time: " + game.timer, width - 50, height - 30);
      text("Score: " + score, width - 50, height - 10);
      text("Lives: " + game.lives, 50, height - 30); 
      break;
    case Game.States.GameOver:
      game.drawGameOverScreen();
      textSize(48);
      fill(255); 
      text("Score: " + score, width / 2, height / 2 ); 
      break;
  }
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}

function keyPressed() {
  game.keyPressed();
}

function keyReleased() {
  game.keyReleased();
}

function sendCollisionSignal() {
  if (port && port.opened()) {
    port.write('C\n'); 
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40; 
    this.speed = 5; 
    this.frame = 0; 
    this.numFrames = 4; 
    this.sprite = wizardImg; 
    this.confusedSprite = confusedImg; 
    this.isConfused = false; 
    this.isFacingLeft = false; 
  }

  update() {

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
      this.moveLeft();
      this.isFacingLeft = true; 
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
      this.moveRight();
      this.isFacingLeft = false; 
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { 
      this.moveUp();
    } else if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { 
      this.moveDown();
    }

    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW) ||
      keyIsDown(65) || keyIsDown(68) || keyIsDown(87) || keyIsDown(83)) { 
      this.frame = (this.frame + 1) % this.numFrames;
    } else {
      this.frame = 0;
    }
  }

  display() {
   
    if (this.isConfused) {
      
      image(this.confusedSprite, this.x, this.y, this.size, this.size);
    } else {

      let spriteWidth = this.sprite.width / this.numFrames;
      let sx = this.frame * spriteWidth;
   
      if (this.isFacingLeft) {
        push();
        translate(this.x + this.size, this.y);
        scale(-1, 1); 
        image(this.sprite, 0, 0, this.size, this.size, sx, 0, spriteWidth, this.sprite.height);
        pop();
      } else {
        image(this.sprite, this.x, this.y, this.size, this.size, sx, 0, spriteWidth, this.sprite.height);
      }
    }
  }

  moveUp() {
    this.y -= this.speed;
  }

  moveDown() {
    this.y += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
    this.isFacingLeft = true; 
}

moveRight() {
    this.x += this.speed;
    this.isFacingLeft = false; 
}

  keyPressed() {

  }

  keyReleased() {

  }
}

class Snitch {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed; 
    this.speedX = random(-speed, speed); 
    this.speedY = random(-speed, speed); 
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x <= this.size / 2 || this.x >= width - this.size / 2) {
      this.speedX *= -1; 
    }
    if (this.y <= this.size / 2 || this.y >= height - this.size / 2) {
      this.speedY *= -1; 
    }
  }

  display() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Bludger {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x <= this.size / 2 || this.x >= width - this.size / 2) {
      this.speedX *= -1; 
    }
    if (this.y <= this.size / 2 || this.y >= height - this.size / 2) {
      this.speedY *= -1; 
    }
  }

  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Game {

  static States = {
    Start: 0,
    Play: 1,
    GameOver: 2
  };

  constructor(player, state = Game.States.Start) {

    this.player = player;
    this.currentState = state;
    this.floor = height * 0.75; 
    this.snitch = new Snitch(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 20, 2); 
    this.bludgers = [
      new Bludger(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 30, random(-3, 3), random(-3, 3)),
      new Bludger(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 30, random(-3, 3), random(-3, 3))
    ]; 
    this.timer = 60; 
    this.startTime = 0; 
    this.lives = 3; 
    this.collisionSignalSent = false; 
  }

  setState(newState) {

    this.currentState = newState;
    switch (newState) {
      case Game.States.Start:
        this.setupStart();
        break;
      case Game.States.Play:
        this.setupPlay();
        break;
      case Game.States.GameOver:
        this.setupGameOver();
        break;
    }
  }

  update() {
    switch (this.currentState) {
      case Game.States.Play:
        this.player.update();
        this.snitch.update();
        this.bludgers.forEach(bludger => bludger.update()); 
        this.checkCollisions();
        this.updateTimer();
        break;
    }
  }

  drawTitleScreen() {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(255);
    text("Press SPACE to Start", width / 2, height / 2);
  }

  drawGameOverScreen() {

    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255);
    text("Game Over", width / 2, height / 2 - 50);
    text("Press SPACE to Restart", width / 2, height / 2 + 50);
  }

  keyPressed() {

    switch (this.currentState) {
      case Game.States.Start:
        if (keyCode === 32) {
          gameStarted = true;
          this.setState(Game.States.Play);
        }
        break;
      case Game.States.Play:
        this.player.keyPressed();
        break;
      case Game.States.GameOver:
        if (keyCode === 32) {
          this.restartGame(); 
        }
        break;
    }
  }

  keyReleased() {

    if (this.currentState === Game.States.Play) {
      this.player.keyReleased();
    }
  }

  restartGame() {

    this.timer = 60;
    score = 0;
    this.snitch = new Snitch(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 20, 2); 
    this.bludgers = [
      new Bludger(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 30, random(-3, 3), random(-3, 3)),
      new Bludger(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 30, random(-3, 3), random(-3, 3))
    ]; 
    this.lives = 3;
    this.player.isConfused = false; 
    this.setState(Game.States.Start); 
    
    sendResetSignal();
  }

  setupStart() {
    
    this.timer = 60; 
    score = 0; 
    backgroundSound.start(); 
    gameSound.stop(); 
    finalSound.stop(); 
    this.collisionSignalSent = false; 
  }

  setupPlay() {

    this.startTime = millis(); 
    this.timer = 60; 
    gameSound.start(); 
    backgroundSound.stop(); 
    finalSound.stop(); 
    this.collisionSignalSent = false; 
  }

  setupGameOver() {

    this.lives--;
    if (this.lives <= 0) {

      this.currentState = Game.States.GameOver;
      gameSound.stop(); 
      finalSound.start(); 
      if (!this.collisionSignalSent) {
        sendCollisionSignal();
        this.collisionSignalSent = true; 
      }
    } else {
      this.setState(Game.States.Start);
    }
  }

  checkCollisions() {

    let d = dist(game.player.x + game.player.size / 2, game.player.y + game.player.size / 2, game.snitch.x, game.snitch.y);
    if (d < game.player.size / 2 + game.snitch.size / 2) {
        score += 10; 
        game.snitch = new Snitch(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 20, game.snitch.speed + 1); 
        game.bludgers.push(new Bludger(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 30, random(-3, 3), random(-3, 3)));
        game.bludgers.push(new Bludger(random(50, canvasWidth - 50), random(50, canvasHeight - 50), 30, random(-3, 3), random(-3, 3)));
        snitchSound.start(); 
    }

    let hit = false; 
    game.bludgers.forEach(bludger => {
        let d = dist(game.player.x + game.player.size / 2, game.player.y + game.player.size / 2, bludger.x, bludger.y);
        if (d < game.player.size / 2 + bludger.size / 2) {
            hit = true; 
        }
    });

    if (hit && !game.player.isConfused) {

        game.player.isConfused = true; 
        game.lives--; 
        if (game.lives <= 0) {

            game.setState(Game.States.GameOver);
        } else {

            setTimeout(() => { game.player.isConfused = false; }, 1000); 
            bludgerSound.start(); 
            sendCollisionSignal(); 
        }
    }
  }

  updateTimer() {

    let elapsedTime = (millis() - this.startTime) / 1000; 
    this.timer = max(0, 60 - floor(elapsedTime)); 
    if (this.timer === 0) {
      this.setupGameOver(); 
    }
  }
}

function sendCollisionSignal() {
  if (port && port.opened()) {
      port.write('C\n'); 
  }
}

function sendResetSignal() {
  if (port && port.opened()) {
    port.write('R\n'); 
  }
}