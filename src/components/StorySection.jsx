import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import storyVideo from '../asset/story.mp4'

const STORY_CSS = `
  .story-section { display:flex; flex-direction:row; }
  .story-right   { min-height: 100vh; }

  @media (max-width: 640px) {
    .story-section {
      flex-direction: column !important;
      min-height: unset !important;
    }
    .story-left {
      flex: none !important;
      width: 100% !important;
      min-height: auto !important;
      align-items: center !important;
      text-align: center !important;
      padding: 56px 24px 40px !important;
    }
    .story-left .lamp-wrap {
      margin-left: auto !important;
      margin-right: auto !important;
    }
    .story-right {
      flex: none !important;
      width: 100% !important;
      height: 60vh !important;
      min-height: unset !important;
      position: relative !important;
    }
  }
`

const OPENING = 'Yatharth began with belief.'
const SCROLL_LINES = [
  'Built in 2020.',
  'Grown through people, trust, and intent.',
  'From Mangaluru to conversations beyond borders.',
  "We've never chased noise.",
  "We've built presence.",
  'Every project shaped us.',
  'Every challenge refined us.',
]
const CLOSING = 'Still learning. Still building.'

function useLampTrigger(sectionRef) {
  const [lit, setLit] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      setLit(rect.top <= 0 && rect.bottom > 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionRef])
  return lit
}

// ─── Dust particles ───────────────────────────────────────────────────────────
const PARTICLES = [
  { id: 0, x: '8%',  size: 5,  dur: 6.5, delay: 0   },
  { id: 1, x: '22%', size: 4,  dur: 8.5, delay: 1.2 },
  { id: 2, x: '38%', size: 6,  dur: 7.2, delay: 0.5 },
  { id: 3, x: '55%', size: 3,  dur: 10,  delay: 2.0 },
  { id: 4, x: '70%', size: 5,  dur: 6.0, delay: 0.2 },
  { id: 5, x: '84%', size: 4,  dur: 8.0, delay: 1.6 },
  { id: 6, x: '16%', size: 4,  dur: 9.0, delay: 3.0 },
  { id: 7, x: '48%', size: 3,  dur: 7.8, delay: 2.4 },
  { id: 8, x: '64%', size: 5,  dur: 6.8, delay: 0.9 },
  { id: 9, x: '32%', size: 4,  dur: 11,  delay: 3.5 },
]

function Particle({ p, lit }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: p.x,
        bottom: '-10px',
        width: p.size,
        height: p.size,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,220,130,1) 0%, rgba(255,175,65,0.5) 55%, transparent 100%)',
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
      animate={lit ? {
        y: [0, -600],
        opacity: [0, 0.8, 0.6, 0.8, 0],
      } : { opacity: 0, y: 0 }}
      transition={lit ? {
        duration: p.dur,
        delay: p.delay,
        repeat: Infinity,
        ease: 'linear',
        opacity: { times: [0, 0.1, 0.5, 0.9, 1] },
      } : { duration: 0.3 }}
    />
  )
}

function DustParticles({ lit }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', overflow: 'hidden', zIndex: 1,
    }}>
      {PARTICLES.map(p => <Particle key={p.id} p={p} lit={lit} />)}
    </div>
  )
}

// ─── Tubelight glitch sequence then steady glow ──────────────────────────────
// Returns opacity keyframes simulating a fluorescent tube startup
const GLITCH_OPACITY = [0,1,0,0,1,0.3,0,1,0.6,0,0.8,0,1]
const GLITCH_TIMES   = [0,0.05,0.09,0.13,0.18,0.24,0.30,0.38,0.50,0.60,0.75,0.88,1]

function WallLamp({ lit }) {
  return (
    <div
      aria-hidden
      className="lamp-wrap"
      style={{
        position: 'relative',
        width: 'clamp(100px, 18vw, 180px)',
        height: 'clamp(64px, 10vw, 110px)',
        marginBottom: 'clamp(16px, 2.5vw, 32px)',
        flexShrink: 0,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {/* ── Wide cone — centered light falling down ── */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={lit ? { opacity: GLITCH_OPACITY, scaleY: [0,...GLITCH_OPACITY.map(o => o > 0 ? 1 : 0)] } : { opacity: 0, scaleY: 0 }}
        transition={lit
          ? { duration: 1.6, times: GLITCH_TIMES, ease: 'linear' }
          : { duration: 0.3 }}
        style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center',
          width: 'clamp(300px, 55vw, 680px)',
          height: 'clamp(420px, 70vw, 900px)',
          background: 'conic-gradient(from -30deg at 50% 0%, transparent 0deg, rgba(255,200,100,0.14) 22deg, rgba(255,222,130,0.38) 34deg, rgba(255,200,100,0.14) 46deg, transparent 68deg)',
          filter: 'blur(1px)',
          zIndex: 0,
        }}
      />

      {/* ── Soft radial fill in cone center ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={lit ? { opacity: GLITCH_OPACITY } : { opacity: 0 }}
        transition={lit ? { duration: 1.6, times: GLITCH_TIMES } : { duration: 0.3 }}
        style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(200px, 34vw, 460px)',
          height: 'clamp(300px, 50vw, 650px)',
          background: 'radial-gradient(ellipse 46% 100% at 50% 0%, rgba(255,185,80,0.28) 0%, rgba(255,155,55,0.08) 55%, transparent 80%)',
          filter: 'blur(14px)',
          zIndex: 0,
        }}
      />

      {/* ── Floor pool — wide ambient glow at bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={lit ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: lit ? 1.7 : 0 }}
        style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(360px, 65vw, 800px)',
          height: 'clamp(500px, 80vw, 1000px)',
          background: 'radial-gradient(ellipse 70% 60% at 50% 85%, rgba(219,100,54,0.13) 0%, transparent 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* ── Wall halo ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={lit ? { opacity: GLITCH_OPACITY, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={lit ? { duration: 1.6, times: GLITCH_TIMES } : { duration: 0.3 }}
        style={{
          position: 'absolute',
          top: '28%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(110px, 20vw, 240px)',
          height: 'clamp(110px, 20vw, 240px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,210,100,0.7) 0%, rgba(255,160,55,0.2) 42%, transparent 68%)',
          filter: 'blur(18px)',
          zIndex: 0,
        }}
      />

      {/* ── SVG lamp — refined pendant with chain ── */}
      <svg viewBox="0 0 120 100" fill="none"
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>

        {/* Ceiling rose */}
        <ellipse cx="60" cy="2" rx="14" ry="3" fill="#1e1812" stroke="#322818" strokeWidth="0.6"/>

        {/* Chain links */}
        {[8,14,20,26,32].map((y, i) => (
          <ellipse key={i} cx="60" cy={y} rx="2.5" ry="1.5"
            fill="none" stroke="#2a1e14" strokeWidth="0.9"/>
        ))}

        {/* Shade top cap */}
        <ellipse cx="60" cy="38" rx="20" ry="5" fill="#1c1510" stroke="#2e2018" strokeWidth="0.7"/>

        {/* Shade outer — wider more dramatic flare */}
        <path d="M40 38 Q30 56 33 70 Q42 86 60 88 Q78 86 87 70 Q90 56 80 38 Z"
          fill="#1a1208" stroke="#2a1c10" strokeWidth="0.8"/>

        {/* Shade inner ridge line */}
        <path d="M44 40 Q36 57 39 70 Q47 83 60 85 Q73 83 81 70 Q84 57 76 40"
          fill="none" stroke="#241a0e" strokeWidth="0.5" opacity="0.6"/>

        {/* Bottom rim */}
        <ellipse cx="60" cy="87" rx="26" ry="5.5" fill="#141009" stroke="#2a1c10" strokeWidth="0.7"/>

        {/* Rim inner lip */}
        <ellipse cx="60" cy="87" rx="22" ry="4" fill="#100d07" stroke="none"/>

        {/* Inner shade glow */}
        <motion.path
          d="M42 40 Q33 57 36 70 Q45 84 60 86 Q75 84 84 70 Q87 57 78 40 Z"
          initial={{ fill: 'rgba(0,0,0,0)' }}
          animate={lit ? { fill: GLITCH_OPACITY.map(o => `rgba(255,140,45,${o * 0.42})`) } : { fill: 'rgba(0,0,0,0)' }}
          transition={lit ? { duration: 1.6, times: GLITCH_TIMES } : { duration: 0.2 }}
        />

        {/* Rim glow */}
        <motion.ellipse cx="60" cy="86" rx="21" ry="3.5"
          initial={{ fill: 'rgba(0,0,0,0)' }}
          animate={lit ? { fill: 'rgba(255,165,60,0.3)' } : { fill: 'rgba(0,0,0,0)' }}
          transition={{ duration: 0.4, delay: lit ? 1.7 : 0 }}
        />

        {/* Bulb body */}
        <motion.ellipse cx="60" cy="61" rx="7" ry="9"
          initial={{ fill: '#1a1008' }}
          animate={lit ? { fill: GLITCH_OPACITY.map(o => o > 0.5 ? '#fff8c0' : '#1a1008') } : { fill: '#1a1008' }}
          transition={lit ? { duration: 1.6, times: GLITCH_TIMES } : { duration: 0.2 }}
        />

        {/* Bulb glow halo */}
        <motion.ellipse cx="60" cy="61" rx="15" ry="18"
          initial={{ opacity: 0 }}
          animate={lit ? { opacity: GLITCH_OPACITY.map(o => o * 0.65) } : { opacity: 0 }}
          transition={lit ? { duration: 1.6, times: GLITCH_TIMES } : { duration: 0.2 }}
          fill="rgba(255,220,110,0.55)" filter="url(#bGlow)"
        />

        <defs>
          <filter id="bGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>

      {/* ── Steady breathing pulse after glitch settles ── */}
      <AnimatePresence>
        {lit && (
          <motion.div
            key="pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.45, 0.9, 0.45] }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(28px, 5vw, 52px)',
              height: 'clamp(28px, 5vw, 52px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,235,150,1) 0%, rgba(255,195,70,0.4) 52%, transparent 75%)',
              filter: 'blur(6px)',
              zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Video panel ───────────────────────────────────────────────────────────────
function StoryVideo({ lit }) {
  const videoRef = useRef(null)
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (lit) { v.currentTime = 0; v.play().catch(() => {}) }
    else v.pause()
  }, [lit])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={lit ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: lit ? 0.9 : 0.35, delay: lit ? 0.55 : 0 }}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <video
        ref={videoRef}
        src={storyVideo}
        muted loop playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {/* Desktop: fade left edge into text. Mobile: fade top edge into text above */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, #0a0806 0%, transparent 20%), linear-gradient(to bottom, #0a0806 0%, transparent 18%)',
        pointerEvents: 'none',
      }}/>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StorySection() {
  const sectionRef = useRef(null)
  const lit = useLampTrigger(sectionRef)

  const fadeText = (delayOn) => ({
    initial: { opacity: 0 },
    animate: lit ? { opacity: 1 } : { opacity: 0 },
    transition: lit
      ? { duration: 0.65, delay: delayOn, ease: [0.25, 0.46, 0.45, 0.94] }
      : { duration: 0.3, ease: 'easeIn' },
  })

  return (
    <>
    <style>{STORY_CSS}</style>
    <section
      ref={sectionRef}
      className="story-section"
      style={{
        position: 'relative',
        zIndex: 10,
        background: '#0a0806',
        minHeight: '100vh',
        alignItems: 'stretch',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.7)',
        overflow: 'hidden',
      }}
    >
      {/* ── Left: lamp + text in flow ── */}
      <div
        className="story-left"
        style={{
          flex: '0 0 clamp(280px, 45%, 560px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 'clamp(24px, 5vw, 48px) clamp(24px, 5vw, 80px)',
          minHeight: '100vh',
          minWidth: 0,
          position: 'relative',
          zIndex: 3,
          transition: 'padding 0.4s ease',
        }}
      >
        {/* ── Moving light background ── */}
        <AnimatePresence>
          {lit && (
            <motion.div
              key="wall-lights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              aria-hidden
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
            >
              {/* Slow drifting orb 1 — warm orange */}
              <motion.div
                animate={{ x: ['0%', '18%', '-10%', '0%'], y: ['0%', '-20%', '14%', '0%'] }}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: '20%', left: '15%',
                  width: '55%', height: '40%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(219,100,54,0.07) 0%, transparent 70%)',
                  filter: 'blur(28px)',
                }}
              />

              {/* Slow drifting orb 2 — amber */}
              <motion.div
                animate={{ x: ['0%', '-15%', '20%', '0%'], y: ['0%', '18%', '-12%', '0%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                style={{
                  position: 'absolute', top: '45%', left: '30%',
                  width: '60%', height: '45%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(200,140,60,0.05) 0%, transparent 68%)',
                  filter: 'blur(34px)',
                }}
              />

              {/* Slow drifting orb 3 — cool white edge */}
              <motion.div
                animate={{ x: ['0%', '12%', '-18%', '0%'], y: ['0%', '-14%', '10%', '0%'] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
                style={{
                  position: 'absolute', top: '10%', left: '40%',
                  width: '50%', height: '50%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(240,210,170,0.03) 0%, transparent 65%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Thin vertical light ray sweeping slowly */}
              <motion.div
                animate={{ x: ['-10%', '110%'] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 1 }}
                style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: 0, width: '3%',
                  background: 'linear-gradient(to right, transparent, rgba(219,100,54,0.07), transparent)',
                  filter: 'blur(6px)',
                }}
              />

              {/* Second slower ray */}
              <motion.div
                animate={{ x: ['-10%', '110%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 5 }}
                style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: 0, width: '2%',
                  background: 'linear-gradient(to right, transparent, rgba(240,180,100,0.05), transparent)',
                  filter: 'blur(8px)',
                }}
              />

              {/* Wall text — exact center */}
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                zIndex: 2,
                width: '100%',
              }}>
                <span style={{
                  fontFamily: "'Georgia', serif", fontSize: 'clamp(9px, 1.2vw, 12px)',
                  letterSpacing: '3px', color: 'rgba(210,185,145,0.38)',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>Where The Magic Happens</span>
                <span style={{
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: 'clamp(28px, 5vw, 52px)',
                  letterSpacing: '3px', color: 'rgba(195,162,110,0.12)',
                  whiteSpace: 'nowrap',
                }}>yatharth</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dust particles in background */}
        <DustParticles lit={lit} />

        {/* Lamp sits here in flow — above the heading */}
        <WallLamp lit={lit} />

        {/* Text block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.6vw, 20px)' }}>

          <motion.p
            {...fadeText(0.38)}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(1.2rem, 2.4vw, 2rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              color: '#ffffff',
              margin: '0 0 clamp(12px, 2vw, 24px) 0',
            }}
          >
            {OPENING}
          </motion.p>

          {SCROLL_LINES.map((line, i) => (
            <motion.p
              key={i}
              {...fadeText(0.46 + i * 0.065)}
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: 'clamp(0.85rem, 1.7vw, 1.2rem)',
                letterSpacing: '-0.01em',
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.68)',
                margin: 0,
              }}
            >
              {line}
            </motion.p>
          ))}

          <motion.p
            {...fadeText(0.46 + SCROLL_LINES.length * 0.065 + 0.1)}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.95rem, 1.9vw, 1.4rem)',
              letterSpacing: '-0.015em',
              lineHeight: 1.4,
              color: 'rgba(219,100,54,0.9)',
              margin: 'clamp(12px, 2vw, 24px) 0 0 0',
            }}
          >
            {CLOSING}
          </motion.p>
        </div>
      </div>

      {/* ── Right: video fills remaining space ── */}
      <div
        className="story-right"
        style={{ flex: '1 1 0', minWidth: 0, position: 'relative' }}
      >
        <StoryVideo lit={lit} />
      </div>
    </section>
    </>
  )
}
