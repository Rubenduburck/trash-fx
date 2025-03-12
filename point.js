import { cartesianToPolar, shortestAngleBetween } from "./utils.js";
import { EASE_THRESHOLD } from "./constants.js";

export class Point {
  constructor(r = 0, theta = 0) {
    // Store main polar coords
    this.r = r;
    this.theta = theta;

    // Store target polar coords (for easing)
    this.targetR = r;
    this.targetTheta = theta;

    this.color = "#FFFFFF"; // Add default color
  }

  // Getters for current Cartesian coordinates
  get x() {
    return this.r * Math.cos(this.theta);
  }
  get y() {
    return this.r * Math.sin(this.theta);
  }

  // Getters for target Cartesian coordinates
  get targetX() {
    return this.targetR * Math.cos(this.targetTheta);
  }
  get targetY() {
    return this.targetR * Math.sin(this.targetTheta);
  }

  copy() {
    const p = new Point(this.r, this.theta);
    p.targetR = this.targetR;
    p.targetTheta = this.targetTheta;
    return p;
  }

  setColor(color) {
    this.color = color;
  }

  rotate(angle) {
    this.targetTheta = this.theta + angle;
  }

  rotateTo(angle, radius = this.r) {
    this.targetTheta = angle;
    this.targetR = radius;
  }

  translate(dx, dy) {
    const newX = this.x + dx;
    const newY = this.y + dy;
    const { r, theta } = cartesianToPolar(newX, newY);
    this.targetR = r;
    this.targetTheta = theta;
  }

  // Move to absolute (x, y) => convert to polar
  translateTo(x, y) {
    const { r, theta } = cartesianToPolar(x, y);
    this.targetR = r;
    this.targetTheta = theta;
  }

  // Scale radius (relative to origin)
  scale(factor) {
    this.r *= factor;
    this.targetR *= factor;
  }

  // Easing update in polar space
  update(ease = 0.1) {
    // Shortest path for angle
    let angleDiff = shortestAngleBetween(this.theta, this.targetTheta);
    this.theta += angleDiff * ease;

    // Ease the radius
    this.r += (this.targetR - this.r) * ease;

    // Snap if very close
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    if (Math.abs(dx) < EASE_THRESHOLD && Math.abs(dy) < EASE_THRESHOLD) {
      this.r = this.targetR;
      this.theta = this.targetTheta;
    }
  }

  // Draw as a small circle (optional)
  draw(ctx) {
    //ctx.beginPath();
    //ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    //ctx.fill();
  }
}
