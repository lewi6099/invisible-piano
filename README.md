# Invisible Piano
This project utilizes P5.js and Google's Hand Tracking model to create a virtual piano that can be controlled with your hands in the air.

## Instructions
### Playing Hand
- The first hand to enter the camera's view is the playing hand
- The keys that are highlighted in yellow are the active notes
- Touch your thumb to other fingers on your playing hand to play notes
- Your pointer finger will play the lowest active note, and your pinky will play the highest

### Control Hand
- The second hand to enter the camera's view is the control hand
- Touch your thumb to other fingers on your control hand to adjust the controls
- Pointer finger: Move the active notes higher
- Middle finger: Move the active notes lower
- Ring finger: activates sustain mode (notes will continue to play until deactivated)

### Other Information
- For better results, move hands futher away from the camera
- Mouse input also works for all features
- Space bar can be used to activate / deactivate sustain mode

## Other Material
- P5.js documentation: https://p5js.org/reference/
- Google's Hand Tracking model documentation: https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker