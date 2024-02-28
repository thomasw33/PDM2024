let sounds = new Tone.Players({
  'bounce': "assets/BallBouncing.mp3",
  'roll': "assets/BallRolling.mp3",
  'tap' : "assets/FingersTapping.mp3",
  'clap' : "assets/HandClapping.mp3"
   });
 
 let delAmt = new Tone.FeedbackDelay ("8n", 0.5);
 let distAmt = new Tone.Distortion (0.5); 
 
 let button1, button2, button3, button4;
 let delaySlider, fbSlider, distSlider;
 
 sounds.connect(delAmt);
 delAmt.connect(distAmt);
 distAmt.toDestination();
 
 function setup() {
   createCanvas(500, 500);

   button1 = createButton('Ball Bouncing');
   button1.position(25, 150);
   button1.mousePressed(() => sounds.player("bounce").start()); 
   
   button2 = createButton('Ball Rolling');
   button2.position(125, 150);
   button2.mousePressed(() => sounds.player("roll").start());

   button3 = createButton('Fingers Tapping');
   button3.position(210, 150);
   button3.mousePressed(() => sounds.player("tap").start());

   button4 = createButton('Clapping Hands');
   button4.position(322.5, 150);
   button4.mousePressed(() => sounds.player("clap").start());

   delaySlider = createSlider (0, 1, 0, 0.05);
   delaySlider.position (150, 200);
   delaySlider.mouseMoved (() => delAmt.delayTime.value = delaySlider.value()); 
 
   fbSlider = createSlider (0, 0.9, 0, 0.05);
   fbSlider.position (150, 250);
   fbSlider.mouseMoved (() => delAmt.feedback.value = fbSlider.value ());
 
   distSlider = createSlider (0, 0.9, 0, 0.05);
   distSlider.position (150, 300);
   distSlider.mouseMoved (() => distAmt.distortion = distSlider.value());
 }
 
 
 function draw() {
   background(220, 0, 200);
   text ("Press Buttons for Sound", width/3, 120);
   text ("Add Delay", 190, 235);
   text ("Add Feedback", 185, 285);
   text ("Add Distortion", 185, 335);
 }