import { Point } from "./point.js";
import { Fractal, treeGenerator } from "./fractal.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Fullscreen the canvas
function resizeCanvas() {
  // Set the display size to match window size
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  // Set the resolution to be 1/4 of the display size
  canvas.width = window.innerWidth / 4;
  canvas.height = window.innerHeight / 4;

  // Disable image smoothing for crisp pixels
  ctx.imageSmoothingEnabled = false;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Create an initial star
const basePoint = new Point();
const level = 5;

let branches = 4;
const radius = 200;
const generator = treeGenerator(branches);
const growthFactor = 0.5;

const fractal = new Fractal(basePoint, level, radius, growthFactor, generator);

let time = 0;
let nextUpdate = 0;
const angularSpeed = 0.001;
let lastFrameTime = performance.now();

let rotation = 0;

// Color input
const colorInput = document.getElementById("colorInput");

// Function to validate hex color
function isValidHex(color) {
  return /^#[0-9A-F]{6}$/i.test(color);
}

// Function to update color
function updateColor(newColor) {
  if (isValidHex(newColor)) {
    fractal.setColor(newColor);
    colorInput.classList.remove("invalid");
  } else {
    colorInput.classList.add("invalid");
  }
}

// Initialize color input with current star color
colorInput.value = fractal.color || "#FFFFFF";

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

// Add input elements for branches and branchLength
const branchesInput = document.getElementById("branchesInput");
const radiusInput = document.getElementById("radiusInput");

// Initialize input values
branchesInput.value = branches;
radiusInput.value = radius;

// Add random button handlers
const randomBranchesBtn = document.getElementById("randomBranches");
const randomRadiusBtn = document.getElementById("randomLength");

// Random branches button handler
randomBranchesBtn.addEventListener("click", () => {
  const newBranches = Math.floor(Math.random() * 8) + 3; // Random between 3 and 10 branches
  branchesInput.value = newBranches;
  fractal.setGenerator(treeGenerator(newBranches));
});

// Random length button handler
randomRadiusBtn.addEventListener("click", () => {
  const newRadius = Math.floor(Math.random() * 140) + 60; // Random between 60 and 200
  radiusInput.value = newRadius;
  fractal.setRadius(newRadius);
});

// Handle branches input changes
branchesInput.addEventListener("input", (event) => {
  const newBranches = Math.min(
    Math.max(parseInt(event.target.value) || 2, 2),
    12,
  );
  branchesInput.value = newBranches; // Update input to valid value
  fractal.setGenerator(treeGenerator(newBranches));
});

// Handle branchLength input changes
radiusInput.addEventListener("input", (event) => {
  const newLength = Math.min(
    Math.max(parseInt(event.target.value) || 10, 10),
    200,
  );
  radiusInput.value = newLength; // Update input to valid value
  fractal.setRadius(newLength);
});

// Add level control
const levelInput = document.getElementById("levelInput");
const randomLevelBtn = document.getElementById("randomLevel");
const angleInput = document.getElementById("angleInput");
const randomAngleBtn = document.getElementById("randomAngle");
const growthFactorInput = document.getElementById("growthFactorInput");
const randomGrowthFactorBtn = document.getElementById("randomGrowthFactor");

// Initialize input values
levelInput.value = level;
growthFactorInput.value = growthFactor;

// Random growth factor button handler
randomGrowthFactorBtn.addEventListener("click", () => {
  const newGrowthFactor = (Math.random() * 0.8 + 0.1).toFixed(2); // Random between 0.1 and 0.9
  growthFactorInput.value = newGrowthFactor;
  fractal.setGrowthFactor(parseFloat(newGrowthFactor));
});

// Handle growth factor input changes
growthFactorInput.addEventListener("input", (event) => {
  const newGrowthFactor = Math.min(
    Math.max(parseFloat(event.target.value) || 0.1, 0.1),
    0.9,
  ).toFixed(2);
  growthFactorInput.value = newGrowthFactor;
  console.log(`newGrowthFactor`, newGrowthFactor);
  fractal.setGrowthFactor(parseFloat(newGrowthFactor));
});

// Random level button handler
randomLevelBtn.addEventListener("click", () => {
  const newLevel = Math.floor(Math.random() * 4) + 3; // Random between 3 and 6 levels
  levelInput.value = newLevel;
  fractal.setLevel(newLevel);
});

// Handle level input changes
levelInput.addEventListener("input", (event) => {
  const newLevel = Math.min(Math.max(parseInt(event.target.value) || 1, 1), 7);
  levelInput.value = newLevel; // Update input to valid value
  fractal.setLevel(newLevel);
});

randomAngleBtn.addEventListener("click", () => {
  const newAngle = Math.floor(Math.random() * 360);
  angleInput.value = newAngle;
  fractal.rotateTo((newAngle * Math.PI) / 180);
});

angleInput.addEventListener("input", (event) => {
  const newAngle = Math.min(
    Math.max(parseInt(event.target.value) || 0, 0),
    360,
  );
  angleInput.value = newAngle;
  const newAngleRad = (newAngle * Math.PI) / 180;
  console.log(`newAngleRad`, newAngleRad);
  fractal.rotateTo(newAngleRad);
});

function rotateAndPulse() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);

  const scaleX = 1 + Math.sin(rotation) * 0.1;
  const scaleY = 1 + Math.cos(rotation) * 0.1;
  ctx.scale(scaleX, scaleY);

  fractal.update(0.1);

  ctx.rotate(rotation);

  fractal.draw(ctx);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const debugInfo = [
    `Time: ${time}`,
    `Next update: ${nextUpdate}`,
    `Rotation: ${(rotation * (180 / Math.PI)).toFixed(1)}°`,
    `FPS: ${(1000 / (performance.now() - lastFrameTime)).toFixed(1)}`,
    `Scale: ${scaleX.toFixed(3)}`,
    `Canvas: ${canvas.width}x${canvas.height}`,
  ];
  debugInfo.forEach((text, i) => {
    ctx.fillText(text, 10, 10 + i * 20);
  });
  ctx.restore();

  lastFrameTime = performance.now();
  time += 1;

  rotation += angularSpeed;

  requestAnimationFrame(rotateAndPulse);
}

rotateAndPulse();
