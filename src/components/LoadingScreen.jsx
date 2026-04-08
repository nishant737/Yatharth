import { useEffect, useState } from 'react'
import { motion, animate, useMotionValue, useTransform, useSpring } from 'framer-motion'
import logo from '../asset/logo.png'

export default function LoadingScreen({ onComplete }) {
  const [phase,   setPhase]   = useState('idle')   // idle → loading → exit → done
  const raw     = useMotionValue(0)                 // 0–100, animated directly
  const spring  = useSpring(raw, { stiffness: 38, damping: 20, mass: 1.1 })
  const barW    = useTransform(spring, v => `${v}%`)
  const [count, setCount] = useState(0)

  // Keep numeric counter in sync with spring
  useEffect(() => spring.on('change', v => setCount(Math.round(v))), [spring])

  useEffect(() => {
    // Brief pause so enter animations finish, then run the progress
    const t = setTimeout(() => {
      setPhase('loading')
      const ctrl = animate(raw, 100, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => {
          setTimeout(() => setPhase('exit'), 380)
          setTimeout(() => { setPhase('done'); onComplete() }, 1280)
        },
      })
      return () => ctrl.stop()
    }, 350)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  if (phase === 'done') return null

  // Fade out vanish: opacity only
  return (
    <motion.div
      animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
      transition={phase === 'exit'
        ? { duration: 1.7, ease: [0.4, 0, 0.2, 1] }
        : { duration: 0 }
      }
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0a0806',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      {/* Noise */}
      <svg aria-hidden style={{
        position:'absolute',inset:0,width:'100%',height:'100%',
        opacity:0.03,pointerEvents:'none',
      }}>
        <filter id="nl">
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="4" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#nl)"/>
      </svg>

      {/* Ambient glow */}
      <motion.div
        aria-hidden
        animate={{ scale:[1,1.2,1], opacity:[0.07,0.16,0.07] }}
        transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
        style={{
          position:'absolute',
          width:'55vw',height:'55vw',
          maxWidth:520,maxHeight:520,
          borderRadius:'50%',
          background:'radial-gradient(circle,#DB6436 0%,transparent 68%)',
          filter:'blur(70px)',
          pointerEvents:'none',
        }}
      />


      {/* Logo */}
      <motion.img
        src={logo}
        alt="Yatharth"
        draggable={false}
        initial={{ opacity:0, scale:0.78, y:20 }}
        animate={{ opacity:1, scale:1,    y:0  }}
        transition={{ duration:1.1, ease:[0.22,1,0.36,1] }}
        style={{
          position:'relative', zIndex:1,
          height:'clamp(42px,7vw,68px)',
          width:'auto',
          objectFit:'contain',
          userSelect:'none',
          pointerEvents:'none',
          marginBottom:56,
        }}
      />

      {/* Progress block */}
      <motion.div
        initial={{ opacity:0, y:14 }}
        animate={{ opacity:1, y:0  }}
        transition={{ delay:0.45, duration:0.8, ease:[0.22,1,0.36,1] }}
        style={{
          position:'relative', zIndex:1,
          display:'flex', flexDirection:'column',
          alignItems:'center', gap:14,
          width:'clamp(130px,26vw,210px)',
        }}
      >
        {/* Bar track */}
        <div style={{
          width:'100%', height:'1px',
          background:'rgba(245,240,235,0.07)',
          borderRadius:2, overflow:'hidden',
          position:'relative',
        }}>
          {/* Animated fill */}
          <motion.div style={{
            position:'absolute', top:0, left:0, bottom:0,
            background:'linear-gradient(90deg,#C85A30,#DB6436 55%,#e8855f)',
            width: barW,
          }}/>
          {/* Glow dot at the tip */}
          <motion.div style={{
            position:'absolute', top:'50%',
            translateY:'-50%',
            left: barW,
            width:4, height:4, borderRadius:'50%',
            background:'#DB6436',
            boxShadow:'0 0 8px 3px rgba(219,100,54,0.7)',
            translateX:'-50%',
          }}/>
        </div>

        {/* Numeric counter */}
        <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
          <motion.span
            style={{
              fontFamily:"'Inter',system-ui,sans-serif",
              fontWeight:200,
              fontSize:'clamp(0.68rem,1.1vw,0.8rem)',
              letterSpacing:'0.16em',
              color:'rgba(219,100,54,0.7)',
              fontVariantNumeric:'tabular-nums',
              minWidth:'2.6ch',
              textAlign:'right',
            }}
          >
            {String(count).padStart(3,'0')}
          </motion.span>
          <span style={{
            fontFamily:"'Inter',system-ui,sans-serif",
            fontWeight:200,
            fontSize:'0.52rem',
            letterSpacing:'0.08em',
            color:'rgba(219,100,54,0.3)',
          }}>%</span>
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.9, duration:1.1, ease:'easeOut' }}
        style={{
          position:'absolute',
          bottom:'clamp(24px,4vh,44px)',
          zIndex:1,
          fontFamily:"'Inter',system-ui,sans-serif",
          fontWeight:300,
          fontSize:'clamp(0.5rem,0.78vw,0.6rem)',
          letterSpacing:'0.32em',
          textTransform:'uppercase',
          color:'rgba(245,240,235,0.13)',
          margin:0,
        }}
      >
        Mangaluru &nbsp;·&nbsp; Est. 2020
      </motion.p>

      {/* Exit curtain removed for fade out effect */}
    </motion.div>
  )
}
