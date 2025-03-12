import { Line } from "./line.js";
import { Circle } from "./circle.js";

export class Star {
  constructor(nPoints, radius, offset = 1) {
    this.circle = new Circle(nPoints, radius);
    this.offset = offset;
    this.lines = this.generateLines();
    this.color = "#FFFFFF"; // Add default color
  }

  generateLines() {
    const nPoints = this.circle.points.length;
    const lines = [];
    for (let i = 0; i < nPoints; i++) {
      const neighbor = (i + this.offset) % nPoints;
      // Use the "target" coords for a stable angle at creation
      const angle = Math.atan2(
        this.circle.points[neighbor].targetY - this.circle.points[i].targetY,
        this.circle.points[neighbor].targetX - this.circle.points[i].targetX,
      );
      lines.push(new Line(this.circle.points[i], angle));
    }
    return lines;
  }

  rotateLines(angle) {
    for (let ln of this.lines) {
      ln.rotate(angle);
    }
  }

  update(ease = 0.1) {
    this.circle.update(ease);
    for (let ln of this.lines) {
      ln.update(ease);
    }
  }

  scale(factor) {
    this.circle.scale(factor);
  }

  dropPoints(nPoints) {
    this.circle.dropPoints(nPoints);
    // Re‐size the lines array to match fewer points
    this.lines = this.lines.slice(0, this.circle.points.length);
    this.angleEvenly();
  }

  addPoints(nPoints) {
    const oldCount = this.circle.points.length;
    this.circle.addPoints(nPoints);

    if (oldCount === 0) {
      this.lines = this.generateLines();
      return;
    }

    for (let i = 0; i < nPoints; i++) {
      const newLine = this.lines[i % oldCount].copy();
      // Attach it to the newly created point
      newLine.point = this.circle.points[oldCount + i];
      this.lines.push(newLine);
    }
    this.angleEvenly();
  }

  // Recompute each line's target angle so they're consistent
  angleEvenly() {
    const nPoints = this.circle.points.length;
    for (let i = 0; i < nPoints; i++) {
      const neighbor = (i + this.offset) % nPoints;
      const angle = Math.atan2(
        this.circle.points[neighbor].targetY - this.circle.points[i].targetY,
        this.circle.points[neighbor].targetX - this.circle.points[i].targetX,
      );
      this.lines[i].rotateTo(angle);
    }
  }

  setColor(color) {
    this.color = color;
    this.circle.setColor(color); // Pass the color to the circle
    this.lines.forEach((line) => line.setColor(color)); // Pass the color
  }

  draw(ctx) {
    // Draw lines
    ctx.beginPath();
    ctx.strokeStyle = this.color; // Use the color property
    ctx.lineWidth = 2;
    for (let ln of this.lines) {
      ln.draw(ctx, 10000); // forward
      ln.draw(ctx, 10000, -1); // backward
    }
    ctx.stroke();

    // Draw points (white)
    ctx.fillStyle = "white";
    this.circle.draw(ctx);
  }
}
