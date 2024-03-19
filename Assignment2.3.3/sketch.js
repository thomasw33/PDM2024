let noise = new Tone.Noise("white"); // Using white noise for a brighter sound
let filter = new Tone.Filter(1000, 'highpass'); // Using a highpass filter to emphasize high frequencies

// Create an amplitude envelope with a square waveform
let envelope = new Tone.AmplitudeEnvelope({
  attack: 0.001, // Very short attack time for an instantaneous onset
  decay: 0.01,   // Short decay time
  sustain: 0.0,  // No sustain
  release: 0.01, // Short release time
  oscillator: {
    type: 'square' // Use square waveform for the envelope
  }
}).toDestination();

// Create an LFO for amplitude modulation (AM)
let amLFO = new Tone.LFO({
  frequency: 2, // Adjust the frequency of the LFO for crackling effect
  amplitude: 0.3, // Adjust the amplitude of the LFO for crackling effect
}).start(); // Start the LFO

// Connect the LFO to modulate the amplitude of the noise
amLFO.connect(noise.volume);

// Connect the noise to the filter and then to the envelope
noise.connect(filter);
filter.connect(envelope);

function preload() {
  flash = loadImage('assets/flash.jpeg');
}

function setup() {
  createCanvas(400, 400);

  filterSlider = createSlider(100, 5000, 1000, 1); // Adjusted slider range for highpass filter
  filterSlider.position(150, 200);
  filterSlider.mouseMoved(() => {
    filter.frequency.value = filterSlider.value();
  });
}

function draw() {
  if (mouseIsPressed) {
    // Trigger the envelope when mouse is pressed
    envelope.triggerAttack();

    noise.start();
    background(flash);
  } else {
    // Release the envelope when mouse is released
    envelope.triggerRelease();

    noise.stop();
    background(240);
    text('Press Mouse for The Flash', 150, height / 3);
    text('Filter Slider', 190, 200);
  }
}