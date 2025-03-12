import { Point } from "./point.js";

export class Circle {
  constructor(nObjects, radius) {
    this.radius = radius;
    this.points = this.generatePoints(nObjects);
    this.color = "#FFFFFF"; // Add default color
  }

  generatePoints(nPoints) {
    const points = [];
    for (let i = 0; i < nPoints; i++) {
      const angle = (i * 2 * Math.PI) / nPoints;
      points.push(new Point(this.radius, angle));
    }
    return points;
  }

  update(ease = 0.1) {
    for (let p of this.points) {
      p.update(ease);
    }
  }

  scale(factor) {
    for (let p of this.points) {
      p.scale(factor);
    }
    this.radius *= factor;
  }

  rotate(angle) {
    for (let p of this.points) {
      p.rotate(angle);
    }
  }

  draw(ctx) {
    for (let p of this.points) {
      p.draw(ctx);
    }
  }

  addPoints(nPoints) {
    // If empty, just generate
    if (this.points.length === 0) {
      this.points = this.generatePoints(nPoints);
      return;
    }
    const oldCount = this.points.length;
    for (let i = 0; i < nPoints; i++) {
      this.points.push(this.points[i % oldCount].copy());
    }
    this.spaceEvenly();
  }

  dropPoints(nPoints) {
    nPoints = Math.min(nPoints, this.points.length);
    this.points.splice(this.points.length - nPoints, nPoints);
    this.spaceEvenly();
  }

  setColor(color) {
    this.color = color;
    this.points.forEach((point) => point.setColor(color));
  }

  // Reassign all existing points to be equally spaced again
  spaceEvenly() {
    const n = this.points.length;
    const ideal = this.generatePoints(n); // fresh set of "ideal" positions

    for (let i = 0; i < n; i++) {
      this.points[i].translateTo(ideal[i].x, ideal[i].y);
    }
  }
}
