import { Star } from "./star.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Fullscreen the canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// -----------------------------
// Easing function for adding points
// -----------------------------
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// -----------------------------
// Animate adding points onClick
// -----------------------------
function onClick(star) {
  const startPoints = star.circle.points.length;
  const totalToAdd = 200;
  const duration = 5000;
  const startTime = performance.now();

  function addPointsOverTime(now) {
    const elapsed = now - startTime;
    if (elapsed >= duration) {
      const currentPoints = star.circle.points.length;
      const missing = startPoints + totalToAdd - currentPoints;
      if (missing > 0) {
        star.addPoints(missing);
        star.angleEvenly?.();
      }
      return;
    }

    const progress = elapsed / duration;
    const eased = easeInOutCubic(progress);

    const targetPointCount = startPoints + Math.floor(totalToAdd * eased);
    const currentPoints = star.circle.points.length;
    if (currentPoints < targetPointCount) {
      star.addPoints(targetPointCount - currentPoints);
      star.angleEvenly?.();
    }

    requestAnimationFrame(addPointsOverTime);
  }

  requestAnimationFrame(addPointsOverTime);
}
canvas.addEventListener("click", () => onClick(star));

// -----------------------------
// Parallax Variables & Mouse Tracking
// -----------------------------
let parallaxX = 0;
let parallaxY = 0;
const PARALLAX_FACTOR = 0.001;

canvas.addEventListener("mousemove", (evt) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = evt.clientX - rect.left;
  const mouseY = evt.clientY - rect.top;

  // Shift in the opposite direction of mouse
  parallaxX = (canvas.width / 2 - mouseX) * PARALLAX_FACTOR;
  parallaxY = (canvas.height / 2 - mouseY) * PARALLAX_FACTOR;
});

// -----------------------------
// Handle point count changes
// -----------------------------
const pointsInput = document.getElementById("pointsInput");
const offsetInput = document.getElementById("offsetInput");
const randomPointsBtn = document.getElementById("randomPoints");
const randomOffsetBtn = document.getElementById("randomOffset");

// Function to update points
function updatePoints(newPoints) {
  if (newPoints >= 3) {
    const currentPoints = star.circle.points.length;
    if (newPoints > currentPoints) {
      star.addPoints(newPoints - currentPoints);
    } else if (newPoints < currentPoints) {
      star.dropPoints(currentPoints - newPoints);
    }
    // Update offset input max value and current value if needed
    const currentOffset = parseInt(offsetInput.value);
    if (currentOffset >= newPoints) {
      offsetInput.value = newPoints - 1;
      updateOffset(newPoints - 1);
    }
  }
}

// Function to update offset
function updateOffset(newOffset) {
  star.offset = newOffset;
  star.angleEvenly();
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create an initial star
const nPoints = 7;
const offset = 3;
const star = new Star(nPoints, 200, offset);

let angle = 0; // rotation angle for the whole scene
let time = 0;
let nextUpdate = 0;
const angularSpeed = 0.001;
let lastFrameTime = performance.now();

// Update input values to match initial state
pointsInput.value = star.circle.points.length;
offsetInput.value = star.offset;

// Handle input changes
pointsInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    updatePoints(parseInt(pointsInput.value));
  }
});

offsetInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    updateOffset(parseInt(offsetInput.value));
  }
});

// Handle random buttons
const MAX_POINTS = 200;
randomPointsBtn.addEventListener("click", () => {
  const newPoints = Math.floor(Math.random() * MAX_POINTS) + 3; // Random between 3 and 20
  pointsInput.value = newPoints;
  updatePoints(newPoints);
});

randomOffsetBtn.addEventListener("click", () => {
  const points = star.circle.points.length;
  const newOffset = Math.floor(Math.random() * (points - 1)) + 1; // Random between 1 and points-1
  offsetInput.value = newOffset;
  updateOffset(newOffset);
});

// Color input
const colorInput = document.getElementById("colorInput");

// Function to validate hex color
function isValidHex(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// Function to update color
function updateColor(newColor) {
  if (isValidHex(newColor)) {
    star.color = newColor;
    colorInput.classList.remove("invalid");
  } else {
    colorInput.classList.add("invalid");
  }
}

// Initialize color input with current star color
colorInput.value = star.color || "#FFFFFF";

// Handle color input changes
colorInput.addEventListener("input", (event) => {
  let color = event.target.value;
  // Add # if missing
  if (color.charAt(0) !== "#") {
    color = "#" + color;
    colorInput.value = color;
  }
  updateColor(color);
});

// Handle color input blur
colorInput.addEventListener("blur", (event) => {
  let color = event.target.value;
  // Add # if missing
  if (color.charAt(0) !== "#") {
    color = "#" + color;
  }
  // Pad with zeros if needed
  while (color.length < 7) {
    color += "0";
  }
  colorInput.value = color;
  updateColor(color);
});

// Function to generate random hex color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Add random color button handler
const randomColorBtn = document.getElementById("randomColor");
randomColorBtn.addEventListener("click", () => {
  const newColor = getRandomColor();
  colorInput.value = newColor;
  updateColor(newColor);
});

function rotateAndPulse() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  // Translate so that the scene is centered plus parallax offset
  ctx.translate(canvas.width / 2 + parallaxX, canvas.height / 2 + parallaxY);

  // Slight pulsing
  const scaleX = 1 + Math.sin(angle) * 0.1;
  const scaleY = 1 + Math.cos(angle) * 0.1;
  ctx.scale(scaleX, scaleY);

  // Update star
  star.update(0.1);

  // Then rotate the entire scene by 'angle'
  ctx.rotate(angle);

  // Draw star
  star.draw(ctx);

  // Cleanup transform
  ctx.restore();

  // Debug info
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const debugInfo = [
    `Time: ${time}`,
    `Next update: ${nextUpdate}`,
    `Angle: ${angle.toFixed(3)}`,
    `FPS: ${(1000 / (performance.now() - lastFrameTime)).toFixed(1)}`,
    `Scale: ${scaleX.toFixed(3)}`,
    `Canvas: ${canvas.width}x${canvas.height}`,
    `Points: ${star.circle.points.length}`,
    `Lines: ${star.lines.length}`,
  ];
  debugInfo.forEach((text, i) => {
    ctx.fillText(text, 10, 10 + i * 20);
  });
  ctx.restore();

  lastFrameTime = performance.now();
  time += 1;
  angle += angularSpeed;

  requestAnimationFrame(rotateAndPulse);
}

rotateAndPulse();
