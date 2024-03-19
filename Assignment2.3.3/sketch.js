let noise = new Tone.Noise("white");
let filter = new Tone.Filter(3000, 'highpass');


// I put the signal flow here 
noise.connect(filter);
filter.toDestination();


//maybe change this to a synth object where you define the envelope within it
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

// let amLFO = new Tone.LFO({
//   frequency: 2,
//   amplitude: 0.3,
// }).start();


// amLFO.connect(noise.volume); 
// filter.connect(envelope);


function preload() {
 flash = loadImage('assets/flash.jpeg');
}


function setup() {
 createCanvas(400, 400);

 filterSlider = createSlider (100, 5000, 3000, 1);
 filterSlider.position (150, 200);
 filterSlider.mouseMoved(() => {
  filter.frequency.value = filterSlider.value();
 });
}


function draw() {
 if (mouseIsPressed) {
   background(flash);
 } else {
   background(240);
   text('Press Mouse for The Flash', 150, height / 3);
   text('Filter Slider', 190, 200);
 }
}


function mousePressed(){
 envelope.triggerAttack('c4');
 noise.start();
}


function mouseReleased(){
 envelope.triggerRelease();
 noise.stop();
}