// Convert Cartesian to polar (r, theta)
export function cartesianToPolar(x, y) {
  return {
    r: Math.sqrt(x * x + y * y),
    theta: Math.atan2(y, x),
  };
}

// Convert polar (r, theta) to Cartesian
export function polarToCartesian(r, theta) {
  return {
    x: r * Math.cos(theta),
    y: r * Math.sin(theta),
  };
}

// Return the difference (b - a) wrapped to [-π, π]
export function shortestAngleBetween(a, b) {
  return ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
}
