import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

// ─── Slowly drifting large bokeh circles ──────────────────────────────────────
function Bokeh({ count = 18 }) {
  const circles = useMemo(() => Array.from({ length: count }, (_, i) => ({
    x: (Math.random() - 0.5) * 22,
    y: (Math.random() - 0.5) * 13,
    z: -6 - Math.random() * 5,
    radius: 0.4 + Math.random() * 1.4,
    speed: 0.02 + Math.random() * 0.04,
    phase: Math.random() * Math.PI * 2,
    opacity: 0.03 + Math.random() * 0.07,
    color: [
      new THREE.Color('#DB6436'),
      new THREE.Color('#b85c30'),
      new THREE.Color('#7a3d20'),
    ][i % 3],
  })), [count])

  return (
    <>
      {circles.map((c, i) => (
        <DriftCircle key={i} data={c} />
      ))}
    </>
  )
}

function DriftCircle({ data: d }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.x = d.x + Math.sin(t * d.speed + d.phase) * 1.2
    ref.current.position.y = d.y + Math.cos(t * d.speed * 0.7 + d.phase) * 0.8
    ref.current.material.opacity = d.opacity * (0.6 + Math.sin(t * d.speed * 1.5 + d.phase) * 0.4)
  })
  const geo = useMemo(() => new THREE.CircleGeometry(d.radius, 48), [d.radius])
  return (
    <mesh ref={ref} position={[d.x, d.y, d.z]} geometry={geo}>
      <meshBasicMaterial color={d.color} transparent opacity={d.opacity} depthWrite={false} />
    </mesh>
  )
}

// ─── Thin horizontal scan lines scrolling slowly ──────────────────────────────
function ScanLines({ count = 6 }) {
  const lines = useMemo(() => Array.from({ length: count }, (_, i) => ({
    yOffset: (i / count) * 14 - 7,
    speed: 0.06 + Math.random() * 0.08,
    opacity: 0.025 + Math.random() * 0.035,
    width: 16 + Math.random() * 6,
  })), [count])

  const refs = useRef(lines.map(() => null))

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    refs.current.forEach((r, i) => {
      if (!r) return
      const l = lines[i]
      r.position.y = ((l.yOffset + t * l.speed) % 14) - 7
      r.material.opacity = l.opacity * (0.5 + Math.abs(Math.sin(t * 0.3 + i)))
    })
  })

  return (
    <>
      {lines.map((l, i) => (
        <mesh
          key={i}
          ref={el => refs.current[i] = el}
          position={[0, l.yOffset, -4]}
        >
          <planeGeometry args={[l.width, 0.006]} />
          <meshBasicMaterial color="#DB6436" transparent opacity={l.opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </>
  )
}

// ─── Floating dust — tiny warm specks drifting upward ─────────────────────────
function Dust({ count = 120 }) {
  const meshRef = useRef()

  const { geo } = useMemo(() => {
    const pts = [], cols = []
    const palette = [
      new THREE.Color('#DB6436'),
      new THREE.Color('#e8a87c'),
      new THREE.Color('#f5d0b0'),
      new THREE.Color('#a0604a'),
    ]
    const speeds   = new Float32Array(count)
    const offsets  = new Float32Array(count)
    const wobbles  = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6 - 3,
      ))
      const c = palette[i % 4]
      cols.push(c.r, c.g, c.b)
      speeds[i]  = 0.12 + Math.random() * 0.28
      offsets[i] = Math.random() * 100
      wobbles[i] = Math.random() * Math.PI * 2
    }

    const g = new THREE.BufferGeometry().setFromPoints(pts)
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
    g.userData = { speeds, offsets, wobbles, origPts: pts.map(p => p.clone()) }
    return { geo: g }
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const pos = meshRef.current.geometry.attributes.position.array
    const { speeds, offsets, wobbles, origPts } = meshRef.current.geometry.userData

    for (let i = 0; i < count; i++) {
      const rise = ((t * speeds[i] + offsets[i]) % 16) - 8
      pos[i * 3]     = origPts[i].x + Math.sin(t * 0.18 + wobbles[i]) * 0.6
      pos[i * 3 + 1] = origPts[i].y + rise
      pos[i * 3 + 2] = origPts[i].z
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        size={0.055} vertexColors transparent opacity={0.5}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Very slow large radial light pulse from center ───────────────────────────
function RadialPulse() {
  const ref1 = useRef(), ref2 = useRef(), ref3 = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const rings = [ref1, ref2, ref3]
    rings.forEach((r, i) => {
      if (!r.current) return
      const phase = (t * 0.18 + i * 1.1) % 3
      const s = 1 + phase * 4.5
      const op = Math.max(0, 0.06 * (1 - phase / 3))
      r.current.scale.setScalar(s)
      r.current.material.opacity = op
    })
  })

  return (
    <>
      {[ref1, ref2, ref3].map((r, i) => (
        <mesh key={i} ref={r} position={[0, 0, -8]}>
          <ringGeometry args={[1.8, 1.86, 80]} />
          <meshBasicMaterial color="#DB6436" transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ isMobile }) {
  return (
    <>
      <Bokeh count={isMobile ? 10 : 20} />
      <ScanLines count={isMobile ? 4 : 7} />
      <Dust count={isMobile ? 55 : 130} />
      <RadialPulse />
    </>
  )
}

export default function Background3D() {
  const isMobile = useIsMobile()
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 60 }}
    >
      <Scene isMobile={isMobile} />
    </Canvas>
  )
}
