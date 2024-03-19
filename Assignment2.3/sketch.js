let synth1 = new Tone.PolySynth(Tone.MetalSynth);
let synth2 = new Tone.PolySynth(Tone.DuoSynth);

let bend = new Tone.PitchShift();
bend.pitch = 0;

synth1.connect(bend);
bend.toDestination();

synth2.connect(bend);
bend.toDestination();

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

function setup() {
  createCanvas(400, 400);

  mySelect = createSelect();
  mySelect.position (100,100);
  mySelect.option ('Simple Synth');
  mySelect.option ('Duo Synth');
  mySelect.selected ('Simple Synth');

  pitchSlider = createSlider(0, 12, 0, 0.1);
  pitchSlider.position (120, 200);
  pitchSlider.mouseMoved(()=> bend.pitch = pitchSlider.value());

}

function keyPressed(){
  if (mySelect.selected() === 'Simple Synth') {
    let playNotes = notes[key];
    synth1.triggerAttackRelease(playNotes, 0.8);
  } else if (mySelect.selected() === 'Duo Synth') {
    let playNotes = notes[key];
    synth2.triggerAttackRelease(playNotes, 0.8);
  }
  
}

// function keyReleased(){
//   let playNotes = notes[key];
//   synth.triggerRelease(playNotes,'+0.03');
// }

function draw() {
  background(100, 120, 150);
  text ('Play A-K For Synth', 140, 200)
  text ('Bend Slider', 160, 230);
}
