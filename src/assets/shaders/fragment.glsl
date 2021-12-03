#version 300 es

precision highp float;

// This is the texture
uniform sampler2D uImage;

// Incoming texture coords from vertex shader
in vec2 vTexCoord;

out vec4 outColor;

void main() {
  // This gets the color for the current pixel from the texture
  outColor = texture(uImage, vTexCoord);
}
