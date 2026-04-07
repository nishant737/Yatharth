import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import craftBg from '../asset/craft.jpeg'
import storyVideo from '../asset/story.mp4'

// ─── Responsive grid CSS ──────────────────────────────────────────────────────

// ─── Parallax 3D background ──────────────────────────────────────────────────
const ORBS = [
  { x: '12%',  y: '18%',  size: 340, color: 'rgba(219,100,54,0.055)', blur: 80,  depth: 0.04 },
  { x: '72%',  y: '12%',  size: 260, color: 'rgba(200,90,48,0.045)',  blur: 60,  depth: 0.07 },
  { x: '85%',  y: '65%',  size: 420, color: 'rgba(219,100,54,0.035)', blur: 100, depth: 0.025 },
  { x: '30%',  y: '75%',  size: 220, color: 'rgba(161,149,140,0.04)', blur: 55,  depth: 0.09 },
  { x: '55%',  y: '45%',  size: 300, color: 'rgba(219,100,54,0.025)', blur: 90,  depth: 0.015 },
]

const SHAPES = [
  { x: 18,  y: 22,  size: 80,  type: 'ring',    rot: 15,  depth: 0.12, dur: 18 },
  { x: 80,  y: 15,  size: 50,  type: 'ring',    rot: -30, depth: 0.18, dur: 22 },
  { x: 70,  y: 70,  size: 100, type: 'ring',    rot: 45,  depth: 0.08, dur: 28 },
  { x: 10,  y: 72,  size: 60,  type: 'cross',   rot: 20,  depth: 0.15, dur: 16 },
  { x: 90,  y: 45,  size: 40,  type: 'cross',   rot: -15, depth: 0.22, dur: 20 },
  { x: 45,  y: 10,  size: 70,  type: 'diamond', rot: 0,   depth: 0.1,  dur: 24 },
  { x: 25,  y: 50,  size: 45,  type: 'diamond', rot: 30,  depth: 0.2,  dur: 14 },
  { x: 60,  y: 85,  size: 55,  type: 'ring',    rot: -45, depth: 0.13, dur: 19 },
]

function ParallaxOrb({ orb, smoothX, smoothY }) {
  const tx = useTransform(smoothX, v => v * orb.depth * -600)
  const ty = useTransform(smoothY, v => v * orb.depth * -600)
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: orb.x, top: orb.y,
        width: orb.size, height: orb.size,
        borderRadius: '50%',
        background: orb.color,
        filter: `blur(${orb.blur}px)`,
        x: tx, y: ty,
        translateX: '-50%', translateY: '-50%',
        pointerEvents: 'none',
      }}
    />
  )
}

function ParallaxShape({ s, smoothX, smoothY }) {
  const tx = useTransform(smoothX, v => v * s.depth * -700)
  const ty = useTransform(smoothY, v => v * s.depth * -700)
  const base = {
    position: 'absolute',
    left: `${s.x}%`, top: `${s.y}%`,
    width: s.size, height: s.size,
    x: tx, y: ty,
    translateX: '-50%', translateY: '-50%',
    opacity: 0.13,
    pointerEvents: 'none',
  }
  if (s.type === 'ring') return (
    <motion.div style={base} animate={{ rotate: [s.rot, s.rot + 360] }} transition={{ duration: s.dur, repeat: Infinity, ease: 'linear' }}>
      <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" stroke="#DB6436" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="34" stroke="rgba(219,100,54,0.4)" strokeWidth="0.8" strokeDasharray="6 4" />
      </svg>
    </motion.div>
  )
  if (s.type === 'cross') return (
    <motion.div style={base} animate={{ rotate: [s.rot, s.rot + 180] }} transition={{ duration: s.dur, repeat: Infinity, ease: 'linear' }}>
      <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none">
        <line x1="50" y1="8"  x2="50" y2="92" stroke="#DB6436" strokeWidth="1.5" />
        <line x1="8"  y1="50" x2="92" y2="50" stroke="#DB6436" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="4" fill="rgba(219,100,54,0.6)" />
      </svg>
    </motion.div>
  )
  return (
    <motion.div style={base} animate={{ rotate: [s.rot, s.rot + 360] }} transition={{ duration: s.dur, repeat: Infinity, ease: 'linear' }}>
      <svg width={s.size} height={s.size} viewBox="0 0 100 100" fill="none">
        <rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" stroke="#DB6436" strokeWidth="1.5" />
        <rect x="34" y="34" width="32" height="32" transform="rotate(45 50 50)" stroke="rgba(219,100,54,0.35)" strokeWidth="0.8" />
      </svg>
    </motion.div>
  )
}

function ParallaxBackground() {
  const mouseX  = useMotionValue(0)
  const mouseY  = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 28, mass: 1.2 })
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 28, mass: 1.2 })
  const containerRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      // only respond when mouse is within the section bounds
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        mouseX.set(0); mouseY.set(0); return
      }
      mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
      mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* ── Subtle grid ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(219,100,54,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(219,100,54,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 20%, transparent 100%)',
      }} />

      {/* ── Orbs ── */}
      {ORBS.map((orb, i) => (
        <ParallaxOrb key={i} orb={orb} smoothX={smoothX} smoothY={smoothY} />
      ))}

      {/* ── Shapes ── */}
      {SHAPES.map((s, i) => (
        <ParallaxShape key={i} s={s} smoothX={smoothX} smoothY={smoothY} />
      ))}

      {/* ── Pulsing rings at center ── */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 520, height: 520,
          translateX: '-50%', translateY: '-50%',
          borderRadius: '50%',
          border: '1px solid rgba(219,100,54,0.35)',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.025, 0.055, 0.025] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 780, height: 780,
          translateX: '-50%', translateY: '-50%',
          borderRadius: '50%',
          border: '1px solid rgba(219,100,54,0.2)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ─── Service data ─────────────────────────────────────────────────────────────
const SERVICES = [
  { num: '01', title: 'Brand Strategy',        desc: 'We define how you are seen.',       icon: '◎', accent: '#DB6436' },
  { num: '02', title: 'Digital Marketing',     desc: 'We make sure you are found.',       icon: '◈', accent: '#C85A30' },
  { num: '03', title: 'Content & Storytelling',desc: 'We give your brand a voice.',       icon: '❖', accent: '#C85A30' },
  { num: '04', title: 'Creative Direction',    desc: 'We shape how it feels.',            icon: '✦', accent: '#DB6436' },
  { num: '05', title: 'Social Presence',       desc: 'We build how you show up daily.',   icon: '◇', accent: '#C85A30' },
]

// ─── Single service card (flip on hover/tap → video on back) ─────────────────
function ServiceCard({ service, index }) {
  const [flipped, setFlipped] = useState(false)
  const videoRef  = useRef(null)
  const isTouchRef = useRef(false)   // tracks whether last interaction was touch

  const startFlip = () => {
    setFlipped(true)
    setTimeout(() => { videoRef.current?.play().catch(() => {}) }, 280)
  }
  const endFlip = () => {
    setFlipped(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // Desktop: hover in/out
  const handleEnter = () => { if (!isTouchRef.current) startFlip() }
  const handleLeave = () => { if (!isTouchRef.current) endFlip() }

  // Mobile: tap toggles flip
  const handleTap = () => {
    isTouchRef.current = true
    flipped ? endFlip() : startFlip()
    // reset touch flag after a short delay so mouse still works on hybrid devices
    setTimeout(() => { isTouchRef.current = false }, 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={handleEnter}
      onHoverEnd={handleLeave}
      onTapStart={handleTap}
      style={{
        perspective: '1000px',
        minHeight: 'clamp(280px, 40vw, 340px)',
        cursor: 'pointer',
      }}
    >
      {/* ── Flip container ── */}
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%',
          minHeight: 'clamp(280px, 40vw, 340px)',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >

        {/* ════ FRONT FACE ════ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '18px',
          background: 'linear-gradient(145deg, rgba(26,22,18,0.97) 0%, rgba(14,11,9,0.99) 100%)',
          border: `1px solid ${flipped ? service.accent + '45' : 'rgba(161,149,140,0.12)'}`,
          padding: 'clamp(28px, 3.5vw, 42px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          overflow: 'hidden',
          transition: 'border-color 0.4s ease',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
        }}>
          {/* Radial glow */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '18px', pointerEvents: 'none',
            background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${service.accent}14 0%, transparent 70%)`,
          }} />

          {/* Corner sparkle */}
          <div style={{
            position: 'absolute', top: '18px', right: '20px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: service.accent,
            boxShadow: `0 0 10px 3px ${service.accent}66`,
            pointerEvents: 'none',
          }} />

          {/* Number */}
          <span style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 400, fontSize: '0.68rem',
            letterSpacing: '0.22em', color: service.accent,
            textTransform: 'uppercase', opacity: 0.5,
          }}>
            {service.num}
          </span>

          {/* Icon */}
          <span style={{
            fontSize: 'clamp(2rem, 3.2vw, 2.7rem)',
            color: service.accent, lineHeight: 1,
            display: 'inline-block', width: 'fit-content',
          }}>
            {service.icon}
          </span>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 500, fontSize: 'clamp(1rem, 1.8vw, 1.22rem)',
            color: '#f5f0eb', margin: 0,
          }}>
            {service.title}
          </h3>

          {/* Divider */}
          <div style={{ height: '1px', background: `linear-gradient(90deg, ${service.accent}88, transparent)`, borderRadius: '1px' }} />

          {/* Description */}
          <p style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300, fontSize: 'clamp(0.8rem, 1.35vw, 0.92rem)',
            lineHeight: 1.65, color: 'rgba(245,240,235,0.55)', margin: 0,
          }}>
            {service.desc}
          </p>

          {/* Hover hint */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginTop: 'auto', paddingTop: '4px',
            opacity: 0.6,
          }}>
            <div style={{ width: '20px', height: '1px', background: service.accent }} />
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 400, fontSize: '0.65rem',
              letterSpacing: '0.18em', color: service.accent,
              textTransform: 'uppercase',
            }}>
              Watch
            </span>
          </div>
        </div>

        {/* ════ BACK FACE ════ */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: '18px',
          overflow: 'hidden',
          border: `1px solid ${service.accent}55`,
          boxShadow: `0 20px 56px rgba(0,0,0,0.6), 0 0 48px ${service.accent}18`,
        }}>
          {/* Video */}
          <video
            ref={videoRef}
            src={storyVideo}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Dark gradient overlay at bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to top, rgba(8,5,3,0.85) 0%, transparent 55%)`,
            pointerEvents: 'none',
          }} />

          {/* Service title overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: 'clamp(16px,2.5vw,24px)',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 400, fontSize: '0.6rem',
              letterSpacing: '0.22em', color: service.accent,
              textTransform: 'uppercase',
            }}>
              {service.num}
            </span>
            <span style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 500, fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
              color: '#f5f0eb', letterSpacing: '-0.01em',
            }}>
              {service.title}
            </span>
          </div>

          {/* Play indicator */}
          <div style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: `${service.accent}22`,
            border: `1px solid ${service.accent}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1l8 5-8 5V1z" fill={service.accent}/>
            </svg>
          </div>
        </div>

      </motion.div>
    </motion.div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
const VISIBLE = 3                                        // cards visible at once
const PAGES   = Math.ceil(SERVICES.length / VISIBLE)     // 2 pages: [0,1,2] + [3,4]

function ArrowBtn({ dir, onClick, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '44px', height: '44px',
        borderRadius: '50%',
        border: `1px solid ${hov && !disabled ? 'rgba(219,100,54,0.55)' : 'rgba(161,149,140,0.18)'}`,
        background: hov && !disabled ? 'rgba(219,100,54,0.08)' : 'transparent',
        color: disabled ? 'rgba(161,149,140,0.2)' : hov ? '#DB6436' : 'rgba(245,240,235,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.28s ease',
        outline: 'none',
        flexShrink: 0,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        {dir === 'prev'
          ? <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M6 3L11 8L6 13"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  )
}

export default function CraftSection({ onCenterCardChange }) {
  const [active, setActive] = useState(0)
  const dir = useRef(1)

  const go = (next) => {
    dir.current = next > active ? 1 : -1
    setActive(next)
  }

  const page    = Math.round(active / VISIBLE)           // 0 or 1
  const visible = SERVICES.slice(active, active + VISIBLE)

  // Center card = index 1 when 3 cards visible, index 0 when ≤ 2 cards visible
  useEffect(() => {
    const centerIdx = visible.length >= 3 ? 1 : 0
    onCenterCardChange?.(visible[centerIdx])
  }, [active]) // eslint-disable-line

  return (
    <section
      style={{

        position: 'relative',
        zIndex: 10,
        background: '#0a0806',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 60px)',
        overflow: 'hidden',
      }}
    >
      {/* Grid CSS injected safely inside the render tree */}
      <style>{`
        .craft-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(14px, 2vw, 26px);
          width: 100%;
        }
        @media (max-width: 1023px) {
          .craft-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 599px) {
          .craft-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── Parallax 3D background ── */}
      <ParallaxBackground />

      {/* ── Craft image background (low opacity) ── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${craftBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />

      {/* Section heading */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          letterSpacing: '-0.03em',
          color: '#f5f0eb',
          margin: '0 0 48px',
        }}
      >
        Our Services
      </motion.h2>

      {/* ── 3-card slider ── */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          width: '100%',
          maxWidth: '1100px',
          overflow: 'visible',
          padding: '16px 4px 4px',
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ x: dir.current * 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir.current * -80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="craft-grid"
            style={{}}
          >
            {visible.map((service) => (
              <ServiceCard key={service.title} service={service} index={0} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controls: arrows + dots ── */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: 'clamp(28px, 4vw, 44px)',
        }}
      >
        <ArrowBtn dir="prev" onClick={() => go(active - VISIBLE)} disabled={active === 0} />

        {/* Dot indicators — one dot per page */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {Array.from({ length: PAGES }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i * VISIBLE)}
              style={{
                width: i === page ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                border: 'none',
                background: i === page ? '#DB6436' : 'rgba(161,149,140,0.28)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                outline: 'none',
              }}
            />
          ))}
        </div>

        <ArrowBtn dir="next" onClick={() => go(active + VISIBLE)} disabled={active + VISIBLE >= SERVICES.length} />
      </div>

      {/* Bottom accent line */}
      <div
        aria-hidden
        style={{
          width: 'clamp(40px, 8vw, 80px)',
          height: '1px',
          background: 'rgba(219,100,54,0.25)',
          marginTop: 'clamp(40px, 6vw, 72px)',
        }}
      />
    </section>
  )
}
