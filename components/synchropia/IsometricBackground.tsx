"use client";

import React from "react";

// ─── Color palette ─────────────────────────────────────────────────────────
const G  = "#8AFF00";   // neon green (top face)
const GM = "#3d7a00";   // mid green  (left face)
const GD = "#162900";   // dark green (right face)

// ─── Geometry helpers ───────────────────────────────────────────────────────
/** Returns polygon point-strings and top-center coords for an isometric cube.
 *  Anchor = front-bottom vertex at (cx, cy).
 *  w  = full width of the cube in screen px
 *  wall = wall height in screen px
 */
function makeCube(cx: number, cy: number, w: number, wall: number) {
  const hw = w / 2;
  const hq = w / 4;
  return {
    top:   `${cx},${cy-wall} ${cx+hw},${cy-hq-wall} ${cx},${cy-hw-wall} ${cx-hw},${cy-hq-wall}`,
    left:  `${cx},${cy} ${cx-hw},${cy-hq} ${cx-hw},${cy-hq-wall} ${cx},${cy-wall}`,
    right: `${cx},${cy} ${cx+hw},${cy-hq} ${cx+hw},${cy-hq-wall} ${cx},${cy-wall}`,
    // centre of the top-face (for beam anchoring)
    tcx: cx,
    tcy: cy - hq - wall,
    // apex of the back-top vertex (for label placement)
    apexY: cy - hw - wall,
  };
}

// ─── Scene data ─────────────────────────────────────────────────────────────
const CUBES = [
  { cx: 155,  cy: 345, w: 72,  wall: 52,  label: "PM SWARM",   delay: "0ms"    },
  { cx: 375,  cy: 268, w: 78,  wall: 68,  label: "ARCHITECT",  delay: "450ms"  },
  { cx: 625,  cy: 395, w: 118, wall: 92,  label: "SDE SWARM",  delay: "900ms"  },
  { cx: 875,  cy: 305, w: 70,  wall: 56,  label: "QA AGENT",   delay: "1350ms" },
  { cx: 1060, cy: 365, w: 82,  wall: 62,  label: "DEVOPS",     delay: "270ms"  },
];

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [1, 3],
];

const DIAMONDS = [
  { cx: 90,  cy: 185, s: 11, delay: "0ms"    },
  { cx: 492, cy: 148, s: 8,  delay: "700ms"  },
  { cx: 755, cy: 160, s: 10, delay: "1400ms" },
  { cx: 1118,cy: 228, s: 13, delay: "350ms"  },
  { cx: 255, cy: 455, s: 7,  delay: "1050ms" },
  { cx: 985, cy: 448, s: 9,  delay: "560ms"  },
  { cx: 505, cy: 448, s: 6,  delay: "1750ms" },
];

// ─── Sub-components ─────────────────────────────────────────────────────────
function AgentCube({
  cx, cy, w, wall, label, delay,
}: typeof CUBES[0]) {
  const p   = makeCube(cx, cy, w, wall);
  const hw  = w / 2;
  const fs  = Math.max(8, w * 0.083); // font size scales with cube

  return (
    <g style={{ animation: `isoFloat 3.6s ease-in-out ${delay} infinite` }}>
      {/* ground glow */}
      <ellipse
        cx={cx} cy={cy}
        rx={w * 0.42} ry={w * 0.13}
        fill={G}
        style={{ animation: `glowPulse 3.6s ease-in-out ${delay} infinite` }}
      />
      {/* right face — darkest */}
      <polygon points={p.right} fill={GD} stroke={G} strokeWidth={0.9} opacity={0.82} />
      {/* left face — mid */}
      <polygon points={p.left}  fill={GM} stroke={G} strokeWidth={0.9} opacity={0.82} />
      {/* top face — brightest */}
      <polygon points={p.top}   fill={G}  stroke={G} strokeWidth={0.9} opacity={0.88} />

      {/* status dot */}
      <circle
        cx={cx - fs / 2 - 5} cy={p.apexY - 14}
        r={2.5} fill={G}
        style={{ animation: `blinkDot 1.8s ease-in-out ${delay} infinite` }}
      />
      {/* label */}
      <text
        x={cx} y={p.apexY - 10}
        textAnchor="middle"
        fill={G}
        fontSize={fs}
        fontFamily="'Courier New', monospace"
        letterSpacing="1.8"
        fontWeight="bold"
        style={{ animation: `blinkDot 2.4s ease-in-out ${delay} infinite` }}
      >
        {label}
      </text>

      {/* subtle inner grid lines on top face (makes it look "technical") */}
      <line
        x1={cx - hw * 0.5} y1={cy - wall - w * 0.18}
        x2={cx + hw * 0.5} y2={cy - wall - w * 0.18}
        stroke="rgba(0,0,0,0.25)" strokeWidth={0.6}
      />
      <line
        x1={cx - hw * 0.25} y1={cy - wall - w * 0.09}
        x2={cx + hw * 0.25} y2={cy - wall - w * 0.09}
        stroke="rgba(0,0,0,0.15)" strokeWidth={0.5}
      />
    </g>
  );
}

function Beam({ x1, y1, x2, y2 }: { x1:number; y1:number; x2:number; y2:number }) {
  return (
    <g>
      {/* soft ambient glow */}
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={G} strokeWidth={5} opacity={0.04} />
      {/* main dashed line */}
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={G} strokeWidth={1} strokeDasharray="9 7" opacity={0.38} />
    </g>
  );
}

function FloatDiamond({ cx, cy, s, delay }: { cx:number; cy:number; s:number; delay:string }) {
  return (
    <g style={{ animation: `isoFloat 4.2s ease-in-out ${delay} infinite` }}>
      <polygon
        points={`${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}`}
        fill="none" stroke={G} strokeWidth={1} opacity={0.65}
      />
      <polygon
        points={`${cx},${cy-s*0.55} ${cx+s*0.55},${cy} ${cx},${cy+s*0.55} ${cx-s*0.55},${cy}`}
        fill={G} opacity={0.18}
      />
    </g>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function IsometricBackground() {
  const cubeData = CUBES.map(c => ({ ...c, pts: makeCube(c.cx, c.cy, c.w, c.wall) }));

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.17] dark:opacity-[0.23]">
      {/* Inject keyframes into document head via a style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes isoFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.04; }
          50%       { opacity: 0.16; }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1; }
        }
      `}} />

      <svg
        viewBox="0 0 1200 510"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* ── Isometric floor grid ──────────────────────────────────────── */}
        <g stroke={G} strokeWidth="0.45" strokeDasharray="8 13" opacity="0.55">
          {/* NE-SW lines: y = 0.5x + c, from (0, c) to (1200, c+600) */}
          {Array.from({ length: 24 }, (_, i) => {
            const c = -620 + i * 56;
            return <line key={`ne${i}`} x1={0} y1={c} x2={1200} y2={c + 600} />;
          })}
          {/* NW-SE lines: y = -0.5x + c, from (0, c) to (1200, c-600) */}
          {Array.from({ length: 24 }, (_, i) => {
            const c = i * 56;
            return <line key={`nw${i}`} x1={0} y1={c} x2={1200} y2={c - 600} />;
          })}
        </g>

        {/* ── Connecting beams (drawn under cubes) ─────────────────────── */}
        {CONNECTIONS.map(([a, b], i) => (
          <Beam
            key={`beam${i}`}
            x1={cubeData[a].pts.tcx} y1={cubeData[a].pts.tcy}
            x2={cubeData[b].pts.tcx} y2={cubeData[b].pts.tcy}
          />
        ))}

        {/* ── Agent cubes ───────────────────────────────────────────────── */}
        {CUBES.map((c, i) => <AgentCube key={`cube${i}`} {...c} />)}

        {/* ── Floating diamond accents ──────────────────────────────────── */}
        {DIAMONDS.map((d, i) => <FloatDiamond key={`d${i}`} {...d} />)}

        {/* ── Corner dashed-circle accents ─────────────────────────────── */}
        <g fill="none" stroke={G} strokeDasharray="5 9" opacity="0.38">
          <circle cx={80}   cy={80}  r={36}  strokeWidth="0.8" />
          <circle cx={1120} cy={95}  r={28}  strokeWidth="0.8" />
          <circle cx={78}   cy={465} r={22}  strokeWidth="0.8" />
          <circle cx={1122} cy={455} r={40}  strokeWidth="0.8" />
          <circle cx={620}  cy={48}  r={16}  strokeWidth="0.8" />
        </g>

        {/* ── Data-packet dots traveling on beams (decorative pulses) ─── */}
        {CONNECTIONS.slice(0, 4).map(([a, b], i) => {
          const ax = cubeData[a].pts.tcx, ay = cubeData[a].pts.tcy;
          const bx = cubeData[b].pts.tcx, by = cubeData[b].pts.tcy;
          return (
            <circle key={`pkt${i}`} r={3} fill={G} opacity={0.8}>
              <animateMotion
                dur={`${2.2 + i * 0.4}s`}
                begin={`${i * 0.55}s`}
                repeatCount="indefinite"
                path={`M${ax},${ay} L${bx},${by}`}
              />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
