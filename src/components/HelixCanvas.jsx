'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const VERT = `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
uniform float uT;
varying vec3 vColor;
void main() {
  // per-point stagger
  float t = smoothstep(0.0, 1.0, clamp(uT * 1.6 - aSeed * 0.6, 0.0, 1.0));
  float k = sin(t * 3.14159265);
  // seeded burst direction
  float a = aSeed * 81.68, b = fract(aSeed * 91.7) * 2.0 - 1.0, s = sqrt(1.0 - b * b);
  vec3 p = mix(aFrom, aTo, t) + vec3(s * cos(a), b, s * sin(a)) * k * 1.2;
  float w = k * 0.6, c = cos(w), sn = sin(w); // swirl around Y
  p.xz = mat2(c, -sn, sn, c) * p.xz;
  vec3 pink = vec3(0.961, 0.639, 0.780), pale = vec3(1.0, 0.890, 0.941), violet = vec3(0.780, 0.490, 1.0);
  vColor = fract(aSeed * 43.17) < 0.15 ? violet : mix(pink, pale, aSeed);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = min(40.0 / -mv.z, 4.0);
  gl_Position = projectionMatrix * mv;
}`
const FRAG = `
uniform float uAlpha;
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, uAlpha * smoothstep(0.5, 0.1, d));
}`

// deterministic LCG, no Math.random
function rng(seed) {
  let s = seed
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

const TAU = Math.PI * 2
const sphereDir = (r) => { const u = r() * 2 - 1, th = r() * TAU, s = Math.sqrt(1 - u * u); return [s * Math.cos(th), u, s * Math.sin(th)] }

// each generator: (i, n, r) => [x, y, z]; all fit roughly +-3
const NET = [3, 5, 6, 5, 2].map((c, l) => Array.from({ length: c }, (_, j) => [(l - 2) * 1.9, (j - (c - 1) / 2) * (5 / Math.max(c - 1, 4)) * 1.25, ((l + j) % 3 - 1) * 0.5]))
const CITIES = [[0.2, 0.5, 0.84], [0.35, 0.4, 0.85], [0.1, 0.35, 0.93], [-0.2, 0.2, 0.96]].map((v) => { const l = Math.hypot(...v); return v.map((x) => x / l) })
const CELLS = [[-1.6, 0.8, 0, 1], [0.2, 1.4, 0.4, 0.8], [1.5, 0.2, -0.3, 1.1], [-0.3, -1, 0.5, 1.2], [1.8, -1.6, 0.4, 0.6], [-2, -1.5, -0.5, 0.65], [0.3, 0.1, -1.5, 0.7]]
const STAR = Array.from({ length: 10 }, (_, k) => { const a = (k / 10) * TAU + Math.PI / 2, rr = k & 1 ? 0.65 : 1.5; return [Math.cos(a) * rr, Math.sin(a) * rr] })

// per-scene placement [x, y, z, alpha multiplier]; text column sits left, so left-side shapes go deeper and dimmer
const PLACE = {
  helix: [3.4, 0, 0, 1], network: [3.4, 0.3, -1, 1.3], globe: [4, -0.5, -1, 0.9],
  lattice: [-4, 0, -4, 0.5], cells: [3.6, 0.3, -1, 0.9], medal: [3, 0, 0, 1],
}

const SHAPES = {
  helix(i, n, r) {
    const TURNS = 6, H = 6, R = 1.1, rungs = Math.floor(n * 0.3), strand = n - rungs
    if (i < strand) {
      const t = (i >> 1) / (strand / 2), a = t * TURNS * TAU + (i & 1) * Math.PI
      return [Math.cos(a) * R + (r() - 0.5) * 0.08, (t - 0.5) * H, Math.sin(a) * R + (r() - 0.5) * 0.08]
    }
    const a = Math.floor(((i - strand) / rungs) * TURNS * 12) / 12 * TAU, u = r() * 2 - 1
    return [Math.cos(a) * R * u, (a / (TURNS * TAU) - 0.5) * H, Math.sin(a) * R * u]
  },
  network(i, n, r) {
    if (i < n * 0.4) { // edge between consecutive layers
      let l = Math.floor(r() * 4)
      const A = NET[l][Math.floor(r() * NET[l].length)], B = NET[l + 1][Math.floor(r() * NET[l + 1].length)], u = r()
      return A.map((x, k) => x + (B[k] - x) * u)
    }
    const l = Math.floor(r() * 5), N = NET[l][Math.floor(r() * NET[l].length)], d = sphereDir(r), rad = 0.3 * Math.cbrt(r())
    return N.map((x, k) => x + d[k] * rad)
  },
  globe(i, n, r) {
    const R = 2.8
    if (i < n * 0.75) { // Fibonacci sphere
      const m = Math.floor(n * 0.75), y = 1 - (2 * (i + 0.5)) / m, s = Math.sqrt(1 - y * y), a = i * 2.399963
      return [Math.cos(a) * s * R, y * R, Math.sin(a) * s * R]
    }
    const c = CITIES[i % 4], d = sphereDir(r), v = c.map((x, k) => x + d[k] * 0.07 * Math.cbrt(r())), l = Math.hypot(...v)
    return v.map((x) => (x / l) * R * 1.02)
  },
  lattice(i, n, r) {
    const e = Math.floor(r() * 300), ax = Math.floor(e / 100), rem = e % 100, p = rem % 25
    const v = [Math.floor(p / 5), p % 5]; v.splice(ax, 0, Math.floor(rem / 25) + r())
    return v.map((x) => (x - 2) * 1.2)
  },
  cells(i, n, r) {
    const c = CELLS[Math.floor(r() * CELLS.length)], d = sphereDir(r)
    return [c[0] + d[0] * c[3], c[1] + d[1] * c[3], c[2] + d[2] * c[3]]
  },
  medal(i, n, r) {
    if (i < n * 0.55) { // torus ring facing camera
      const u = r() * TAU, v = r() * TAU, R = 2.4, q = 0.4
      return [(R + q * Math.cos(v)) * Math.cos(u), (R + q * Math.cos(v)) * Math.sin(u), q * Math.sin(v)]
    }
    const k = Math.floor(r() * 10), A = STAR[k], B = STAR[(k + 1) % 10]
    let a = r(), b = r(); if (a + b > 1) { a = 1 - a; b = 1 - b }
    return [A[0] * a + B[0] * b, A[1] * a + B[1] * b, (r() - 0.5) * 0.2]
  },
}

function build(n) {
  const shapes = {}
  for (const [name, fn] of Object.entries(SHAPES)) {
    const r = rng(42), arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) arr.set(fn(i, n, r), i * 3)
    shapes[name] = arr
  }
  const r = rng(7), seed = new Float32Array(n)
  for (let i = 0; i < n; i++) seed[i] = r()
  const from = new THREE.BufferAttribute(shapes.helix.slice(), 3), to = new THREE.BufferAttribute(shapes.helix.slice(), 3)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', from) // same attribute as aFrom; gives three the draw count
  g.setAttribute('aFrom', from)
  g.setAttribute('aTo', to)
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  return { geo: g, shapes, seed }
}

function Scene({ reduced, mobile }) {
  const group = useRef()
  const sections = useRef([])
  const cur = useRef('helix')
  const prog = useRef(1)
  const face = useRef(0)
  const width = useThree((s) => s.size.width)
  const invalidate = useThree((s) => s.invalidate)
  const { geo, shapes, seed } = useMemo(() => build(mobile ? 2000 : 4000), [mobile])
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: { uT: { value: 1 }, uAlpha: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }), [mobile])
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  // ease group position + alpha toward the active scene's placement; k=1 snaps
  const wide = width >= 1024
  const place = (k) => {
    const [x, y, z, a] = PLACE[cur.current], g = group.current.position
    const tx = wide ? x : 0, ta = (wide ? 0.28 : 0.14) * (wide ? a : 1)
    g.x += (tx - g.x) * k; g.y += (y - g.y) * k; g.z += ((wide ? z : -2) - g.z) * k
    mat.uniforms.uAlpha.value += (ta - mat.uniforms.uAlpha.value) * k
  }
  useEffect(() => { sections.current = [...document.querySelectorAll('[data-scene]')] }, [])

  // reduced motion: snap to static helix
  useEffect(() => {
    if (!reduced) return
    cur.current = 'helix'; prog.current = 1; mat.uniforms.uT.value = 1
    geo.attributes.aFrom.array.set(shapes.helix); geo.attributes.aTo.array.set(shapes.helix)
    geo.attributes.aFrom.needsUpdate = geo.attributes.aTo.needsUpdate = true
    group.current.rotation.y = 0
    place(1)
    invalidate()
  }, [reduced, geo, mat, shapes, invalidate, wide])

  useFrame((_, delta) => {
    if (reduced) return
    const mid = innerHeight / 2
    for (const el of sections.current) {
      const b = el.getBoundingClientRect(), name = el.dataset.scene
      if (b.top <= mid && b.bottom >= mid) {
        if (name !== cur.current && shapes[name]) {
          // freeze current interpolated positions (no burst) into aFrom
          const f = geo.attributes.aFrom, t = geo.attributes.aTo, uT = mat.uniforms.uT.value
          for (let i = 0; i < seed.length; i++) {
            const x = Math.min(Math.max(uT * 1.6 - seed[i] * 0.6, 0), 1), e = x * x * (3 - 2 * x)
            for (let k = i * 3; k < i * 3 + 3; k++) f.array[k] += (t.array[k] - f.array[k]) * e
          }
          t.array.set(shapes[name])
          f.needsUpdate = t.needsUpdate = true
          cur.current = name; prog.current = 0
        }
        break
      }
    }
    place(1 - Math.exp(-delta * 1.8))
    prog.current = Math.min(1, prog.current + delta / 1.4)
    mat.uniforms.uT.value = 1 - (1 - prog.current) ** 3
    face.current += ((cur.current === 'medal' ? 1 : 0) - face.current) * (1 - Math.exp(-delta * 3))
    const now = performance.now()
    group.current.rotation.y = (1 - face.current) * (scrollY * 0.001 + now * 0.00005) + face.current * Math.sin(now * 0.0006) * 0.2
  })

  return (
    <group ref={group} scale={wide ? 1 : 0.7}>
      <points geometry={geo} material={mat} frustumCulled={false} />
    </group>
  )
}

export default function HelixCanvas() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [mobile] = useState(() => matchMedia('(max-width: 768px)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)'), on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return (
    <Canvas
      frameloop={reduced ? 'demand' : 'always'}
      dpr={[1, 1.5]}
      camera={{ fov: 45, position: [0, 0, 12] }}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
    >
      <Scene reduced={reduced} mobile={mobile} />
    </Canvas>
  )
}
