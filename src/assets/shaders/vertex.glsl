#version 300 es

in vec2 aPosition;

uniform vec2 uResolution;

void main() {
  // Converts aPosition from pixels to a number between 0 and 1
  vec2 zeroToOne = aPosition / uResolution;
  // Converts zeroToOne to a number between 0 and 2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // Finally converts the result in zeroToTwo to a number between -1 and 1
  vec2 clipSpace = zeroToTwo - 1.0;
  // Now we set the position to be drawn by creating a vec4 using the clipSpace
  // vec2 we created, and then supplying 0 and 1 as defaults to always use for
  // the other coords (which we don't care about in 2D graphics)
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
