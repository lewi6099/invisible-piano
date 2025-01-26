let keys = [];
let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let synths = []; // Array to hold oscillators for each active note
let sustain = false; // Toggle sustain mode
let activeKeys = []; // Array to track active keys
let section = 0; // Current section (0-6)
let canUpdateSectionUp = true; // Flag for if updateSectionUp is in cool-down
let canUpdateSectionDown = true; // Flag for if updateSectionDown is in cool-down
let canUpdateSustain = true; // Flag for if updateSustain is in cool-down

/********************************************************************
// Basic Piano and Features Setup
********************************************************************/
function setup() {
  createCanvas(1400, 200); // Adjust width for 4 octaves

  // Create white keys for 4 octaves
  let keyWidth = width / (7 * 4);
  for (let octave = 0; octave < 4; octave++) {
    for (let i = 0; i < 7; i++) {
      keys.push({
        x: (octave * 7 + i) * keyWidth,
        y: 0,
        width: keyWidth,
        height: height,
        note: notes[i],
        octave: octave,
        isActive: false
      });
    }
  }
}

function draw() {
  background(255);
  drawKeys();
}

// Draw keys taking into account the active section
function drawKeys() {
  // Determine the range of keys in active section
  let startIndex = section * 4;
  let endIndex = startIndex + 4;

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    
    // Highlight keys in active section
    if (i >= startIndex && i < endIndex) {
      if (key.isActive) {
        fill('yellow');
      } else {
        fill('lightyellow');
      }
    } else {
      // Normal keys
      if (key.note === 'C') {
        fill(key.isActive ? 'orange' : 'lightgreen'); // Distinct color for "C" notes
      } else {
        fill(key.isActive ? 'lightblue' : 'white');
      }
    }
    stroke(0);
    rect(key.x, key.y, key.width, key.height);
  }
}

// Check if any keys are pressed when the mouse is clicked
function mousePressed() {
  for (let key of keys) {
    if (
      mouseX > key.x &&
      mouseX < key.x + key.width &&
      mouseY > key.y &&
      mouseY < key.height
    ) {
      playNoteAndToggleColor(key);
    }
  }
}

// Deactivate keys if sustain is off
function mouseReleased() {
  if (!sustain) {
    for (let key of activeKeys) {
      key.isActive = false;
      stopSynthForKey(key); // Stop individual key sound
    }
    activeKeys = []; // Clear active keys
  }
}

// When a note is triggered, play the sound and update the color
function playNoteAndToggleColor(key) {
  let freq = getFrequency(key.note, key.octave);

  // Create a new oscillator for each note
  let newSynth = new p5.Oscillator();
  newSynth.setType('sine');
  newSynth.freq(freq);
  newSynth.amp(0);
  newSynth.start();
  newSynth.amp(0.5, 0.05); // Ramp up to 0.5 amplitude over 0.05 seconds

  // Add the new synth to the array of active synths
  synths.push({ synth: newSynth, key: key });

  // Toggle key color and track it as active
  key.isActive = true;
  if (!activeKeys.includes(key)) {
    activeKeys.push(key);
  }
}


// Find and stop the synth associated with the key
function stopSynthForKey(key) {
  synths = synths.filter(({ synth, key: k }) => {
    if (k === key) {
      synth.amp(0, 0.2); // Gradually stop the sound
      synth.stop(0.2); // Stop the oscillator after the fade-out
      return false; // Remove from array
    }
    return true;
  });
}

// Toggle sustain mode with the space bar
function keyPressed() {
  if (key === ' ') {
    canUpdateSustain = true;
    triggerSustain();
  }
}

// Turn off active keys and stop their sounds
function deactivateAllKeys() {
  for (let key of activeKeys) {
    key.isActive = false;
    stopSynthForKey(key);
  }
  activeKeys = [];
}

// Find a frequency for a note
function getFrequency(note, octave) {
  let baseFrequency = 261.63; // Middle C (C4)
  let noteMap = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11
  };
  let semitone = noteMap[note] || 0;
  let octaveShift = 12 * octave;
  return baseFrequency * pow(2, (semitone + octaveShift) / 12);
}

/********************************************************************
// Hand Tracking Features Setup
********************************************************************/

// Move the section up 4 keys
function updateSectionUp() {
  if(canUpdateSectionUp && section + 1 <= 6) {
    triggerMoveUpBox();
    section = section + 1;

    canUpdateSectionUp = false;
      setTimeout(() => {
        canUpdateSectionUp = true;
        triggerMoveUpBox();
      }, 300);
  }
  else {
    console.log('Please wait before moving section up again.');
  }
}

// Move the setion down 4 keys
function updateSectionDown() {
  if(canUpdateSectionDown && section - 1 >= 0) {
    triggerMoveDownBox();
    section = section - 1;

    canUpdateSectionDown = false;
      setTimeout(() => {
        canUpdateSectionDown = true;
        triggerMoveDownBox();
      }, 300);
  }
  else {
    console.log('Please wait before moving section up again.');
  }
}

// Trigger sustain mode
function triggerSustain() {
  if(canUpdateSustain) {
    triggerSustainBox();
    sustain = !sustain;
    if (!sustain) {
      deactivateAllKeys(); // Deactivate all keys and stop sounds when sustain is disabled
    }
    canUpdateSustain = false;
      setTimeout(() => {
        canUpdateSustain = true;
      }, 300);
  }
  else {
    console.log('Please wait before updating susatin again.');
  }
  
} 

// Simulate pressing a key
function pressKey(index) {
  if (index >= 0 && index < keys.length) {
    let key = keys[index];
    if (!key.isActive) {
      playNoteAndToggleColor(key); // Activate the key
    }
  }
}

// Simulate releasing a key
function releaseKey(index) {
  if (index >= 0 && index < keys.length) {
    let key = keys[index];
    if (key.isActive) {
      if (!sustain) {
        key.isActive = false; // Deactivate the key
        stopSynthForKey(key); // Stop individual key sound
      }
    }
  }
}


/********************************************************************
// Control Box Management
********************************************************************/
let sustainBox = false;
let moveDownBox = false;
let moveUpBox = false;
function triggerSustainBox() {
  if(sustainBox) {
    document.getElementById('sustainBox').classList.remove('active');
  }
  else {
    document.getElementById('sustainBox').classList.add('active');
  }
  sustainBox = !sustainBox;
}

function triggerMoveDownBox() {
  if(moveDownBox) {
    document.getElementById('moveDownBox').classList.remove('active');
  }
  else {
    document.getElementById('moveDownBox').classList.add('active');
  }
  moveDownBox = !moveDownBox;
}

function triggerMoveUpBox() {
  if(moveUpBox) {
    document.getElementById('moveUpBox').classList.remove('active');
  }
  else {
    document.getElementById('moveUpBox').classList.add('active');
  }
  moveUpBox = !moveUpBox;
}