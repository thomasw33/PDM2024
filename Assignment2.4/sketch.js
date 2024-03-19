let noise = new Tone.Noise("white");
let filter = new Tone.Filter(3000, 'highpass');

noise.connect(filter);
filter.toDestination();

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

let filterSlider;

function preload() {
  flash = loadImage('assets/flash.jpeg');
}

function setup() {
  createCanvas(400, 400);
  
  filterSlider = createSlider(100, 5000, 3000, 1);
  filterSlider.position(150, 200);
  filterSlider.mouseMoved(() => {
    filter.frequency.value = filterSlider.value();
  });
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
  envelope.triggerAttack('C4');
  noise.start();
}

function mouseReleased() {
  envelope.triggerRelease();
  noise.stop();
}

