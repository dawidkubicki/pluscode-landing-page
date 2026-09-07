"use client";

import { useEffect, useRef, useState } from "react";
import type { WebGLRenderer } from "three";

/**
 * The hero's surface: a sheet of lit, folded light lying under the headline.
 *
 * Stripe's hero is a plane whose vertices ride on slow noise while the
 * fragment shader blends four flat colour fields, then the whole canvas is
 * skewed and cut by a straight diagonal. This is the same family of object,
 * built the opposite way round for a dark page:
 *
 *  1. It is LIT, not painted. The vertex shader displaces a 160x90 plane with
 *     three octaves of simplex noise (the first one ridged, so the folds have
 *     creases rather than swells) and derives a normal from the height field
 *     by finite differences. The fragment shader then shades it like a
 *     surface: one hard key light with a tight specular so every crest gets a
 *     bright edge, a cyan rim where the surface swings away, and troughs that
 *     fall to real black. That is what makes it read as an object in a room
 *     rather than a blurred gradient.
 *
 *  2. It has a shape, not a cut. Depth fog dissolves the far side into the
 *     page, and in screen space a rounded box fitted to the text itself (the
 *     line boxes, not the column they are centred in) quiets the surface
 *     behind the words, fading back in over a fixed 170px. The light rises
 *     around the copy instead of under it, and on a mid-width viewport where
 *     the column is the whole band the surface still has room to be bright.
 *     No edge of the geometry is ever on screen.
 *
 *  3. Colour is the site's signal set, hard-coded because a shader cannot
 *     read a CSS token: electric blue (`lime`, #3366ff) and violet
 *     (`signal-violet`, #7c5cff) as the two pigments, cyan (`signal-cyan`,
 *     #22d3ee) for rim and highlights, and a coral (`signal-coral`, #ff5c7a)
 *     sweep that travels the diagonal once every ~18 seconds.
 *
 * Progressive enhancement, in the order a reader meets it: the CSS glow in
 * `.hm-glow` is server rendered and paints first. three.js is imported inside
 * the effect, never in the first bundle. The canvas fades in over 600ms only
 * after a frame has actually drawn, and a machine without WebGL simply keeps
 * the glow. Under `prefers-reduced-motion: reduce` no WebGL context is created
 * at all: the glow IS the hero.
 *
 * Budget: 14,401 vertices, nine noise evaluations each, all in the vertex
 * stage; the fragment shader is a handful of dot products and one hash. DPR is
 * capped at 1.5 (1 on a phone), the loop stops when the band leaves the
 * viewport or the tab is hidden, and everything is disposed on unmount.
 *
 * Legibility: `[data-hero-copy]` in hero.tsx is measured on every layout and
 * handed to the shader as the quiet zone, so the ground behind the subtext
 * and the avatar note is the page's own colour. Re-check the contrast if the
 * copy block or the palette changes.
 */

const SEG_X = 160;
const SEG_Y = 90;
const PLANE_W = 46;
const PLANE_D = 34;

/* the quiet zone: padding around the text box and the fade back to full
   surface, in CSS pixels */
const QUIET_PAD_X = 24;
const QUIET_PAD_Y = 30;
const QUIET_RADIUS = 90;
const QUIET_RAMP = 170;

/* speed of the noise field and of the coral sweep, in world units per second */
const SPEED = 0.11;
const SWEEP_PERIOD = 18;
const SWEEP_SPAN = 44;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uRidge;
varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vField;
varying float vDepth;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

// Ashima 2D simplex noise, the cheap one: no texture lookups, no branches.
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Three octaves. The first is ridged (1 - |n|) so the surface folds along
// creases instead of rolling in swells; the other two drift across it on
// their own headings so the field never reads as one scrolling texture.
float height(vec2 q) {
  float t = uTime;
  // the domain is turned 26 degrees and stretched along that axis, so the
  // creases are long ridges lying diagonally across the band, not bumps
  const float c = 0.8988, s = 0.4384;
  q = vec2(q.x * c - q.y * s, q.x * s + q.y * c) * vec2(0.5, 1.25);
  vec2 d0 = vec2(0.5, 0.42) * t;
  vec2 d1 = vec2(-0.26, 0.55) * t;
  vec2 d2 = vec2(0.44, -0.66) * t;
  float n0 = snoise(q * uFreq + d0);
  float ridge = 1.0 - abs(n0);
  ridge = pow(ridge, 1.6) * 2.0 - 1.0;
  float base = mix(n0, ridge, uRidge);
  float n1 = snoise(q * uFreq * 2.05 + vec2(3.7, -1.9) + d1) * 0.34;
  float n2 = snoise(q * uFreq * 4.3 + vec2(-5.2, 2.4) + d2) * 0.09;
  return base + n1 + n2;
}

void main() {
  vec3 p = position;
  const float e = 0.22;
  float h  = height(p.xz);
  float hx = height(p.xz + vec2(e, 0.0));
  float hz = height(p.xz + vec2(0.0, e));
  p.y += h * uAmp;
  vNormal = normalize(vec3(-(hx - h) * uAmp / e, 1.0, -(hz - h) * uAmp / e));
  vPos = p;
  // two slow, wide fields for the pigment mix; cheap to interpolate, so they
  // are computed here rather than per fragment
  vField = vec2(
    snoise(p.xz * 0.055 + vec2(uTime * 0.09, 11.0)),
    snoise(p.xz * 0.04 + vec2(-7.0, uTime * 0.07))
  );
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uSweep;
uniform vec3 uCam;
uniform vec2 uFog;
uniform vec4 uQuiet;
uniform vec2 uQuietShape; // corner radius, fade ramp (device px)
uniform float uGrain;
uniform float uGain;
varying vec3 vPos;
varying vec3 vNormal;
varying vec2 vField;
varying float vDepth;

// the site's signal set, sRGB as floats. Named after their tokens.
const vec3 BLUE   = vec3(0.200, 0.400, 1.000); // lime          #3366ff
const vec3 VIOLET = vec3(0.486, 0.361, 1.000); // signal-violet #7c5cff
const vec3 CYAN   = vec3(0.133, 0.827, 0.933); // signal-cyan   #22d3ee
const vec3 CORAL  = vec3(1.000, 0.361, 0.478); // signal-coral  #ff5c7a

float hash21(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(uCam - vPos);

  // ---- pigment: blue to violet across the field, one coral pocket ----
  float f = vField.x * 0.5 + 0.5;
  vec3 albedo = mix(BLUE, VIOLET, smoothstep(0.55, 0.95, f));
  float coral = smoothstep(0.7, 1.0, vField.y);
  albedo = mix(albedo, CORAL, coral * 0.3);

  // ---- light: one hard key from the upper left, a cyan rim from behind ----
  vec3 L = normalize(vec3(-0.78, 0.34, 0.5));
  float diff = max(dot(n, L), 0.0);
  diff = diff * diff * diff;
  vec3 H = normalize(L + v);
  float spec = pow(max(dot(n, H), 0.0), 64.0);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.6);

  // ---- the sweep: a soft diagonal bar of coral light crossing the field ----
  float s = dot(vPos.xz, normalize(vec2(1.0, -0.55)));
  float sweep = exp(-pow((s - uSweep) / 3.2, 2.0));

  vec3 col = albedo * (0.03 + diff * 1.3);
  col += mix(CYAN, albedo, 0.35) * fres * 0.5;
  col += mix(CYAN, vec3(1.0), 0.55) * spec * 1.0;
  col += mix(CORAL, vec3(1.0), 0.2) * sweep * (0.08 + diff * 0.5 + spec * 0.5);

  // ---- dissolve: depth fog to the page, plus a quiet zone behind the copy ----
  float fog = 1.0 - smoothstep(uFog.x, uFog.y, vDepth);
  // the far fade is ragged rather than a clean line: the pigment field eats
  // into it, so the horizon is torn light, not a gradient stop
  fog *= 1.0 - smoothstep(uFog.x * 0.75, uFog.y, vDepth + vField.y * 3.5);
  // signed distance in device pixels from the padded, round-cornered text
  // box: below zero anywhere on the words, full surface a fixed ramp away,
  // whatever the box's proportions
  vec2 dq = max(abs(gl_FragCoord.xy - uQuiet.xy) - (uQuiet.zw - uQuietShape.x), 0.0);
  float quiet = smoothstep(0.0, uQuietShape.y, length(dq) - uQuietShape.x);
  float mask = fog * quiet;

  // tone: a soft shoulder so the crests saturate instead of clipping to
  // white, then the darks pulled down so the troughs go to black on the page
  col = 1.0 - exp(-col * 1.5 * uGain);
  col = max(col - 0.03, 0.0) * 1.08;
  col += (hash21(gl_FragCoord.xy + fract(uTime * 0.37)) - 0.5) * uGrain;
  gl_FragColor = vec4(col, mask);
}
`;

const CSS = /* css */ `
.hm { position: absolute; inset: 0; overflow: hidden; }
.hm-glow, .hm-canvas { position: absolute; inset: 0; }
/* The server rendered layer. Four pooled fields in the signal colours, held
   to the lower half of the band so the copy above them keeps the page's own
   ground. On a machine without WebGL, or under reduced motion, this is the
   whole hero; once the canvas is up it stays underneath as an ambient wash. */
.hm-glow {
  background:
    radial-gradient(52% 38% at 50% 104%, rgba(51, 102, 255, 0.62) 0%, rgba(51, 102, 255, 0) 70%),
    radial-gradient(42% 34% at 16% 98%, rgba(124, 92, 255, 0.5) 0%, rgba(124, 92, 255, 0) 70%),
    radial-gradient(36% 28% at 86% 100%, rgba(34, 211, 238, 0.34) 0%, rgba(34, 211, 238, 0) 70%),
    radial-gradient(22% 16% at 66% 92%, rgba(255, 92, 122, 0.22) 0%, rgba(255, 92, 122, 0) 70%),
    radial-gradient(90% 40% at 50% 100%, rgba(51, 102, 255, 0.22) 0%, rgba(11, 12, 16, 0) 100%);
  transition: opacity 900ms ease;
}
@media (max-width: 760px) {
  /* a phone band is tall and the copy runs most of the way down it, so the
     pooled fields are held to the last third: measured, the note's ground
     otherwise brightens to 4.6:1 under reduced motion */
  .hm-glow {
    -webkit-mask-image: linear-gradient(180deg, transparent 64%, #000 80%);
    mask-image: linear-gradient(180deg, transparent 64%, #000 80%);
  }
}
.hm-glow::after {
  /* the glow's own sharpening: a hairline horizon so the fallback reads as a
     surface with an edge, not only a haze */
  content: "";
  position: absolute;
  inset: auto 0 0 0;
  height: 42%;
  background:
    linear-gradient(180deg, rgba(11, 12, 16, 0) 0%, rgba(11, 12, 16, 0) 60%, rgba(11, 12, 16, 0.55) 100%),
    repeating-linear-gradient(176deg, rgba(255, 255, 255, 0) 0 22px, rgba(138, 176, 255, 0.07) 22px 23px);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 45%, #000 100%);
  mask-image: linear-gradient(180deg, transparent 0%, #000 45%, #000 100%);
}
.hm[data-mesh="on"] .hm-glow { opacity: 0.2; }
.hm-canvas { opacity: 0; transition: opacity 600ms ease; }
.hm[data-mesh="on"] .hm-canvas { opacity: 1; }
.hm-canvas > canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
`;

/** The union of the line boxes of every run of text inside `el`, plus its
 *  buttons and images: the words themselves, not the column they are centred
 *  in. From 768px to about 1100px the column IS the band, and a zone sized to
 *  it put the surface out everywhere but a dim strip at the foot. */
function textBounds(el: HTMLElement): DOMRect | null {
  let l = Infinity;
  let t = Infinity;
  let r = -Infinity;
  let b = -Infinity;
  const add = (rc: DOMRect) => {
    if (!rc.width || !rc.height) return;
    l = Math.min(l, rc.left);
    t = Math.min(t, rc.top);
    r = Math.max(r, rc.right);
    b = Math.max(b, rc.bottom);
  };
  el.querySelectorAll("a, button, img").forEach((n) => add(n.getBoundingClientRect()));
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    const rects = range.getClientRects();
    for (let i = 0; i < rects.length; i++) add(rects[i]);
  }
  return Number.isFinite(l) ? new DOMRect(l, t, r - l, b - t) : null;
}

export default function HeroMesh({
  className = "",
  quiet = "[data-hero-copy]",
}: {
  className?: string;
  /** selector, resolved inside the parent section, of the block the surface must stay dark behind */
  quiet?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let teardown: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const lite = window.matchMedia("(pointer: coarse), (max-width: 760px)").matches;

      let renderer: WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: !lite,
          powerPreference: lite ? "default" : "high-performance",
        });
      } catch {
        return; // no WebGL: the CSS glow stays, and `ready` never flips
      }
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // the shader emits final sRGB
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1 : 1.5));
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.5, 80);
      camera.position.set(0, 3.7, 9.5);
      camera.lookAt(0, -0.5, -1.2);

      const U = {
        uTime: { value: 0 },
        uSweep: { value: 0 },
        uAmp: { value: 1.25 },
        uFreq: { value: 0.23 },
        uRidge: { value: 0.62 },
        uCam: { value: camera.position.clone() },
        uFog: { value: new THREE.Vector2(10.0, 24.0) },
        uQuiet: { value: new THREE.Vector4(-9999, -9999, 1, 1) },
        uQuietShape: { value: new THREE.Vector2(0, 1) },
        uGrain: { value: 0.045 },
        uGain: { value: 1 },
      };

      const geo = new THREE.PlaneGeometry(
        PLANE_W,
        PLANE_D,
        lite ? 108 : SEG_X,
        lite ? 60 : SEG_Y,
      );
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, 0, -PLANE_D / 2 + 11);
      const mat = new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader: VERT,
        fragmentShader: FRAG,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: true,
        depthTest: true,
      });
      scene.add(new THREE.Mesh(geo, mat));

      const section = container.closest("section") ?? container.parentElement;
      const copy = section?.querySelector<HTMLElement>(quiet) ?? null;

      const layout = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Portrait: the same field seen through a tall, narrow window. Open
        // the view and bring the fog in, or only a dim sliver of it is on
        // screen under the copy.
        const portrait = Math.min(1, Math.max(0, (1.1 - w / h) / 0.5));
        camera.fov = 38 + portrait * 24;
        camera.position.set(0, 3.7 - portrait * 1.2, 9.5 - portrait * 3.0);
        camera.lookAt(0, -0.5, -1.2);
        U.uCam.value.copy(camera.position);
        U.uFog.value.set(10.0 - portrait * 4.0, 24.0 - portrait * 9.0);
        U.uGain.value = 1 + portrait * 0.35;
        camera.updateProjectionMatrix();
        const dpr = renderer.getPixelRatio();
        const r = copy ? textBounds(copy) : null;
        if (r) {
          const c = container.getBoundingClientRect();
          const cx = r.left + r.width / 2 - c.left;
          const cy = r.top + r.height / 2 - c.top;
          // gl_FragCoord counts from the bottom left
          U.uQuiet.value.set(
            cx * dpr,
            (h - cy) * dpr,
            (r.width / 2 + QUIET_PAD_X) * dpr,
            (r.height / 2 + QUIET_PAD_Y) * dpr,
          );
          U.uQuietShape.value.set(QUIET_RADIUS * dpr, QUIET_RAMP * dpr);
        }
      };
      layout();
      const ro = new ResizeObserver(layout);
      ro.observe(container);
      if (copy) ro.observe(copy);

      let raf = 0;
      let started = 0;
      let announced = false;
      let onScreen = true;

      const draw = (now: number) => {
        if (!started) started = now;
        const t = (now - started) / 1000;
        // seeded past zero: the field at t=0 is a flat, uninteresting frame
        U.uTime.value = 23.0 + t * SPEED;
        // the sweep crosses the field from the far left to the near right and
        // rests a little past each edge, so it reads as a pass, not a loop
        const phase = ((t + 6) % SWEEP_PERIOD) / SWEEP_PERIOD;
        U.uSweep.value = -SWEEP_SPAN / 2 + phase * SWEEP_SPAN;
        renderer.render(scene, camera);
        if (!announced) {
          announced = true;
          setReady(true);
        }
      };
      const tick = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(tick);
      };
      const start = () => {
        if (raf || document.hidden || !onScreen) return;
        raf = requestAnimationFrame(tick);
      };
      const stop = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      const io = new IntersectionObserver(
        ([e]) => {
          onScreen = e.isIntersecting;
          if (onScreen) start();
          else stop();
        },
        { threshold: 0, rootMargin: "64px 0px" },
      );
      io.observe(container);
      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);
      const onLost = (e: Event) => {
        e.preventDefault();
        stop();
        setReady(false);
      };
      const onRestored = () => {
        announced = false;
        start();
      };
      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", onRestored);

      // one frame straight away, so the handover from the glow is a crossfade
      draw(performance.now());
      start();

      teardown = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", onRestored);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        if (canvas.parentElement === container) container.removeChild(canvas);
      };
      if (disposed) teardown();
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [quiet]);

  return (
    <div aria-hidden className={`hm ${className}`} data-mesh={ready ? "on" : undefined}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="hm-glow" />
      <div ref={host} className="hm-canvas" />
    </div>
  );
}
