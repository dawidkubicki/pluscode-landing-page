"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * The capabilities stage: ONE three.js object with five states.
 *
 * Two thousand thin sheets in one InstancedMesh. Every capability is a set of
 * target positions, orientations, sizes and colours for those same sheets,
 * and changing the active tab lerps every instance to its new target over
 * 900ms with a per-instance stagger, so the picture morphs instead of
 * swapping. The five pictures, index aligned with `services.items`:
 *
 *   0  a loose cloud of sheets on the left, tidy stacks on the right, and a
 *      stream of sheets flying from one to the other (paperwork automation)
 *   1  a dim field of documents, one lit cluster, and a path of light from a
 *      single point to it that carries a bead in and back (answers with a
 *      source)
 *   2  the sheets snap into a cubic lattice: a bright frame with fine parts
 *      inside, and a plane of light running through it (software)
 *   3  a dense core with rings around it that light up outward in turn
 *      (a first version, then grown)
 *   4  the sheets settle onto a rising curved surface with one bright line
 *      fitted along it that dissolves into a wider band past the edge of the
 *      known numbers (forecasting)
 *
 * Per-frame cost is kept to one draw call. Instance matrices are rebuilt on
 * the CPU only while a morph is running (and for the eighty travelling sheets
 * in state 0). The idle drift and every light effect live in the vertex
 * shader, driven by one time uniform, so at rest the CPU touches nothing.
 *
 * The CSS glow underneath paints first and stays. three.js is imported
 * dynamically inside the effect, the canvas fades in only once a frame has
 * drawn, and under `prefers-reduced-motion: reduce` (or with no WebGL) no
 * context is created: a static SVG of the same layout stands in.
 */

type V3 = [number, number, number];
type Q4 = [number, number, number, number];
type Three = typeof import("three");
type Rand = () => number;

/* ------------------------------------------------------------------ *
 *  Tunables
 * ------------------------------------------------------------------ */
const N = 2000;
const N_STATIC = 640;
/** The sheet: an A-series page lying flat, 0.42 wide, 0.03 thick, 0.30 deep. */
const SHEET: V3 = [0.42, 0.03, 0.3];
/** Bounding box the framing fits into, in scene units. */
const OBJ_W = 11;
const OBJ_H = 6.2;
const MORPH_MS = 900;
const STAGGER_MS = 340;
const FOV = 30;

/* Palette. Hard-coded hex per the brief; token names alongside. */
const BLUE: V3 = [0.2, 0.4, 1.0]; // lime #3366ff, the accent
const CYAN: V3 = [0.133, 0.827, 0.933]; // signal-cyan #22d3ee
const VIOLET: V3 = [0.486, 0.361, 1.0]; // signal-violet #7c5cff
const WHITE: V3 = [0.9, 0.95, 1.0];

/* ------------------------------------------------------------------ *
 *  Small maths, no three.js needed (the static SVG uses these too)
 * ------------------------------------------------------------------ */
function rng(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: Rand) => (r() + r() + r() - 1.5) * 1.15;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const mix3 = (a: V3, b: V3, t: number): V3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const mul3 = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dist3 = (a: V3, b: V3) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function randDir(r: Rand): V3 {
  const z = r() * 2 - 1;
  const a = r() * Math.PI * 2;
  const s = Math.sqrt(1 - z * z);
  return [Math.cos(a) * s, Math.sin(a) * s, z];
}
const qAxis = (ax: number, ay: number, az: number, ang: number): Q4 => {
  const s = Math.sin(ang / 2);
  return [ax * s, ay * s, az * s, Math.cos(ang / 2)];
};
const qMul = (a: Q4, b: Q4): Q4 => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
/** yaw about Y, then pitch about X, then roll about Z. */
const qEuler = (yaw: number, pitch: number, roll: number): Q4 =>
  qMul(qMul(qAxis(0, 1, 0, yaw), qAxis(1, 0, 0, pitch)), qAxis(0, 0, 1, roll));
/** Shortest rotation taking +Y onto the unit vector `n`. */
function qUpTo(n: V3): Q4 {
  const d = Math.max(-1, Math.min(1, n[1]));
  const ax = n[2];
  const az = -n[0];
  const l = Math.hypot(ax, az);
  if (l < 1e-6) return [0, 0, 0, 1];
  return qAxis(ax / l, 0, az / l, Math.acos(d));
}
const cube = (size: number): V3 => [
  size / SHEET[0],
  size / SHEET[1],
  size / SHEET[2],
];

/* ------------------------------------------------------------------ *
 *  Layouts
 * ------------------------------------------------------------------ */
type Flow = {
  a: V3;
  k: V3;
  b: V3;
  q0: Q4;
  phase: number;
  speed: number;
};
type Item = {
  p: V3;
  q: Q4;
  s: V3;
  c: V3;
  glow: number;
  drift: number;
  /** 0..1 along a lit path, or -1. Read by the shader for the beads. */
  path: number;
  flow?: Flow;
};
type Layout = {
  pos: Float32Array;
  quat: Float32Array;
  scale: Float32Array;
  color: Float32Array;
  glow: Float32Array;
  drift: Float32Array;
  path: Float32Array;
  flows: (Flow & { i: number })[];
};

/** 0. Loose cloud on the left, tidy stacks on the right. */
function layoutPaper(n: number, r: Rand): Item[] {
  const items: Item[] = [];
  const nCloud = Math.round(n * 0.55);
  const nFlow = Math.min(80, Math.round(n * 0.04));
  const nStack = n - nCloud;
  const cols = 5;
  const rows = 3;
  const stacks = cols * rows;
  const weights = Array.from({ length: stacks }, () => 0.55 + r() * 0.9);
  const wsum = weights.reduce((a, b) => a + b, 0);
  const tops: V3[] = [];
  let used = 0;
  for (let k = 0; k < stacks; k++) {
    const h =
      k === stacks - 1 ? nStack - used : Math.round((weights[k] / wsum) * nStack);
    used += h;
    const col = k % cols;
    const row = Math.floor(k / cols);
    const x = 0.95 + col * 0.76;
    const z = (row - 1) * 0.58;
    const y0 = -1.75;
    const yaw = (r() - 0.5) * 0.08;
    for (let i = 0; i < h; i++) {
      const f = h > 1 ? i / (h - 1) : 1;
      items.push({
        p: [x + (r() - 0.5) * 0.025, y0 + i * 0.05, z + (r() - 0.5) * 0.025],
        q: qEuler(yaw + (r() - 0.5) * 0.03, 0, 0),
        s: [1, 1, 1],
        c: mul3(BLUE, 0.7 + 0.3 * f),
        glow: 0.03 + 0.32 * f * f * f,
        drift: 0,
        path: -1,
      });
    }
    tops.push([x, y0 + h * 0.05 + 0.04, z]);
  }
  const C: V3 = [-3.3, 0.35, 0.2];
  const R: V3 = [2.3, 1.9, 1.5];
  for (let i = 0; i < nCloud; i++) {
    const d = randDir(r);
    const k = Math.pow(r(), 0.6);
    const p: V3 = [
      C[0] + d[0] * R[0] * k,
      C[1] + d[1] * R[1] * k,
      C[2] + d[2] * R[2] * k,
    ];
    const q = qEuler(r() * 6.283, (r() - 0.5) * 2.0, (r() - 0.5) * 1.8);
    const cyan = r() < 0.14;
    const item: Item = {
      p,
      q,
      s: [1, 1, 1],
      c: cyan ? mul3(CYAN, 0.8) : mul3(BLUE, 0.45 + r() * 0.4),
      glow: cyan ? 0.15 : 0,
      drift: 1,
      path: -1,
    };
    if (i < nFlow) {
      const top = tops[Math.floor(r() * stacks)];
      item.flow = {
        a: p,
        k: [-0.8 + r() * 1.4, 2.5 + r() * 0.9, (r() - 0.5) * 1.2],
        b: [top[0], top[1] + 0.08, top[2]],
        q0: q,
        phase: r(),
        speed: 0.18 + r() * 0.12,
      };
    }
    items.push(item);
  }
  return items;
}

/** 1. A dim field, one lit cluster, and a path from a single point to it. */
function layoutAnswers(n: number, r: Rand): Item[] {
  const items: Item[] = [];
  const C: V3 = [2.9, 0.5, 0.3];
  const Q: V3 = [-4.4, -1.3, 1.5];
  const K: V3 = [-1.2, 2.2, 0.5];
  // Adds up to 0.86n: the rest are hidden by `pack`, so the field stays
  // sparse enough to read as a room of documents and not a carpet.
  const nField = Math.round(n * 0.6);
  const nCluster = Math.round(n * 0.13);
  const nQ = Math.round(n * 0.03);
  const nPath = Math.round(n * 0.1);
  let guard = 0;
  for (let i = 0; i < nField && guard < n * 20; guard++) {
    const p: V3 = [(r() - 0.5) * 9.6, (r() - 0.5) * 4.0, (r() - 0.5) * 4.2];
    if (dist3(p, C) < 1.3 || dist3(p, Q) < 0.75) continue;
    i++;
    items.push({
      p,
      q: qEuler(r() * 6.283, (r() - 0.5) * 0.5, (r() - 0.5) * 0.3),
      s: [1, 1, 1],
      c: mul3(BLUE, 0.22 + r() * 0.26),
      glow: 0,
      drift: 0.5,
      path: -1,
    });
  }
  for (let i = 0; i < nCluster; i++) {
    const d = randDir(r);
    const k = 0.8 * Math.pow(r(), 0.5);
    items.push({
      p: [C[0] + d[0] * k, C[1] + d[1] * k, C[2] + d[2] * k],
      q: qEuler(r() * 6.283, (r() - 0.5) * 2, (r() - 0.5) * 2),
      s: [1, 1, 1],
      c: mul3(CYAN, 0.8 + r() * 0.2),
      glow: 0.7,
      drift: 0.25,
      path: -1,
    });
  }
  for (let i = 0; i < nQ; i++) {
    const d = randDir(r);
    const k = 0.26 * Math.pow(r(), 0.5);
    items.push({
      p: [Q[0] + d[0] * k, Q[1] + d[1] * k, Q[2] + d[2] * k],
      q: qEuler(r() * 6.283, (r() - 0.5) * 2, (r() - 0.5) * 2),
      s: [0.8, 1, 0.8],
      c: VIOLET,
      glow: 0.7,
      drift: 0.15,
      path: -1,
    });
  }
  for (let i = 0; i < nPath; i++) {
    const t = clamp01((i + 0.5) / nPath + ((r() - 0.5) * 0.5) / nPath);
    const u = 1 - t;
    const p: V3 = [
      u * u * Q[0] + 2 * u * t * K[0] + t * t * C[0],
      u * u * Q[1] + 2 * u * t * K[1] + t * t * C[1],
      u * u * Q[2] + 2 * u * t * K[2] + t * t * C[2],
    ];
    // tangent of the quadratic
    const tx = 2 * u * (K[0] - Q[0]) + 2 * t * (C[0] - K[0]);
    const ty = 2 * u * (K[1] - Q[1]) + 2 * t * (C[1] - K[1]);
    const tz = 2 * u * (K[2] - Q[2]) + 2 * t * (C[2] - K[2]);
    const tl = Math.hypot(tx, ty, tz) || 1;
    const yaw = Math.atan2(-tz, tx);
    const rise = Math.asin(ty / tl);
    p[0] += (r() - 0.5) * 0.12;
    p[1] += (r() - 0.5) * 0.12;
    p[2] += (r() - 0.5) * 0.12;
    items.push({
      p,
      q: qMul(qAxis(0, 1, 0, yaw), qAxis(0, 0, 1, rise)),
      s: [0.6, 1, 0.6],
      c: mix3(VIOLET, CYAN, t),
      glow: 0.45,
      drift: 0.05,
      path: t,
    });
  }
  return items;
}

/** 2. A cubic lattice: a bright frame with fine parts inside. */
function layoutLattice(n: number): Item[] {
  const c = Math.max(3, Math.round(Math.cbrt(n / 2)));
  const nx = 2 * c;
  const ny = c;
  const nz = c;
  const s = 7.4 / (nx - 1);
  const items: Item[] = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        const strut = i % 3 === 0 || j % 3 === 0 || k % 3 === 0;
        const edges =
          (i === 0 || i === nx - 1 ? 1 : 0) +
          (j === 0 || j === ny - 1 ? 1 : 0) +
          (k === 0 || k === nz - 1 ? 1 : 0);
        const p: V3 = [
          (i - (nx - 1) / 2) * s,
          (j - (ny - 1) / 2) * s,
          (k - (nz - 1) / 2) * s,
        ];
        items.push(
          strut
            ? {
                p,
                q: [0, 0, 0, 1],
                s: cube(0.13),
                c: edges >= 2 ? CYAN : mul3(BLUE, 0.85),
                glow: edges >= 2 ? 0.45 : 0.22,
                drift: 0,
                path: -1,
              }
            : {
                p,
                q: [0, 0, 0, 1],
                s: cube(0.055),
                c: mul3(VIOLET, 0.55),
                glow: 0,
                drift: 0.2,
                path: -1,
              },
        );
      }
    }
  }
  return items;
}

/** 3. A dense core with rings around it, each one less settled. */
function layoutGrowth(n: number, r: Rand): Item[] {
  const items: Item[] = [];
  const nCore = Math.round(n * 0.14);
  for (let i = 0; i < nCore; i++) {
    const d = randDir(r);
    const k = 0.85 * Math.pow(r(), 0.45);
    items.push({
      p: [d[0] * k, d[1] * k * 0.8, d[2] * k],
      q: qEuler(r() * 6.283, (r() - 0.5) * 2, (r() - 0.5) * 2),
      s: [0.9, 1, 0.9],
      c: mix3(CYAN, WHITE, 0.2),
      glow: 0.42,
      drift: 0.2,
      path: -1,
    });
  }
  const radii = [1.8, 2.75, 3.7, 4.65];
  const colors: V3[] = [mul3(BLUE, 1.05), BLUE, VIOLET, mul3(BLUE, 0.5)];
  const glows = [0.4, 0.28, 0.18, 0.06];
  const wsum = radii.reduce((a, b) => a + b, 0);
  let used = 0;
  for (let k = 0; k < 4; k++) {
    const count =
      k < 3
        ? Math.round(((n - nCore) * radii[k]) / wsum)
        : n - nCore - used;
    used += count;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + (r() - 0.5) * 0.04;
      const rad = radii[k] + gauss(r) * (0.09 + 0.1 * k);
      const y = gauss(r) * (0.04 + 0.07 * k);
      const loose = 0.05 + 0.3 * k;
      items.push({
        p: [Math.cos(a) * rad, y, Math.sin(a) * rad],
        q: qEuler(-a - Math.PI / 2, (r() - 0.5) * loose, (r() - 0.5) * loose),
        s: [0.85, 1, 0.85],
        c: colors[k],
        glow: glows[k],
        drift: 0.1 + 0.2 * k,
        path: -1,
      });
    }
  }
  return items;
}

/** 4. A rising curved surface with one bright line fitted along it. */
function layoutForecast(n: number, r: Rand): Item[] {
  const nx = Math.round(Math.sqrt(n * 1.25));
  const nz = Math.floor(n / nx);
  const X0 = -5.0;
  const X1 = 4.4;
  const Z0 = -2.0;
  const Z1 = 2.0;
  const base = (x: number, z: number) => {
    const u = (x - X0) / (X1 - X0);
    return (
      -1.75 +
      1.5 * u +
      1.5 * u * u +
      0.22 * Math.sin(1.1 * x + 0.6 * z) * Math.cos(0.8 * z - 0.3 * x)
    );
  };
  const items: Item[] = [];
  const mid = Math.floor(nz / 2);
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      const x = X0 + (i / (nx - 1)) * (X1 - X0);
      const z = Z0 + (j / (nz - 1)) * (Z1 - Z0);
      const u = (x - X0) / (X1 - X0);
      let y = base(x, z);
      const e = 0.05;
      const dx = (base(x + e, z) - base(x - e, z)) / (2 * e);
      const dz = (base(x, z + e) - base(x, z - e)) / (2 * e);
      const nl = Math.hypot(dx, 1, dz);
      const nrm: V3 = [-dx / nl, 1 / nl, -dz / nl];
      const line = j === mid || j === mid - 1;
      const fc = u > 0.66 ? (u - 0.66) / 0.34 : 0;
      if (fc > 0 && !line) y += gauss(r) * 0.32 * fc;
      const h = (y + 1.75) / 3.3;
      let q = qUpTo(nrm);
      if (fc > 0 && !line) {
        q = qMul(
          q,
          qEuler((r() - 0.5) * fc, (r() - 0.5) * fc * 0.8, (r() - 0.5) * fc * 0.8),
        );
      }
      items.push({
        p: [x, y + (line ? 0.07 : 0), z],
        q,
        s: line ? [0.55, 1.3, 0.5] : [0.42, 1, 0.3],
        c: line
          ? mix3(WHITE, VIOLET, fc * 0.5)
          : fc > 0
            ? mix3(mul3(BLUE, 0.6), mul3(VIOLET, 0.6), fc)
            : mix3(mul3(BLUE, 0.55), CYAN, clamp01(h) * 0.8),
        glow: line ? 0.85 : fc > 0 ? 0.02 : 0.04 + 0.1 * clamp01(h),
        drift: line ? 0.02 : fc > 0 ? 0.35 : 0.05,
        path: line ? u : -1,
      });
    }
  }
  return items;
}

/**
 * Sort by a slightly noisy x so instance `i` sits at about the same place in
 * every state and a morph reads as one sweep across the object rather than a
 * shuffle, then pad with hidden instances (scale 0 at the centre) to exactly
 * `n` and pack into typed arrays.
 */
function pack(items: Item[], n: number, r: Rand): Layout {
  const keyed = items.map((it) => ({
    it,
    k: it.p[0] + 0.35 * it.p[1] + 0.2 * it.p[2] + (r() - 0.5) * 0.8,
  }));
  while (keyed.length < n) {
    keyed.push({
      it: {
        p: [0, 0, 0],
        q: [0, 0, 0, 1],
        s: [0, 0, 0],
        c: BLUE,
        glow: 0,
        drift: 0,
        path: -1,
      },
      k: (r() - 0.5) * 8,
    });
  }
  keyed.sort((a, b) => a.k - b.k);
  keyed.length = n;
  const L: Layout = {
    pos: new Float32Array(n * 3),
    quat: new Float32Array(n * 4),
    scale: new Float32Array(n * 3),
    color: new Float32Array(n * 3),
    glow: new Float32Array(n),
    drift: new Float32Array(n),
    path: new Float32Array(n),
    flows: [],
  };
  for (let i = 0; i < n; i++) {
    const it = keyed[i].it;
    L.pos.set(it.p, i * 3);
    L.quat.set(it.q, i * 4);
    L.scale.set(it.s, i * 3);
    L.color.set(it.c, i * 3);
    L.glow[i] = it.glow;
    L.drift[i] = it.drift;
    L.path[i] = it.path;
    if (it.flow) L.flows.push({ ...it.flow, i });
  }
  return L;
}

function buildLayout(i: number, n: number): Layout {
  switch (i) {
    case 1:
      return pack(layoutAnswers(n, rng(22)), n, rng(102));
    case 2:
      return pack(layoutLattice(n), n, rng(103));
    case 3:
      return pack(layoutGrowth(n, rng(44)), n, rng(104));
    case 4:
      return pack(layoutForecast(n, rng(55)), n, rng(105));
    default:
      return pack(layoutPaper(n, rng(11)), n, rng(101));
  }
}

function buildLayouts(n: number): Layout[] {
  return [0, 1, 2, 3, 4].map((i) => buildLayout(i, n));
}

/**
 * The travelling sheets of state 0, written straight into the layout's own
 * arrays so a morph into state 0 lerps toward where the traveller will be,
 * not toward where it started. `flow.a` is their cloud origin, `flow.b` the
 * top of a stack.
 */
function stepFlows(L: Layout, seconds: number) {
  for (const f of L.flows) {
    const t = (seconds * f.speed + f.phase) % 1;
    const u = 1 - t;
    const j3 = f.i * 3;
    const j4 = f.i * 4;
    L.pos[j3] = u * u * f.a[0] + 2 * u * t * f.k[0] + t * t * f.b[0];
    L.pos[j3 + 1] = u * u * f.a[1] + 2 * u * t * f.k[1] + t * t * f.b[1];
    L.pos[j3 + 2] = u * u * f.a[2] + 2 * u * t * f.k[2] + t * t * f.b[2];
    // settle from the random start orientation to flat as it lands
    const w = t * t * (3 - 2 * t);
    const sgn = f.q0[3] < 0 ? -1 : 1;
    let qx = f.q0[0] * sgn * (1 - w);
    let qy = f.q0[1] * sgn * (1 - w);
    let qz = f.q0[2] * sgn * (1 - w);
    let qw = f.q0[3] * sgn * (1 - w) + w;
    const ql = Math.hypot(qx, qy, qz, qw) || 1;
    qx /= ql;
    qy /= ql;
    qz /= ql;
    qw /= ql;
    L.quat[j4] = qx;
    L.quat[j4 + 1] = qy;
    L.quat[j4 + 2] = qz;
    L.quat[j4 + 3] = qw;
    L.glow[f.i] = 0.6 * Math.sin(t * Math.PI);
  }
}

/* ------------------------------------------------------------------ *
 *  Shaders
 * ------------------------------------------------------------------ */
const VERT = /* glsl */ `
uniform float uTime;
uniform float uMode;
attribute vec3 aColor;
attribute float aGlow;
attribute float aSeed;
attribute float aDrift;
attribute float aPath;
varying vec3 vColor;
varying float vGlow;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vec4 local = instanceMatrix * vec4(position, 1.0);
  vec3 centre = instanceMatrix[3].xyz;
  float s = aSeed * 6.2831853;
  float t = uTime;
  vec3 drift = vec3(
    sin(t * 0.61 + s) + 0.5 * sin(t * 1.37 + s * 2.0),
    sin(t * 0.47 + s * 1.7) + 0.5 * cos(t * 1.11 + s * 3.0),
    cos(t * 0.53 + s * 2.3)
  ) * (0.09 * aDrift);
  local.xyz += drift;

  float g = aGlow;
  if (uMode > 0.5 && uMode < 1.5) {
    // a bead runs from the question to the source, the source flares, and a
    // brighter bead runs back with the answer
    float ph = fract(t * 0.16);
    float tb = ph < 0.42 ? ph / 0.42 : (ph < 0.56 ? 2.0 : 1.0 - (ph - 0.56) / 0.44);
    if (aPath >= 0.0) {
      float d = aPath - tb;
      float bead = exp(-d * d * 140.0);
      g += bead * (ph >= 0.56 ? 1.8 : 1.2);
    } else if (aGlow > 0.55) {
      float f = smoothstep(0.40, 0.48, ph) * (1.0 - smoothstep(0.56, 0.72, ph));
      g += 0.9 * f;
    }
  } else if (uMode > 1.5 && uMode < 2.5) {
    // a plane of light runs through the lattice along x, a fainter one up y
    float sx = -6.5 + fract(t * 0.14) * 13.0;
    float d = centre.x - sx;
    g += 0.9 * exp(-d * d * 2.5) * step(0.15, aGlow);
    float sy = -3.0 + fract(t * 0.09 + 0.5) * 6.0;
    float dy = centre.y - sy;
    g += 0.25 * exp(-dy * dy * 6.0);
  } else if (uMode > 2.5 && uMode < 3.5) {
    // rings light up outward from the core, one after another
    float rad = length(centre.xz);
    float w = fract(t * 0.13) * 6.4;
    float d = rad - w;
    g += 0.9 * exp(-d * d * 3.0);
  } else if (uMode > 3.5) {
    // a bead along the fitted line, and a broad sweep across the surface
    if (aPath >= 0.0) {
      float d = aPath - fract(t * 0.2);
      g += 1.2 * exp(-d * d * 180.0);
    } else {
      float sx = -6.5 + fract(t * 0.2) * 13.0;
      float d = centre.x - sx;
      g += 0.2 * exp(-d * d * 1.2);
    }
  }
  vGlow = g;
  vColor = aColor;
  vec4 mv = modelViewMatrix * local;
  vNormal = normalize(normalMatrix * (mat3(instanceMatrix) * normal));
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform vec3 uKey;
uniform vec3 uFill;
varying vec3 vColor;
varying float vGlow;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float key = dot(n, uKey) * 0.5 + 0.5;
  key = key * key;
  float fill = max(dot(n, uFill), 0.0);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  vec3 col = vColor * (0.2 + 0.8 * key)
           + vColor * fill * 0.25
           + vec3(0.55, 0.7, 1.0) * rim * 0.22;
  // lit instances go past their own colour toward white
  col += (vColor * 0.7 + vec3(0.32)) * vGlow;
  float depth = length(vView);
  float fog = smoothstep(10.0, 30.0, depth);
  gl_FragColor = vec4(col, 1.0 - fog * 0.7);
}
`;

/* ------------------------------------------------------------------ *
 *  The WebGL stage
 * ------------------------------------------------------------------ */
type Api = { morph: (i: number) => void };

function compose(
  M: Float32Array,
  o: number,
  px: number,
  py: number,
  pz: number,
  x: number,
  y: number,
  z: number,
  w: number,
  sx: number,
  sy: number,
  sz: number,
) {
  const x2 = x + x;
  const y2 = y + y;
  const z2 = z + z;
  const xx = x * x2;
  const xy = x * y2;
  const xz = x * z2;
  const yy = y * y2;
  const yz = y * z2;
  const zz = z * z2;
  const wx = w * x2;
  const wy = w * y2;
  const wz = w * z2;
  M[o] = (1 - (yy + zz)) * sx;
  M[o + 1] = (xy + wz) * sx;
  M[o + 2] = (xz - wy) * sx;
  M[o + 3] = 0;
  M[o + 4] = (xy - wz) * sy;
  M[o + 5] = (1 - (xx + zz)) * sy;
  M[o + 6] = (yz + wx) * sy;
  M[o + 7] = 0;
  M[o + 8] = (xz + wy) * sz;
  M[o + 9] = (yz - wx) * sz;
  M[o + 10] = (1 - (xx + yy)) * sz;
  M[o + 11] = 0;
  M[o + 12] = px;
  M[o + 13] = py;
  M[o + 14] = pz;
  M[o + 15] = 1;
}

function mount(
  THREE: Three,
  el: HTMLDivElement,
  initialIndex: number,
  onReady: () => void,
): { api: Api; dispose: () => void } {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 700ms ease";
  el.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 120);
  const group = new THREE.Group();
  scene.add(group);

  const layouts = buildLayouts(N);
  const geometry = new THREE.BoxGeometry(SHEET[0], SHEET[1], SHEET[2]);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uMode: { value: initialIndex },
      uKey: { value: new THREE.Vector3(-0.4, 0.8, 0.55).normalize() },
      uFill: { value: new THREE.Vector3(0.75, -0.2, 0.45).normalize() },
    },
    transparent: true,
    depthWrite: true,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, N);
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(mesh);

  // CPU state: the instance arrays that the attributes read from directly.
  const cur = {
    pos: new Float32Array(N * 3),
    quat: new Float32Array(N * 4),
    scale: new Float32Array(N * 3),
    color: new Float32Array(N * 3),
    glow: new Float32Array(N),
    drift: new Float32Array(N),
    path: new Float32Array(N),
  };
  const from = {
    pos: new Float32Array(N * 3),
    quat: new Float32Array(N * 4),
    scale: new Float32Array(N * 3),
    color: new Float32Array(N * 3),
    glow: new Float32Array(N),
    drift: new Float32Array(N),
  };
  const seed = new Float32Array(N);
  const delay = new Float32Array(N);
  const r0 = rng(7);
  for (let i = 0; i < N; i++) {
    seed[i] = r0();
    // birth state: a wide loose scatter the first morph gathers from
    const d = randDir(r0);
    const k = 5 + r0() * 6;
    cur.pos.set([d[0] * k, d[1] * k * 0.6, d[2] * k], i * 3);
    cur.quat.set(qEuler(r0() * 6.283, (r0() - 0.5) * 2, (r0() - 0.5) * 2), i * 4);
    cur.scale.set([1, 1, 1], i * 3);
    cur.color.set(mul3(BLUE, 0.4), i * 3);
    cur.path[i] = -1;
  }
  const attr = (arr: Float32Array, size: number) => {
    const a = new THREE.InstancedBufferAttribute(arr, size);
    a.setUsage(THREE.DynamicDrawUsage);
    return a;
  };
  const aColor = attr(cur.color, 3);
  const aGlow = attr(cur.glow, 1);
  const aDrift = attr(cur.drift, 1);
  const aPath = attr(cur.path, 1);
  geometry.setAttribute("aColor", aColor);
  geometry.setAttribute("aGlow", aGlow);
  geometry.setAttribute("aDrift", aDrift);
  geometry.setAttribute("aPath", aPath);
  geometry.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 1));
  const M = mesh.instanceMatrix.array as Float32Array;

  let mode = initialIndex;
  let to = layouts[mode];
  let morphing = false;
  let morphStart = 0;
  const t0 = performance.now();

  const flagAll = () => {
    mesh.instanceMatrix.needsUpdate = true;
    aColor.needsUpdate = true;
    aGlow.needsUpdate = true;
    aDrift.needsUpdate = true;
    aPath.needsUpdate = true;
  };

  const morph = (i: number) => {
    const L = layouts[i];
    if (!L) return;
    from.pos.set(cur.pos);
    from.quat.set(cur.quat);
    from.scale.set(cur.scale);
    from.color.set(cur.color);
    from.glow.set(cur.glow);
    from.drift.set(cur.drift);
    for (let j = 0; j < N; j++) {
      const sweep = clamp01((from.pos[j * 3] + 6) / 12);
      delay[j] = (0.5 * seed[j] + 0.5 * sweep) * STAGGER_MS;
    }
    mode = i;
    to = L;
    material.uniforms.uMode.value = i;
    morphStart = performance.now();
    morphing = true;
  };

  const stepMorph = (now: number) => {
    const el = now - morphStart;
    let done = true;
    for (let j = 0; j < N; j++) {
      const raw = (el - delay[j]) / MORPH_MS;
      const p = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
      if (p < 1) done = false;
      const k = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const j3 = j * 3;
      const j4 = j * 4;
      const lift = Math.sin(p * Math.PI) * (0.3 + 0.8 * seed[j]);
      const px = from.pos[j3] + (to.pos[j3] - from.pos[j3]) * k;
      const py = from.pos[j3 + 1] + (to.pos[j3 + 1] - from.pos[j3 + 1]) * k + lift;
      const pz = from.pos[j3 + 2] + (to.pos[j3 + 2] - from.pos[j3 + 2]) * k;
      cur.pos[j3] = px;
      cur.pos[j3 + 1] = py;
      cur.pos[j3 + 2] = pz;
      const fx = from.quat[j4];
      const fy = from.quat[j4 + 1];
      const fz = from.quat[j4 + 2];
      const fw = from.quat[j4 + 3];
      let tx = to.quat[j4];
      let ty = to.quat[j4 + 1];
      let tz = to.quat[j4 + 2];
      let tw = to.quat[j4 + 3];
      if (fx * tx + fy * ty + fz * tz + fw * tw < 0) {
        tx = -tx;
        ty = -ty;
        tz = -tz;
        tw = -tw;
      }
      let qx = fx + (tx - fx) * k;
      let qy = fy + (ty - fy) * k;
      let qz = fz + (tz - fz) * k;
      let qw = fw + (tw - fw) * k;
      const ql = Math.hypot(qx, qy, qz, qw) || 1;
      qx /= ql;
      qy /= ql;
      qz /= ql;
      qw /= ql;
      cur.quat[j4] = qx;
      cur.quat[j4 + 1] = qy;
      cur.quat[j4 + 2] = qz;
      cur.quat[j4 + 3] = qw;
      const sx = from.scale[j3] + (to.scale[j3] - from.scale[j3]) * k;
      const sy = from.scale[j3 + 1] + (to.scale[j3 + 1] - from.scale[j3 + 1]) * k;
      const sz = from.scale[j3 + 2] + (to.scale[j3 + 2] - from.scale[j3 + 2]) * k;
      cur.scale[j3] = sx;
      cur.scale[j3 + 1] = sy;
      cur.scale[j3 + 2] = sz;
      cur.color[j3] = from.color[j3] + (to.color[j3] - from.color[j3]) * k;
      cur.color[j3 + 1] =
        from.color[j3 + 1] + (to.color[j3 + 1] - from.color[j3 + 1]) * k;
      cur.color[j3 + 2] =
        from.color[j3 + 2] + (to.color[j3 + 2] - from.color[j3 + 2]) * k;
      cur.glow[j] = from.glow[j] + (to.glow[j] - from.glow[j]) * k;
      cur.drift[j] = from.drift[j] + (to.drift[j] - from.drift[j]) * k;
      cur.path[j] = to.path[j];
      compose(M, j * 16, px, py, pz, qx, qy, qz, qw, sx, sy, sz);
    }
    flagAll();
    if (done) morphing = false;
  };

  const stepIdleFlows = () => {
    for (const f of to.flows) {
      const j = f.i;
      const j3 = j * 3;
      const j4 = j * 4;
      cur.pos[j3] = to.pos[j3];
      cur.pos[j3 + 1] = to.pos[j3 + 1];
      cur.pos[j3 + 2] = to.pos[j3 + 2];
      cur.quat[j4] = to.quat[j4];
      cur.quat[j4 + 1] = to.quat[j4 + 1];
      cur.quat[j4 + 2] = to.quat[j4 + 2];
      cur.quat[j4 + 3] = to.quat[j4 + 3];
      cur.glow[j] = to.glow[j];
      compose(
        M,
        j * 16,
        cur.pos[j3],
        cur.pos[j3 + 1],
        cur.pos[j3 + 2],
        cur.quat[j4],
        cur.quat[j4 + 1],
        cur.quat[j4 + 2],
        cur.quat[j4 + 3],
        cur.scale[j3],
        cur.scale[j3 + 1],
        cur.scale[j3 + 2],
      );
    }
    mesh.instanceMatrix.needsUpdate = true;
    aGlow.needsUpdate = true;
  };

  // Framing. Above lg the copy holds the left 40% of the stage and the object
  // is pushed into the right two thirds; below it the copy sits on top and the
  // object is pushed into the lower half. Both are a view offset on the
  // camera, so the object itself never moves.
  const lg = window.matchMedia("(min-width: 1024px)");
  let dist = 14;
  const resize = () => {
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tanH = Math.tan((FOV / 2) * (Math.PI / 180));
    if (lg.matches) {
      const dW = OBJ_W / 0.64 / (2 * tanH * camera.aspect);
      const dH = OBJ_H / (2 * tanH);
      dist = Math.max(dW, dH);
      camera.setViewOffset(w, h, -0.18 * w, 0, w, h);
    } else {
      const dW = OBJ_W / 1.3 / (2 * tanH * camera.aspect);
      const dH = OBJ_H / 0.6 / (2 * tanH);
      dist = Math.max(dW, dH);
      camera.setViewOffset(w, h, 0, -0.23 * h, w, h);
    }
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);
  lg.addEventListener("change", resize);

  // Pointer parallax, subtle, eased.
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    ptr.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ptr.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const onLeave = () => {
    ptr.tx = 0;
    ptr.ty = 0;
  };
  el.addEventListener("pointermove", onMove, { passive: true });
  el.addEventListener("pointerleave", onLeave);

  // The loop runs only while the stage is on screen and the tab is visible.
  let raf = 0;
  let inView = false;
  let running = false;
  let ready = false;
  let lost = false;
  const frame = () => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const now = performance.now();
    const seconds = (now - t0) / 1000;
    if (mode === 0) stepFlows(to, seconds);
    if (morphing) stepMorph(now);
    else if (mode === 0) stepIdleFlows();
    material.uniforms.uTime.value = seconds;
    ptr.x += (ptr.tx - ptr.x) * 0.06;
    ptr.y += (ptr.ty - ptr.y) * 0.06;
    camera.position.set(ptr.x * 0.9, 3.3 - ptr.y * 0.5, dist);
    camera.lookAt(0, 0, 0);
    group.rotation.y = -0.14 + 0.05 * Math.sin(seconds * 0.19);
    group.rotation.x = 0.02 * Math.sin(seconds * 0.13);
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      canvas.style.opacity = "1";
      onReady();
    }
  };
  const sync = () => {
    const should = inView && document.visibilityState === "visible" && !lost;
    if (should && !running) {
      running = true;
      raf = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };
  const io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      sync();
    },
    { rootMargin: "80px" },
  );
  io.observe(el);
  document.addEventListener("visibilitychange", sync);
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    canvas.style.opacity = "0";
    sync();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  morph(initialIndex);

  return {
    api: { morph },
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      lg.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

/* ------------------------------------------------------------------ *
 *  Static stand-in: the same layout, projected once, as an SVG
 * ------------------------------------------------------------------ */
function StaticScene({ index }: { index: number }) {
  const dots = useMemo(() => {
    const L = buildLayout(index, N_STATIC);
    const W = 1000;
    const H = 600;
    const aspect = W / H;
    const tanH = Math.tan((FOV / 2) * (Math.PI / 180));
    const cam: V3 = [0, 3.3, 14];
    const f: V3 = [0, -3.3, -14];
    const fl = Math.hypot(...f);
    f[0] /= fl;
    f[1] /= fl;
    f[2] /= fl;
    const up: V3 = [0, -f[2], f[1]];
    const yaw = -0.14;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const out: { x: number; y: number; r: number; fill: string; o: number; z: number }[] = [];
    for (let i = 0; i < N_STATIC; i++) {
      const sx = L.scale[i * 3];
      if (sx === 0) continue;
      const px = L.pos[i * 3];
      const py = L.pos[i * 3 + 1];
      const pz = L.pos[i * 3 + 2];
      const wx = px * cy + pz * sy;
      const wz = -px * sy + pz * cy;
      const d: V3 = [wx - cam[0], py - cam[1], wz - cam[2]];
      const vx = d[0];
      const vy = d[0] * up[0] + d[1] * up[1] + d[2] * up[2];
      const vz = d[0] * f[0] + d[1] * f[1] + d[2] * f[2];
      if (vz <= 0.1) continue;
      const nx = vx / (vz * tanH * aspect);
      const ny = vy / (vz * tanH);
      const g = Math.min(1, L.glow[i]);
      const c = mix3(
        [L.color[i * 3], L.color[i * 3 + 1], L.color[i * 3 + 2]],
        WHITE,
        g * 0.7,
      );
      out.push({
        x: (nx * 0.5 + 0.5) * W,
        y: (0.5 - ny * 0.5) * H,
        r: Math.min(8, 2 + 3 * Math.max(sx, L.scale[i * 3 + 2])) * (14 / vz),
        fill: `rgb(${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(c[2] * 255)})`,
        o: 0.35 + 0.65 * (1 - clamp01((vz - 9) / 16)) + g * 0.2,
        z: vz,
      });
    }
    out.sort((a, b) => b.z - a.z);
    return out;
  }, [index]);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-x-0 bottom-0 h-1/2 w-full lg:inset-y-0 lg:left-[38%] lg:h-full lg:w-[62%]"
    >
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x.toFixed(1)}
          cy={d.y.toFixed(1)}
          r={d.r.toFixed(1)}
          fill={d.fill}
          opacity={Math.min(1, d.o).toFixed(2)}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 *  Hooks
 * ------------------------------------------------------------------ */
/** `matchMedia` as a store: false on the server, live on the client. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/* ------------------------------------------------------------------ *
 *  Component
 * ------------------------------------------------------------------ */
export default function CapabilityScene({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const indexRef = useRef(index);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  /** "glow" until three.js has drawn, "gl" after, "static" when it cannot. */
  const [mode, setMode] = useState<"glow" | "gl" | "static">("glow");

  useEffect(() => {
    indexRef.current = index;
    api.current?.morph(index);
  }, [index]);

  useEffect(() => {
    const el = host.current;
    if (!el || reduced) return;
    let disposed = false;
    let dispose: (() => void) | undefined;
    import("three")
      .then((THREE) => {
        if (disposed) return;
        try {
          const m = mount(THREE, el, indexRef.current, () => setMode("gl"));
          api.current = m.api;
          dispose = m.dispose;
        } catch {
          setMode("static");
        }
      })
      .catch(() => setMode("static"));
    return () => {
      disposed = true;
      api.current = null;
      dispose?.();
    };
  }, [reduced]);

  const showStatic = reduced || mode === "static";

  return (
    <div
      ref={host}
      aria-hidden="true"
      data-scene={index}
      className={`overflow-hidden ${className}`}
    >
      {/* The CSS ground: a soft glow in the scene's own colours, painted on
          the server and kept under the canvas so nothing ever reads blank. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 70% 55%, rgba(51,102,255,0.16), transparent 70%), radial-gradient(35% 45% at 84% 40%, rgba(34,211,238,0.08), transparent 70%), radial-gradient(40% 50% at 55% 75%, rgba(124,92,255,0.07), transparent 70%)",
        }}
      />
      {showStatic ? <StaticScene index={index} /> : null}
    </div>
  );
}
