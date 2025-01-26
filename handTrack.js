import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";
const demosSection = document.getElementById("demos");
let handLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;

// Wait to finish loading HandLandmarker class
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 2
    });
    demosSection.classList.remove("invisible");
};
createHandLandmarker();

/********************************************************************
// Google Hand Tracking Model
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
// Check if webcam access is supported.
const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
}
let lastVideoTime = -1;
let results = undefined;
console.log(video);
async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        if(results.landmarks.length == 0) {
            for(let i = 0; i < 28; i++) {
                releaseKey(i);
            }
        }
        for (let i = 0; i < results.landmarks.length; i++) {
            drawConnectors(canvasCtx, results.landmarks[i], HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            if(i == 0) {
                drawLandmarks(canvasCtx, results.landmarks[i], { color: "#FF0000", lineWidth: 2 });
            }
            if(i == 1) {
                drawLandmarks(canvasCtx, results.landmarks[i], { color: "#4275f5", lineWidth: 2 });
            }
            handleHands();
        }
    }
    canvasCtx.restore();
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}

/********************************************************************
// Handle Results of Hand Tracking
********************************************************************/

// Runs after ever frame and handles the results of the tracked hands
function handleHands() {
    let distance = 0.048;
    let playHand = 0;
    let handLength = calculateDistance(results.landmarks[playHand][0], results.landmarks[playHand][17]);
    if (handLength > 0.335 && handLength <= 0.42) {
        distance = 0.065;
    }
    else if(handLength > 0.42) {
        distance = 0.09;
    }
    if(calculateDistance(results.landmarks[playHand][4], results.landmarks[playHand][8]) < distance) {
        console.log("Playing hand: Touching pointer");
        pressKey((section * 4) + 0);
    } else {
        releaseKey((section * 4) + 0);
    }
    if(calculateDistance(results.landmarks[playHand][4], results.landmarks[playHand][12]) < distance) {
        console.log("Playing hand: Touching middle");
        pressKey((section * 4) + 1);
    } else {
        releaseKey((section * 4) + 1);
    }
    if(calculateDistance(results.landmarks[playHand][4], results.landmarks[playHand][16]) < distance) {
        console.log("Playing hand: Touching ring");
        pressKey((section * 4) + 2);
    } else {
        releaseKey((section * 4) + 2);
    }
    if(calculateDistance(results.landmarks[playHand][4], results.landmarks[playHand][20]) < distance) {
        console.log("Playing hand: Touching pinky");
        pressKey((section * 4) + 3);
    } else {
        releaseKey((section * 4) + 3);
    }
    if (results.landmarks.length > 1) {
        let controlHand = 1;
        if(calculateDistance(results.landmarks[controlHand][4], results.landmarks[controlHand][8]) < distance) {
            console.log("Control hand: Touching pointer");
            updateSectionUp();
        }
        if(calculateDistance(results.landmarks[controlHand][4], results.landmarks[controlHand][12]) < distance) {
            console.log("Control hand: Touching middle");
            updateSectionDown();
        }
        if(calculateDistance(results.landmarks[controlHand][4], results.landmarks[controlHand][16]) < distance) {
            console.log("Control hand: Touching ring");
            triggerSustain();
        }
    }
}

// Calculates the distance between point1 and point2 
function calculateDistance(point1, point2) {
    const x1 = point1.x;
    const y1 = point1.y;
    const x2 = point2.x;
    const y2 = point2.y;

    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
}