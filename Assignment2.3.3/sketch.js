let noise = new Tone.Noise("white"); 
let filter = new Tone.Filter(3000, 'highpass'); 

let envelope = new Tone.AmplitudeEnvelope({
  attack: 0.001, 
  decay: 0.01,   
  sustain: 0.0,  
  release: 0.01, 
  oscillator: {
    type: 'square' 
  }
}).toDestination();

let amLFO = new Tone.LFO({
  frequency: 2, 
  amplitude: 0.3, 
}).start(); 

amLFO.connect(noise.volume);

noise.connect(filter);
filter.connect(envelope);

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
    envelope.triggerAttack();

    noise.start();
    background(flash);
  } else {
    envelope.triggerRelease();

    noise.stop();
    background(240);
    text('Press Mouse for The Flash', 150, height / 3);
    text('Filter Slider', 190, 200);
  }
}


