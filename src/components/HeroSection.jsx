import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import bgImage from '../asset/bg.jpeg'
import Background3D from './Background3D'

// ─── Frame Data ────────────────────────────────────────────────────────────────
// accent = radial tint that bleeds over the bg image per frame
// alternating between the brand orange and the warm neutral
const FRAMES = [
  { id: 0, lines: ['Everything begins with an idea.']                        },
  { id: 1, lines: ['Some stay ideas.', 'Some become presence.']              },
  { id: 2, lines: ['We work on the ones that matter.']                       },
  { id: 3, lines: ['In a digital world,', 'how you are seen is everything.'] },
  { id: 4, lines: ['So we shape that. Carefully.']                           },
  { id: 5, lines: ['Strategy. Story. Design.']                               },
  { id: 6, lines: ['This is Yatharth.']                                      },
  { id: 7, lines: ['Founded in 2020.', 'Built on clarity.']                  },
  { id: 8, lines: ["Come see what we've built."]                             },
]

// Reduced so each scroll step feels snappy — user gets immediate frame feedback
const SCROLL_PER_FRAME = 140

// ─── Typewriter Hook ───────────────────────────────────────────────────────────
// Faster chars so the full text appears before the user loses patience
function useTypewriter(lines, { minDelay = 18, maxDelay = 48 } = {}) {
  const [lineTexts, setLineTexts] = useState(lines.map(() => ''))
  const [done, setDone]           = useState(false)
  const timerRef                  = useRef(null)

  useEffect(() => {
    setLineTexts(lines.map(() => ''))
    setDone(false)
    let li = 0, ci = 0, cancelled = false

    const tick = () => {
      if (cancelled) return
      const line = lines[li]
      if (ci < line.length) {
        ci++
        setLineTexts(prev => { const n = [...prev]; n[li] = line.slice(0, ci); return n })
        timerRef.current = setTimeout(tick, minDelay + Math.random() * (maxDelay - minDelay))
      } else if (li < lines.length - 1) {
        li++; ci = 0
        timerRef.current = setTimeout(tick, 120) // shorter inter-line pause
      } else {
        setDone(true)
      }
    }
    // No initial pause — start typing immediately on frame mount
    timerRef.current = setTimeout(tick, 0)
    return () => { cancelled = true; clearTimeout(timerRef.current) }
  }, [lines.join('|')]) // eslint-disable-line

  return { lineTexts, done }
}

// ─── Font map ─────────────────────────────────────────────────────────────────
const FONT = {
  sans: { family: "'Inter', system-ui, sans-serif", weight: 300, spacing: '-0.015em' },
}

// ─── Cursor ────────────────────────────────────────────────────────────────────
function Cursor({ show }) {
  return (
    <motion.span
      aria-hidden
      style={{ display:'inline-block', width:'2px', height:'1em', background:'#DB6436',
               marginLeft:'4px', verticalAlign:'middle', borderRadius:'1px', flexShrink:0 }}
      animate={{ opacity: show ? [1, 0] : 0 }}
      transition={show ? { duration:0.55, repeat:Infinity, repeatType:'reverse', ease:'steps(1)' } : { duration:0.1 }}
    />
  )
}

// ─── Story Frame ───────────────────────────────────────────────────────────────
function StoryFrame({ frame }) {
  const font = FONT.sans
  const { lineTexts, done } = useTypewriter(frame.lines)

  return (
    <motion.div
      key={frame.id}
      initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
      exit={{    opacity: 0, y: -10, filter: 'blur(3px)' }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
               alignItems:'center', justifyContent:'center',
               padding:'0 clamp(24px, 8vw, 120px)', gap:'0.25em' }}
    >
      {lineTexts.map((text, i) => {
        const isLast = i === lineTexts.length - 1
        return (
          <p
            key={i}
            style={{
              fontFamily:    font.family,
              fontWeight:    font.weight,
              fontSize:      'clamp(1.6rem, 4vw, 3.6rem)',
              lineHeight:    1.28,
              letterSpacing: font.spacing,
              color:         '#ffffff',
              maxWidth:      '820px',
              textAlign:     'center',
              userSelect:    'none',
              margin:        0,
              textShadow:    '0 2px 24px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,1)',
            }}
          >
            {text}
            {isLast && !done && <Cursor show />}
          </p>
        )
      })}
    </motion.div>
  )
}

// ─── Static background image ──────────────────────────────────────────────────
function StaticBackground() {
  return (
    <img
      src={bgImage}
      alt=""
      aria-hidden
      style={{
        position:   'absolute',
        inset:      0,
        width:      '100%',
        height:     '100%',
        objectFit:  'cover',
        objectPosition: 'center',
        display:    'block',
        zIndex:     0,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  )
}




// ─── Scroll hint ───────────────────────────────────────────────────────────────
function ScrollHint({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ delay:1.4, duration:0.7 }}
          style={{ position:'absolute', bottom:'40px', left:'50%', transform:'translateX(-50%)',
                   display:'flex', flexDirection:'column', alignItems:'center', gap:'8px',
                   pointerEvents:'none', zIndex:10 }}
        >
          {/* Mouse scroll icon */}
          <div style={{
            width:'22px', height:'34px', border:'1.5px solid rgba(219,100,54,0.45)',
            borderRadius:'11px', display:'flex', alignItems:'flex-start',
            justifyContent:'center', paddingTop:'5px',
          }}>
            <motion.div
              animate={{ y:[0, 10, 0], opacity:[1, 0, 1] }}
              transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }}
              style={{ width:'3px', height:'6px', background:'#DB6436', borderRadius:'2px' }}
            />
          </div>
          <span style={{ fontSize:'0.55rem', letterSpacing:'0.22em', color:'rgba(219,100,54,0.55)',
                         textTransform:'uppercase', fontFamily:"'Inter', sans-serif" }}>Scroll</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


// ─── Frame counter ────────────────────────────────────────────────────────────
function FrameLabel({ current, total }) {
  return (
    <motion.div key={current} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}
      style={{ position:'absolute', bottom:'44px', left:'clamp(24px,4vw,56px)',
               fontSize:'0.57rem', letterSpacing:'0.2em', color:'rgba(161,149,140,0.5)',
               fontFamily:"'Inter', sans-serif", textTransform:'uppercase', userSelect:'none', zIndex:10 }}>
      {String(current + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef(null)
  const [frameIdx, setFrameIdx] = useState(0)

  // Use a ref to always have the latest index — avoids stale closure in scroll handler
  const frameIdxRef = useRef(0)

  const sectionHeight = FRAMES.length * SCROLL_PER_FRAME + window.innerHeight

  const onScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const scrolled   = window.scrollY - sectionTop
    const raw        = scrolled < 0 ? 0 : Math.floor(scrolled / SCROLL_PER_FRAME)
    const next       = Math.min(Math.max(raw, 0), FRAMES.length - 1)
    // Only trigger a re-render when the frame actually changes
    if (next !== frameIdxRef.current) {
      frameIdxRef.current = next
      setFrameIdx(next)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <>
      {/* Scroll spacer — tall enough for all typewriter frames */}
      <div ref={sectionRef} style={{ height:`${sectionHeight}px`, position:'relative' }}>
        {/* Fixed visual layer — stays behind everything */}
        <div style={{
          position:'fixed', top:0, left:0, height:'100vh', width:'100%', overflow:'hidden',
          zIndex:0,
        }}>

          {/* ── Layer 0: Raw background image — untouched ── */}
          <StaticBackground />

          {/* ── Layer 0.5: Light vignette — lets bg.jpeg breathe ── */}
          <div style={{
            position:'absolute', inset:0, zIndex:0,
            
          }} />

          {/* ── Layer 1: 3D animated background ── */}
          <Background3D />

          {/* ── Layer 2: Frame text ── */}
          <div style={{ position:'absolute', inset:0, zIndex:2 }}>
            <AnimatePresence mode="sync">
              <StoryFrame key={frameIdx} frame={FRAMES[frameIdx]} />
            </AnimatePresence>
          </div>

          {/* ── UI chrome ── */}
          <div style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none' }}>
            <FrameLabel current={frameIdx} total={FRAMES.length} />
            <ScrollHint visible={frameIdx === 0} />
          </div>
        </div>
      </div>
    </>
  )
}
