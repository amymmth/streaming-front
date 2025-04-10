uniform float u_time;
uniform float u_intensity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;
uniform vec3 u_color6;
uniform vec3 u_color7;
uniform vec3 u_color8;
uniform vec3 u_color9;
uniform vec2 u_resolution;

vec4 radialGradient(vec2 uv, vec2 center, vec3 color, float radius) {
    float dist = length(uv - center);
    float intensity = smoothstep(-0.65, radius, dist);
    return vec4(color * (1.0 - intensity), 1.0 - intensity);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    // Увеличиваем яркость каждого градиента в зависимости от u_intensity
    float brightness = mix(0.4, 0.6, (u_intensity));

    color += radialGradient(uv, vec2(1, 0), u_color1 * brightness, (0.6 + .15)).rgb;
    color += radialGradient(uv, vec2(0.51, 0.0), u_color6 * brightness, (0.5)).rgb;
    color += radialGradient(uv, vec2(0.61, 1.0), u_color2 * brightness, (0.2 + .15)).rgb;
    color += radialGradient(uv, vec2(0.44, 0.44), u_color3 * brightness, (0.3 + .55)).rgb;
    color += radialGradient(uv, vec2(0.3, 0.87), u_color4 * brightness, (0.3 + .15)).rgb;
    color += radialGradient(uv, vec2(0.99, 0.98), u_color5 * brightness, (0.3 + .15)).rgb;
    color += radialGradient(uv, vec2(0.0, 0.0), u_color9 * brightness, (0.5 + .15)).rgb;

    gl_FragColor = vec4(color, 1.0);
}
