import { EASE_THRESHOLD } from "./constants.js";
import { shortestAngleBetween } from "./utils.js";

export class Line {
  constructor(point, angle = 0) {
    this.point = point;
    this.angle = angle;
    this.targetAngle = angle;
    this.color = "#FFFFFF"; // Add default color
  }

  copy() {
    return new Line(this.point.copy(), this.angle);
  }

  draw(ctx, length, sign = 1) {
    const x1 = this.point.x;
    const y1 = this.point.y;
    const x2 = x1 + sign * length * Math.cos(this.angle);
    const y2 = y1 + sign * length * Math.sin(this.angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  rotate(angle) {
    this.targetAngle += angle;
  }

  setColor(color) {
    this.color = color;
  }

  rotateTo(angle) {
    const diff = shortestAngleBetween(this.angle, angle);
    this.targetAngle = this.angle + diff;
  }

  update(ease = 0.1) {
    const diff = this.targetAngle - this.angle;
    if (Math.abs(diff) < EASE_THRESHOLD) {
      this.angle = this.targetAngle;
      return;
    }
    this.angle += diff * ease;
  }

  scale(factor) {
    // We only scale the point's position, not the angle
    this.point.scale(factor);
  }
}
