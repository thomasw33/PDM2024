let noise = new Tone.Noise("white");
let filter = new Tone.Filter(3000, 'highpass');

// Connect noise to filter and filter to destination
noise.connect(filter);
filter.toDestination();

// Create envelope for synth
let envelope = new Tone.Synth({
  oscillator: {
    type: 'square'
  },
  envelope: {
    attack: 0.001,
    decay: 0.01,  
    sustain: 0.0,  
    release: 0.01,
  }
}).toDestination();

// Create filter slider
let filterSlider;

function preload() {
  flash = loadImage('assets/flash.jpeg');
}

function setup() {
  createCanvas(400, 400);

  // Create the slider
  filterSlider = createSlider(100, 5000, 3000, 1);
  filterSlider.position(150, 200);
}

function draw() {
  if (mouseIsPressed) {
    background(flash);
  } else {
    background(240); // Default background
    text('Press Mouse for The Flash', 150, height / 3);
  }
}

function mousePressed() {
  // Trigger attack and start noise
  envelope.triggerAttack('C4');
  noise.start();
}

function mouseReleased() {
  // Trigger release and stop noise
  envelope.triggerRelease();
  noise.stop();
}
