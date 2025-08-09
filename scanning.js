const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");
const statusText = document.getElementById("status");
setTimeout(() =>  {
          window.location.replace("result.html");
}, 5000);

let faceDetected = false;
let detectionStartTime = null;

(async function init() {
  const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ]);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    video.srcObject = stream;

    // Add error handling for video
    video.onerror = (err) => {
      console.error("Video error:", err);
    };

    // Wait for video to be ready
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });

    statusText.textContent = "Camera ready...";
  } catch (err) {
    console.error("Error setting up video:", err);
    statusText.textContent = "Error accessing camera";
  }

  const sampleImg = await faceapi.fetchImage(
    "https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/Elon%20Musk/1.jpg"
  );
  const sampleDetection = await faceapi
    .detectSingleFace(sampleImg, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  const labeledDescriptors = [
    new faceapi.LabeledFaceDescriptors("Elon Musk", [
      sampleDetection.descriptor,
    ]),
  ];
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

  video.addEventListener("play", () => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(overlay, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (resizedDetections.length > 0) {
        if (!faceDetected) {
          faceDetected = true;
          detectionStartTime = Date.now();
          statusText.textContent = "Face detected! Hold still...";
        }

        resizedDetections.forEach((d) => {
          // Draw animated square
          ctx.strokeStyle = "#00ff00";
          ctx.lineWidth = 3;

          // Calculate animation
          const time = Date.now();
          const animationOffset = Math.sin(time * 0.01) * 5;

          // Draw the square with animation
          ctx.beginPath();
          ctx.rect(
            d.detection.box.x - animationOffset,
            d.detection.box.y - animationOffset,
            d.detection.box.width + animationOffset * 2,
            d.detection.box.height + animationOffset * 2
          );
          ctx.stroke();

          // Add corners for better visual effect
          const cornerLength = 20;
          const corners = [
            { x: d.detection.box.x, y: d.detection.box.y }, // Top-left
            {
              x: d.detection.box.x + d.detection.box.width,
              y: d.detection.box.y,
            }, // Top-right
            {
              x: d.detection.box.x,
              y: d.detection.box.y + d.detection.box.height,
            }, // Bottom-left
            {
              x: d.detection.box.x + d.detection.box.width,
              y: d.detection.box.y + d.detection.box.height,
            }, // Bottom-right
          ];

          corners.forEach((corner) => {
            ctx.beginPath();
            ctx.moveTo(corner.x - cornerLength, corner.y);
            ctx.lineTo(corner.x, corner.y);
            ctx.lineTo(corner.x, corner.y - cornerLength);
            ctx.stroke();
          });
        });

        // Check if face has been detected for 2 seconds
        if (detectionStartTime && Date.now() - detectionStartTime > 2000) {
          window.location.replace("result.html");
        }
      } else {
        faceDetected = false;
        detectionStartTime = null;
        statusText.textContent = "Position your face in the camera";
      }
    }, 200);
  });
})();
