import * as THREE from "three";
import { Effect, EffectAttribute } from "postprocessing";

const SKETCH_FRAGMENT = /* glsl */ `
uniform float uSketchAmount;
uniform vec3 uRevealCenter;
uniform float uRevealRadius;
uniform float uSkyReveal;
uniform mat4 uInvProjectionMatrix;
uniform mat4 uCameraMatrixWorld;

float sketchLuma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float sketchHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = fract(sin(dot(i, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n100 = fract(sin(dot(i + vec3(1.0, 0.0, 0.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n010 = fract(sin(dot(i + vec3(0.0, 1.0, 0.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n110 = fract(sin(dot(i + vec3(1.0, 1.0, 0.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n001 = fract(sin(dot(i + vec3(0.0, 0.0, 1.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n101 = fract(sin(dot(i + vec3(1.0, 0.0, 1.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n011 = fract(sin(dot(i + vec3(0.0, 1.0, 1.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float n111 = fract(sin(dot(i + vec3(1.0, 1.0, 1.0), vec3(127.1, 311.7, 74.7))) * 43758.5453);
  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);
  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);
  return mix(nxy0, nxy1, f.z);
}

vec3 reconstructViewPos(vec2 uv, float d) {
  vec4 ndc = vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
  vec4 vp = uInvProjectionMatrix * ndc;
  return vp.xyz / max(vp.w, 1e-5);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  vec3 paperCol = vec3(0.984, 0.965, 0.933); // #FBF6EE
  vec3 inkCol   = vec3(0.169, 0.133, 0.188); // #2B2230
  vec3 washCol  = vec3(1.0, 0.788, 0.839);   // #FFC9D6 soft watercolor edge

  bool isSky = depth >= 0.9999;

  // Rebuild world position from depth
  vec3 viewPos = reconstructViewPos(uv, depth);
  vec3 worldPos = (uCameraMatrixWorld * vec4(viewPos, 1.0)).xyz;

  // Edge detection on depth & color luminance (~1.5px)
  vec2 off = texelSize * 1.45;
  float dL = readDepth(uv - vec2(off.x, 0.0));
  float dR = readDepth(uv + vec2(off.x, 0.0));
  float dU = readDepth(uv + vec2(0.0, off.y));
  float dD = readDepth(uv - vec2(0.0, off.y));

  float zC = -viewPos.z;
  float zL = -reconstructViewPos(uv - vec2(off.x, 0.0), dL).z;
  float zR = -reconstructViewPos(uv + vec2(off.x, 0.0), dR).z;
  float zU = -reconstructViewPos(uv + vec2(0.0, off.y), dU).z;
  float zD = -reconstructViewPos(uv - vec2(0.0, off.y), dD).z;

  // Second-order depth Laplacian catches creases and silhouettes cleanly
  float depthEdge = abs(zL + zR - 2.0 * zC) + abs(zU + zD - 2.0 * zC);
  float silEdge = max(abs(zL - zR), abs(zU - zD));

  vec3 cL = texture2D(inputBuffer, uv - vec2(off.x, 0.0)).rgb;
  vec3 cR = texture2D(inputBuffer, uv + vec2(off.x, 0.0)).rgb;
  vec3 cU = texture2D(inputBuffer, uv + vec2(0.0, off.y)).rgb;
  vec3 cD = texture2D(inputBuffer, uv - vec2(0.0, off.y)).rgb;
  float lC = sketchLuma(inputColor.rgb);
  float lDiff = max(
    abs(sketchLuma(cL) - sketchLuma(cR)),
    abs(sketchLuma(cU) - sketchLuma(cD))
  );

  float edgeStrength = smoothstep(0.14, 0.45, depthEdge * 1.2 + silEdge * 0.32)
                     + smoothstep(0.16, 0.36, lDiff) * 0.55;
  edgeStrength = clamp(edgeStrength, 0.0, 1.0);
  if (isSky) edgeStrength = 0.0;

  // Pencil cross-hatching by luminance bands
  vec2 px = uv * resolution;
  float wobbleLine = noise3(vec3(px * 0.03, 1.0)) * 2.0;
  float h1 = abs(fract((px.x + px.y + wobbleLine) * 0.14) - 0.5);
  float h2 = abs(fract((px.x - px.y - wobbleLine) * 0.14) - 0.5);

  float hatch = 0.0;
  if (!isSky) {
    if (lC < 0.48) {
      hatch += (1.0 - smoothstep(0.04, 0.16, h1)) * 0.42;
    }
    if (lC < 0.24) {
      hatch += (1.0 - smoothstep(0.04, 0.16, h2)) * 0.38;
    }
  }

  // Subtle static paper grain
  float grain = (sketchHash(floor(px * 0.75)) - 0.5) * 0.045;
  vec3 sketchCol = paperCol + grain;
  sketchCol = mix(sketchCol, inkCol, clamp(hatch + edgeStrength * 0.92, 0.0, 0.96));

  // World-space reveal sphere with noise-wobbled ~1.5-block watercolor edge
  float reveal = 0.0;
  float edgeWash = 0.0;
  if (isSky) {
    reveal = uSkyReveal;
  } else if (uRevealRadius > 0.05) {
    float n = (noise3(worldPos * 0.55) - 0.5) * 1.75;
    float dist = distance(worldPos, uRevealCenter) + n;
    reveal = 1.0 - smoothstep(uRevealRadius - 1.5, uRevealRadius + 0.35, dist);
    edgeWash = smoothstep(uRevealRadius - 2.2, uRevealRadius - 0.8, dist) * (1.0 - reveal);
  }

  float colorMix = mix(1.0, reveal, uSketchAmount);
  vec3 outRgb = mix(sketchCol, inputColor.rgb, colorMix);
  outRgb = mix(outRgb, washCol, edgeWash * 0.38 * uSketchAmount);

  outputColor = vec4(outRgb, inputColor.a);
}
`;

export class SketchEffectImpl extends Effect {
  private cameraRef: THREE.Camera | null = null;

  constructor() {
    super("SketchEffect", SKETCH_FRAGMENT, {
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map<string, THREE.Uniform<unknown>>([
        ["uSketchAmount", new THREE.Uniform(1.0)],
        ["uRevealCenter", new THREE.Uniform(new THREE.Vector3(0, 0.5, 0))],
        ["uRevealRadius", new THREE.Uniform(0.0)],
        ["uSkyReveal", new THREE.Uniform(0.0)],
        ["uInvProjectionMatrix", new THREE.Uniform(new THREE.Matrix4())],
        ["uCameraMatrixWorld", new THREE.Uniform(new THREE.Matrix4())],
      ]),
    });
  }

  setCamera(camera: THREE.Camera) {
    this.cameraRef = camera;
  }

  setReveal(radius: number, skyReveal: number, center: THREE.Vector3, sketchAmount = 1.0) {
    (this.uniforms.get("uRevealRadius") as THREE.Uniform<number>).value = radius;
    (this.uniforms.get("uSkyReveal") as THREE.Uniform<number>).value = skyReveal;
    (this.uniforms.get("uRevealCenter") as THREE.Uniform<THREE.Vector3>).value.copy(center);
    (this.uniforms.get("uSketchAmount") as THREE.Uniform<number>).value = sketchAmount;
  }

  override update() {
    if (!this.cameraRef) return;
    (this.uniforms.get("uInvProjectionMatrix") as THREE.Uniform<THREE.Matrix4>).value.copy(
      this.cameraRef.projectionMatrixInverse,
    );
    (this.uniforms.get("uCameraMatrixWorld") as THREE.Uniform<THREE.Matrix4>).value.copy(
      this.cameraRef.matrixWorld,
    );
  }
}
