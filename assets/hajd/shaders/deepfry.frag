#pragma header

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform float saturation;
uniform vec3 luminance;
uniform float contrast;
uniform float noiseAmount;

vec3 deepfry(vec3 color) {
    // Increase saturation
    float intensity = dot(color, luminance);
    color = mix(vec3(intensity), color, saturation);

    // Increase contrast
    color = (color - 0.5) * contrast + 0.5;

    // Apply noise
    float noise = rand(openfl_TextureCoordv) * noiseAmount;
    color += noise;

    return color;
}

void main() {
    vec4 texColor = flixel_texture2D(bitmap, openfl_TextureCoordv);
    texColor.rgb = deepfry(texColor.rgb);
    gl_FragColor = texColor;
}
