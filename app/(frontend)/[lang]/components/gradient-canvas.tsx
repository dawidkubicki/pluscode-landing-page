"use client";

import { useEffect, useRef } from "react";

/**
 * Stripe-style "flowing silk" gradient background for the dark navy hero.
 *
 * Final synthesis of the two judged variants: variant A's domain-warped
 * ribbon field and WebGL infrastructure, with variant B's spatial masking
 * grafted on. Broad diagonal ribbons of emerald/teal drift from lower-left
 * toward upper-right; the color mass is anchored in the top-right while the
 * left ~third and the bottom sink to near-pure navy (#0a1929 -> #061220) so
 * the white headline sits on dark navy with only faint color wisps.
 * Rendered with raw WebGL 1, zero dependencies.
 */

const MAX_DPR = 1.5;
/** Shader time (seconds) used for the single frame under prefers-reduced-motion. */
const STATIC_TIME = 34.0;
/** Cap per-frame delta so background tabs / long frames never jump the animation. */
const MAX_FRAME_DELTA_MS = 100;

const VERTEX_SRC = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

// ---- Tuning knobs ---------------------------------------------------------
// Overall strength of the colored ribbon field. 1.0 keeps variant A's
// vividness in the top-right; lower toward 0.7 for a quieter hero.
const float INTENSITY = 1.0;
// Left edge (normalized x) where color starts rising. Lower values let the
// ribbons reach further left toward the headline; raise to shrink the field.
const float MASK_REACH = 0.32;
// Global motion multiplier. 1.0 is variant A's near-still drift; 1.6 makes
// the flow clearly perceptible within ~8 seconds while staying calm.
const float SPEED = 1.6;
// ---------------------------------------------------------------------------

// Sinless hash (Dave Hoskins style): stable on mediump-only GPUs.
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += amp * vnoise(p);
    p = r * p * 2.03 + vec2(11.7, 5.3);
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy / u_resolution;
  vec2 p = vec2(frag.x * u_resolution.x / u_resolution.y, frag.y);
  float t = u_time * SPEED;

  // Ribbons flow diagonally: rotate the frame by ~33 degrees.
  float ca = 0.8387;
  float sa = 0.5446;
  vec2 rp = mat2(ca, -sa, sa, ca) * p;

  // Broad, slow domain warp shapes the silk folds.
  vec2 q = vec2(
    fbm(rp * 0.8 + vec2(0.0, t * 0.026)),
    fbm(rp * 0.8 + vec2(4.7, 9.1) + vec2(-t * 0.021, 0.0))
  );
  vec2 wp = rp + (q - 0.5) * 1.25;

  // Lower fold frequency than variant A: broad brushed ribbons, not marble.
  float fold = fbm(wp * 1.25 + vec2(t * 0.016, -t * 0.011));

  // Band phase across the flow direction; drifts slowly along it.
  float phase = wp.y * 2.05 + fold * 1.05 - t * 0.07;
  float v = 0.5 + 0.5 * sin(phase);
  v = 0.72 * v + 0.28 * (0.5 + 0.5 * sin(phase * 0.5 + wp.x * 0.6 + 2.0));

  // Brushed-fiber texture, calmed to a finishing touch (about half of A's
  // frequency and amplitude so bands stay broad instead of marbled).
  float fiber = vnoise(vec2(wp.x * 2.2 + t * 0.05, wp.y * 90.0));
  fiber = 0.7 * fiber + 0.3 * vnoise(vec2(wp.x * 5.0 - t * 0.04, wp.y * 190.0));
  v = clamp(v + (fiber - 0.5) * 0.045, 0.0, 1.0);

  // Spatial mask grafted from variant B: multiplicative x/y ramps anchor the
  // color mass top-right while the left third and the bottom fall to navy.
  float mx = smoothstep(MASK_REACH, 0.88, frag.x);
  float my = smoothstep(0.02, 0.74, frag.y);
  float mask = mx * my;
  // Pull the brightest mass into the top-right corner.
  mask *= 0.55 + 0.45 * smoothstep(0.55, 1.55, frag.x + frag.y);
  // Organic edge: the fade reads as wisps, not a straight vignette.
  mask *= 0.72 + 0.40 * fbm(p * 1.1 + vec2(2.3, 7.7));
  // Faint floor so a whisper of teal can graze the headline zone.
  float wisp = 0.035 * smoothstep(0.08, 0.95, frag.x) * smoothstep(-0.10, 0.80, frag.y);
  mask = clamp(max(mask, wisp) * INTENSITY, 0.0, 1.0);

  // Cool blue undertone confined to the right half (tighter than variant A
  // so it cannot glow behind the headline).
  float under = smoothstep(0.35, 1.35, frag.x * 0.85 + frag.y * 0.45);

  vec3 navy = vec3(0.039, 0.098, 0.161);
  vec3 abyss = vec3(0.024, 0.071, 0.125);
  vec3 ocean = vec3(0.114, 0.306, 0.847);
  vec3 teal = vec3(0.078, 0.722, 0.651);
  vec3 emerald = vec3(0.063, 0.725, 0.506);
  vec3 mint = vec3(0.204, 0.827, 0.600);
  vec3 sky = vec3(0.055, 0.647, 0.914);

  // Blend in a gamma-ish space: square, mix, sqrt at the end.
  vec3 col = navy * navy;
  float skyBand = 0.5 + 0.5 * sin(phase * 0.37 + 4.2);
  col = mix(col, ocean * ocean, smoothstep(0.08, 0.55, v) * 0.22 * under);
  col = mix(col, sky * sky, smoothstep(0.35, 0.72, v) * skyBand * 0.30 * mask);
  col = mix(col, teal * teal, smoothstep(0.30, 0.66, v) * 0.72 * mask);
  col = mix(col, emerald * emerald, smoothstep(0.55, 0.88, v) * 0.85 * mask);
  col = mix(col, mint * mint, smoothstep(0.80, 1.00, v) * 0.45 * mask);

  // Sink the left and the bottom into deeper navy (#061220).
  float depth = 1.0 - smoothstep(0.05, 0.95, frag.x * 0.55 + frag.y * 0.75);
  col = mix(col, abyss * abyss, depth * 0.60);

  // Fiber sheen, subtle.
  col *= 1.0 + (fiber - 0.5) * 0.07 * mask;

  vec3 rgb = sqrt(max(col, 0.0));

  // Tiny animated dither kills banding on the long soft gradients.
  float dn = hash(gl_FragCoord.xy + vec2(fract(t * 0.31) * 61.0, fract(t * 0.17) * 83.0));
  rgb += (dn - 0.5) * (1.6 / 255.0);

  gl_FragColor = vec4(rgb, 1.0);
}
`;

export default function GradientCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) return; // no WebGL: the navy parent background is the fallback

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uResolution: WebGLUniformLocation | null = null;

    let rafId: number | null = null;
    let elapsed = 0;
    let lastFrameAt: number | null = null;
    let inView = true;
    let contextLost = false;
    let wantRestore = false;
    let disposed = false;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const destroyProgram = () => {
      if (program) {
        gl.deleteProgram(program);
        program = null;
      }
      if (buffer) {
        gl.deleteBuffer(buffer);
        buffer = null;
      }
      uTime = null;
      uResolution = null;
    };

    const build = (): boolean => {
      destroyProgram();
      const vs = compile(gl.VERTEX_SHADER, VERTEX_SRC);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC);
      if (!vs || !fs) {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        return false;
      }
      const prog = gl.createProgram();
      if (!prog) {
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return false;
      }
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS) && !gl.isContextLost()) {
        gl.deleteProgram(prog);
        return false;
      }
      const buf = gl.createBuffer();
      if (!buf) {
        gl.deleteProgram(prog);
        return false;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      // Single fullscreen triangle.
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.useProgram(prog);
      const aPos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      program = prog;
      buffer = buf;
      uTime = gl.getUniformLocation(prog, "u_time");
      uResolution = gl.getUniformLocation(prog, "u_resolution");
      return true;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const draw = (time: number) => {
      if (!program || contextLost) return;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const shouldAnimate = () =>
      !disposed &&
      !contextLost &&
      !reducedMotion &&
      inView &&
      !document.hidden &&
      program !== null;

    const tick = (now: number) => {
      rafId = null;
      if (!shouldAnimate()) {
        lastFrameAt = null;
        return;
      }
      if (lastFrameAt !== null) {
        elapsed += Math.min(now - lastFrameAt, MAX_FRAME_DELTA_MS) / 1000;
      }
      lastFrameAt = now;
      draw(elapsed);
      rafId = requestAnimationFrame(tick);
    };

    const syncLoop = () => {
      if (shouldAnimate()) {
        if (rafId === null) {
          lastFrameAt = null;
          rafId = requestAnimationFrame(tick);
        }
        return;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastFrameAt = null;
      // Reduced motion: present a single static frame instead of a loop.
      if (reducedMotion && !contextLost && program) draw(STATIC_TIME);
    };

    // A remount can reuse a canvas whose context a previous cleanup lost
    // (React StrictMode does exactly this): getContext() then returns the
    // same, still-lost context and every GL call is a silent no-op, leaving
    // an opaque white canvas over the hero. Detect that and drive a restore;
    // onContextRestored rebuilds the pipeline once the browser re-enables it.
    if (gl.isContextLost()) {
      contextLost = true;
      wantRestore = true;
      setTimeout(() => {
        if (!disposed && wantRestore && gl.isContextLost()) {
          wantRestore = false;
          gl.getExtension("WEBGL_lose_context")?.restoreContext();
        }
      }, 50);
    } else if (build()) {
      resize();
      draw(reducedMotion ? STATIC_TIME : 0);
    } else {
      destroyProgram();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      // Keep the presented frame correct while the loop is not running.
      if (!shouldAnimate() && !contextLost && program) {
        draw(reducedMotion ? STATIC_TIME : elapsed);
      }
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver((entries) => {
      const last = entries[entries.length - 1];
      if (last) inView = last.isIntersecting;
      syncLoop();
    });
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      syncLoop();
    };
    motionQuery.addEventListener("change", onMotionChange);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastFrameAt = null;
      // GL resources died with the context; drop the handles without delete calls.
      program = null;
      buffer = null;
      uTime = null;
      uResolution = null;
      // If we are waiting to recover from a loss inherited at mount, the
      // event has now been delivered (and defaulted-prevented), so a restore
      // request is legal from this point.
      if (wantRestore) {
        wantRestore = false;
        // Restore must be requested outside the contextlost handler.
        setTimeout(() => {
          if (!disposed && gl.isContextLost()) {
            gl.getExtension("WEBGL_lose_context")?.restoreContext();
          }
        }, 0);
      }
    };
    const onContextRestored = () => {
      contextLost = false;
      if (!build()) return;
      resize();
      draw(reducedMotion ? STATIC_TIME : elapsed);
      syncLoop();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    syncLoop();

    return () => {
      disposed = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (!gl.isContextLost()) destroyProgram();
      // Deliberately no loseContext() here: the same canvas (and context
      // object) can be handed to a next mount, which would then be stuck on a
      // dead context. The browser reclaims it with the canvas element.
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
