# Invisible Piano

The **Invisible Piano** is a browser-based virtual instrument that allows users to play piano notes in mid-air using only their hands. By combining [p5.js](https://p5js.org/) with Google’s [Hand Landmarking Tracking AI model](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker), the application translates finger gestures into piano key presses—no physical keyboard required.

## Purpose

This project was developed as part of a **Creative Coding** course during the **Fall 2024** semester. The primary goal was to explore alternative user interactions through computer vision and gesture-based control, using modern JavaScript frameworks and creative libraries.

The project demonstrates how artificial intelligence can be applied in interactive art and music applications, and showcases the potential of hand-tracking technology in browser-based creative tools.

## Tech Stack

- **Programming Language**: JavaScript
- **Creative Coding Library**: [p5.js](https://p5js.org/)
- **Hand Tracking Model**: [Google's MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)
- **Markup**: HTML5
- **Other Tools**: WebGL (via p5.js), Webcam video input

## Features

- Play virtual piano notes by touching fingers to the thumb on your **playing hand**
- Use your **control hand** to:
  - Shift octaves up/down
  - Toggle sustain mode (notes continue playing)
- Visual feedback with active keys highlighted in yellow
- Mouse input support for accessibility
- Space bar toggles sustain mode without gestures
- Gesture-based two-hand interaction with no external devices

## Instructions

### Playing Hand

- The **first hand** to enter the camera’s view becomes the *playing hand*
- Touch your thumb to:
  - Pointer → plays lowest active note
  - Middle → plays a higher note
  - Ring → higher still
  - Pinky → plays the highest active note

### Control Hand

- The **second hand** in view becomes the *control hand*
- Touch your thumb to:
  - Pointer → shift notes to a higher octave
  - Middle → shift notes to a lower octave
  - Ring → toggle sustain mode (on/off)

## Tips for Best Performance

- Keep your hands visible and a bit farther from the camera for more reliable tracking
- Make deliberate gestures when touching fingers together
- Ensure good lighting conditions and minimal background clutter


## Installation & Setup

To run the Invisible Piano locally in your browser, follow these steps:

### 1. Install the Live Server Extension

You will need the **Live Server** extension for [Visual Studio Code](https://code.visualstudio.com/) (or any code editor that supports it):

1. Open VS Code
2. Go to the **Extensions** tab
3. Search for `Live Server` by Ritwick Dey
4. Click **Install**

### 2. Start the Live Server

1. Open the project folder in VS Code
2. Right-click the `index.html` file
3. Select **"Open with Live Server"**

This will launch the app in your default web browser. Make sure to allow camera access when prompted.

## Additional Resources

- [p5.js Documentation](https://p5js.org/reference/)
- [Google's Hand Landmarker Model](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker)

