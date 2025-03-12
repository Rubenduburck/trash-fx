export function drawRepeatedText(ctx, text, rotationAngle, textRadius) {
  // Rotate in the opposite direction
  // (If your star is rotating angle clockwise, -angle is the opposite)
  ctx.rotate(2 * rotationAngle);

  // Pick a font & style
  ctx.fillStyle = "white";
  ctx.font = "bold 28px MedievalSharp";  
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Choose how large the circular path is
  const repetitions = 2; // how many times to repeat "VERTIGO" around circle
  const fullText = text.repeat(repetitions);

  // We'll place each character around 360°
  // so total chars = fullText.length get spread out
  // by 2π (360 degrees).
  const totalChars = fullText.length;

  for (let i = 0; i < totalChars; i++) {
    // fraction of the circle for this char
    const fraction = i / totalChars;
    const theta = fraction * 2 * Math.PI;

    // Save, rotate to the correct angle, then translate outward
    ctx.save();
    ctx.rotate(theta);
    ctx.translate(0, -textRadius);
    // If you'd like the text upright instead of tangential, comment out this rotation:
    // ctx.rotate(-theta);

    // Draw the character
    const ch = fullText[i];
    ctx.fillText(ch, 0, 0);

    // restore for next character
    ctx.restore();
  }

  ctx.restore();
}
