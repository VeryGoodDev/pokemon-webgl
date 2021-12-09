#version 300 es

in vec2 aPosition;
in vec2 aTexCoord;

uniform vec2 uResolution;

out vec2 vTexCoord;

vec2 toClipSpace(vec2 coord, vec2 res) {
  // Converts coord from pixels to a number between 0 and 1
  vec2 zeroToOne = coord / res;
  // Converts zeroToOne to a number between 0 and 2
  vec2 zeroToTwo = zeroToOne * 2.0;
  // Finally converts the result in zeroToTwo to a number between -1 and 1
  vec2 clipSpace = zeroToTwo - 1.0;
  // Negate the Y coord, to allow the shader caller to use the standard top/left origin common in games rendered in the browser
  return clipSpace * vec2(1, -1);
}

void main() {
  vec2 clipSpace = toClipSpace(aPosition, uResolution);
  // Now we set the position to be drawn by creating a vec4 using the clipSpace
  // vec2 we created, and then supplying 0 and 1 as defaults to always use for
  // the other coords (which we don't care about in 2D graphics)
  gl_Position = vec4(clipSpace, 0, 1);

  // Pass texture coord to frag shader
  vTexCoord = aTexCoord;
}
