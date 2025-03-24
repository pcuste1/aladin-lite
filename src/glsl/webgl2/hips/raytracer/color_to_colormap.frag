#version 300 es
precision lowp float;
precision lowp sampler2DArray;
precision lowp sampler2DArray;
precision lowp isampler2DArray;
precision mediump int;

in vec3 frag_pos;
in vec2 out_clip_pos;
out vec4 out_frag_color;

struct Tile {
    int uniq; // Healpix cell
    int texture_idx; // Index in the texture buffer
    float start_time; // Absolute time that the load has been done in ms
    float empty;
};

uniform Tile textures_tiles[12];

uniform float opacity;
uniform sampler2DArray tex;

#include ../color.glsl;
#include ../../projection/hpx_proj.glsl;

vec4 get_tile_color(vec3 pos) {
    HashDxDy result = hash_with_dxdy(0, pos.zxy);

    int idx = result.idx;
    vec2 uv = vec2(result.dy, result.dx);
    Tile tile = textures_tiles[idx];

    vec2 offset = uv;
    vec3 UV = vec3(offset, float(tile.texture_idx));

    float value = mix(get_pixels(UV).r, 0.0, tile.empty);
    return apply_colormap_to_grayscale(value);
}

void main() {
    vec4 c = get_tile_color(normalize(frag_pos));
    out_frag_color = c;
    out_frag_color.a = out_frag_color.a * opacity;
}