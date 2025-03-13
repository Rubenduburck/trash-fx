import { Point } from "./point.js";
import { shortestAngleBetween } from "./utils.js";

/// Class representing a fractal
/// @param {Point} basePoint - The base point of the fractal
/// @param {number} level - The level of the fractal
/// @param {number} radius - The radius of the fractal
/// @param {function} generator - The function to generate children
export class Fractal {
  constructor(basePoint, level, radius, growthFactor, generator) {
    this.radius = radius;
    this.basePoint = basePoint;
    this.level = level;
    this.generator = generator;
    this.growthFactor = growthFactor;
    this.children = this.generator(this);
    this.color = "#FFFFFF"; // Add default color
  }

  rotate(angle) {
    this.basePoint.rotate(angle);
    const childAngle = this.basePoint.targetTheta + angle;
    for (let child of this.children) {
      child.rotate(childAngle);
    }
  }

  rotateTo(angle) {
    const diff = shortestAngleBetween(this.basePoint.targetTheta, angle);
    this.basePoint.rotateTo(diff);
    const childAngle = this.basePoint.targetTheta + diff;
    for (let child of this.children) {
      child.rotateTo(childAngle);
    }
  }

  setColor(color) {
    this.color = color;
  }

  update(ease = 0.1) {
    this.basePoint.update(ease);
    for (let child of this.children) {
      child.update(ease);
    }
  }

  scale(factor) {
    this.basePoint.scale(factor);
    for (let child of this.children) {
      child.scale(factor);
    }
  }

  contract(factor) {
    this.level -= Math.min(this.level, factor);
    if (this.level === 0) {
      this.children = [];
    }
    for (let child of this.children) {
      child.contract(factor);
    }
  }

  extend(factor) {
    this.level += factor;
    if (this.level === 0) {
      return;
    }
    if (this.children.length === 0) {
      this.children = this.generator(this);
    } else {
      for (let child of this.children) {
        child.extend(factor);
      }
    }
  }

  setGenerator(generator) {
    this.generator = generator;
    this.children = this.generator(this);
  }

  setRadius(radius) {
    this.radius = radius;
    for (let child of this.children) {
      child.setRadius(radius);
    }
    this.children = this.generator(this);
  }

  setLevel(level) {
    const diff = level - this.level;
    if (diff > 0) {
      this.extend(diff);
    } else {
      this.contract(-diff);
    }
  }

  setGrowthFactor(growthFactor) {
    const scale = growthFactor / this.growthFactor;
    this.scale(scale);
    this.growthFactor = growthFactor;
    for (let child of this.children) {
      child.setGrowthFactor(growthFactor);
    }
  }

  draw(ctx, basePoint = this.basePoint) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    for (let child of this.children) {
      const childBasePoint = child.basePoint.copy();
      childBasePoint.translate(basePoint.targetX, basePoint.targetY);
      ctx.beginPath();
      ctx.moveTo(basePoint.targetX, basePoint.targetY);
      ctx.lineTo(childBasePoint.targetX, childBasePoint.targetY);
      ctx.stroke();
      child.draw(ctx, childBasePoint);
    }
  }
}

export function treeGenerator(branches) {
  return (f) => {
    if (f.level === 0) {
      return [];
    }
    const nextLevel = f.level - 1;
    const nextRadius = f.radius * f.growthFactor;

    const children = [];
    for (let i = 0; i < branches; i++) {
      const angle = (i * 2 * Math.PI) / branches;
      const newPoint = new Point(nextRadius, angle);
      const fractal = new Fractal(
        newPoint,
        nextLevel,
        nextRadius,
        f.growthFactor,
        f.generator,
      );
      children.push(fractal);
    }
    return children;
  };
}
