#pragma header

uniform float daTime;
uniform float strength;

void main() // shader by lunar lol (i can only code basic shaders :(( )
{
    vec2 uv = openfl_TextureCoordv.xy;

    uv.x += sin(daTime + (uv.y*4.0)) * 0.02 * strength;
    uv.y += cos(daTime + (uv.x*4.0)) * 0.02 * strength;

    gl_FragColor = flixel_texture2D(bitmap, uv);
}