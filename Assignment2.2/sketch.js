
let synth = new Tone.PolySynth(Tone.MetalSynth);
let bend = new Tone.PitchShift();

bend.pitch = 0;

synth.connect(bend);
bend.toDestination();


function setup() {
  createCanvas(400, 400);

  pitchSlider = createSlider(0, 12, 0, 0.1);
  pitchSlider.position (120, 200);
  pitchSlider.mouseMoved(()=> bend.pitch = pitchSlider.value());

}

let notes = {
  'a' : 'C4',
  's' : 'D4',
  'd' : 'E4',
  'f' : 'F4',
  'g' : 'G4',
  'h' : 'A4',
  'j' : 'B4',
  'k' : 'C5'
}

function keyPressed(){
  let playNotes = notes[key];
  synth.triggerAttack(playNotes);
}

function keyReleased(){
  let playNotes = notes[key];
  synth.triggerRelease(playNotes,'+0.03');
}


function draw() {
  background(100, 120, 150);
  text ('Play A-K For Synth', 140, 200)
  text ('Bend Slider', 160, 230);
}
