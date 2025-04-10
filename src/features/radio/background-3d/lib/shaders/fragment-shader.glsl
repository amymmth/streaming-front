uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;
uniform vec3 u_color6;

uniform float u_intensity;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;// Use a texture uniform

varying vec2 vUv;
varying float vDisplacement;

// Function to create a glowing effect
vec3 addGlow(vec3 color, float factor) {
    return color + factor * vec3(1.0, 1.0, 1.0);// Adds white to simulate glow
}

// Function to apply a simple blur effect
vec3 applyBlur(vec2 uv) {
    vec3 sum = vec3(0.0);
    float total = 0.0;
    float blurSize = 1.0 / u_resolution.y;// Controls the size of the blur

    // Loop through a grid of surrounding pixels
    for (float x = -2.0; x <= 2.0; x++) {
        for (float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * blurSize;
            sum += texture(u_texture, uv + offset).rgb;// Correctly sample from the texture
            total += 1.0;
        }
    }

    return sum / total;
}

void main() {
    float distort = 2.0 * vDisplacement * u_intensity * sin(vUv.y * 10.0 + u_time);

    vec3 color1 = u_color1;
    vec3 color2 = u_color2;
    vec3 color3 = u_color3;
    vec3 color4 = u_color4;
    vec3 color5 = u_color5;
    vec3 color6 = u_color6;

    vec3 color;
    if (vUv.y < 0.2) {
        color = mix(color1, color2, vUv.y * 5.0);
    } else if (vUv.y < 0.4) {
        color = mix(color2, color3, (vUv.y - 0.2) * 5.0);
    } else if (vUv.y < 0.6) {
        color = mix(color3, color4, (vUv.y - 0.4) * 5.0);
    } else if (vUv.y < 0.8) {
        color = mix(color4, color6, (vUv.y - 0.6) * 5.0);
    } else {
        color = mix(color6, color5, (vUv.y - 0.8) * 5.0);
    }

    color *= (1.0 - distort);// Apply distortion to color

    // Apply a glow effect
    float glowFactor = 0.5 + 0.5 * sin(u_time + vUv.y * 1.0);
    color = addGlow(color, glowFactor * u_intensity);

    // Apply the blur effect
    vec3 blurredColor = applyBlur(vUv);

    // Mix the blurred color with the original color to simulate a backdrop blur
    color = mix(color, blurredColor, 0.5);

    gl_FragColor = vec4(color, 1.0);
}
