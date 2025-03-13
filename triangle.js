import { Circle } from "./circle.js";

export class Triangle {
  constructor(points) {
    this.color = "#FFFFFF"; // Add default color
    if (!points || points.length !== 3) {
      this.points = new Circle(3, 100).points;
    } else {
      this.points = points;
    }
  }

  copy() {
    return new Triangle(this.points.map((p) => p.copy()));
  }

  draw(ctx, length, sign = 1) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    ctx.lineTo(this.points[1].x, this.points[1].y);
    ctx.lineTo(this.points[2].x, this.points[2].y);
    ctx.closePath();
    ctx.stroke();
  }

  rotate(angle) {
    this.points.forEach((p) => p.rotate(angle));
  }

  setColor(color) {
    this.color = color;
  }

  rotateTo(angle) {
    this.points.forEach((p) => p.rotateTo(angle));
  }

  update(ease = 0.1) {
    this.points.forEach((p) => p.update(ease));
  }

  scale(factor) {
    this.points.forEach((p) => p.scale(factor));
  }
}
