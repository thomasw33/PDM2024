let port;
let potValue = 0;
let lastPotValue = 0;
let connectButton;

function setup() {
  port = createSerial();
  createCanvas(400, 400);

  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 9600);
  }
  frameRate(30);  // Reduced frame rate to 30fps
}

function draw() {
  let characters = port.available();
  let str = port.read(characters);
  
  if (str !== null) {
    potValue = Number(str.trim());  // Trim whitespace and convert to a number
  }

  if (potValue !== lastPotValue) {
    background(255, 0, 0);  // Set background to red when potentiometer value is changing
    textSize(32);  // Set text size to 32
    fill(0);  // Set text color to black
    text("WARNING!!!!", 100, 200);  // Display "WARNING!!!!" in big black letters
    lastPotValue = potValue;
  } else {
    background(0, 255, 0);  // Set background to green when potentiometer value is stable
  }

  if (mouseIsPressed) {
    if (mouseX < width / 2) {
      port.write("1"); // send "1" to turn on LED
    } else {
      port.write("0"); // send "0" to turn off LED
    }
  }
}

function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }
}

