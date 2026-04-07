import craftBg from '../asset/bg.jpeg'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── All 17 company logos ─────────────────────────────────────────────────────
const LOGOS = [
  { name: 'ABC',              file: 'ABC_Black_Logo.png'       },
  { name: 'Bolpu',            file: 'BOLPU_logo.png'           },
  { name: 'Thatasth',        file: 'Black-PNG-Thatasth.png'   },
  { name: 'Chris & Danny',   file: 'Chris_&_Danny.png'        },
  { name: 'ETA',              file: 'ETA_Logo.png'             },
  { name: 'Hayka',            file: 'Hayka_Logo.png'           },
  { name: 'IMJ',              file: 'IMJ_Logo.png'             },
  { name: 'Iris',             file: 'Iris_Logo.png'            },
  { name: 'KOIN Home',       file: 'KOIN_Home_Logo.png'       },
  { name: 'Kedarautaana',    file: 'Kedarautaana_Logo.png'    },
  { name: 'MIT Kundapura',   file: 'MIT_Kundapura_Logo.png'   },
  { name: 'MRG',              file: 'MRG-LOGO.png'             },
  { name: 'MSRS',             file: 'MSRS_Logo.png'            },
  { name: 'Net Zero Vision', file: 'Net_Zero_Vision_Logo.png' },
  { name: 'OBG',              file: 'OBG_Logo.png'             },
  { name: 'Sathyanath',      file: 'Sathyanath_Logo.png'      },
  { name: 'Kadala Parbha',   file: 'kadala-parbha-blue.png'   },
]

const CSS = `
@keyframes ticker-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes ticker-right {
  0%   { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
.ticker-l {
  display: flex; width: max-content;
  animation: ticker-left 32s linear infinite;
  will-change: transform;
}
.ticker-r {
  display: flex; width: max-content;
  animation: ticker-right 32s linear infinite;
  will-change: transform;
}
.logo-card {
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
}
.logo-card:hover {
  transform: translateY(-3px);
}
`

// ─── Infinite ticker row ──────────────────────────────────────────────────────
function Ticker({ logos, dir = 'left' }) {
  const items = [...logos, ...logos]
  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div className={dir === 'left' ? 'ticker-l' : 'ticker-r'}>
        {items.map((logo, i) => (
          <div
            key={`${logo.file}-${i}`}
            style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 clamp(28px, 4vw, 36px)',
              height: 'clamp(140px, 16vw, 152px)',
            }}
          >
            <div
              className="logo-card"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 'clamp(200px, 24vw, 280px)',
                height: 'clamp(100px, 12vw, 120px)',
                padding: '20px 28px',
              }}
            >
              <img
                src={`/company/${logo.file}`}
                alt={logo.name}
                draggable={false}
                style={{
                  height: '100%',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  userSelect: 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ClientSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const half = Math.ceil(LOGOS.length / 2)
  const row1 = LOGOS.slice(0, half)
  const row2 = LOGOS.slice(half)

  return (
    <>
      <style>{CSS}</style>

      <section
        ref={ref}
        style={{
          background: '#060503',
          padding: 'clamp(72px, 11vh, 120px) 0 clamp(64px, 10vh, 108px)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {/* Background dot grid */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `url(${craftBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }} />

        {/* Animated background elements */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          {/* Floating orbs */}
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: '10%',
              left: '15%',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(219,100,54,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <motion.div
            animate={{
              x: [0, -25, 15, 0],
              y: [0, 30, -10, 0],
              scale: [1, 0.8, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            style={{
              position: 'absolute',
              top: '60%',
              right: '20%',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,90,48,0.06) 0%, transparent 70%)',
              filter: 'blur(35px)',
            }}
          />
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -20, 40, 0],
              scale: [1, 1.3, 0.7, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '25%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(219,100,54,0.05) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />

          {/* Rotating geometric shapes */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: 'absolute',
              top: '15%',
              right: '30%',
              width: '80px',
              height: '80px',
              border: '1px solid rgba(219,100,54,0.2)',
              borderRadius: '12px',
              transform: 'rotate(45deg)',
            }}
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: 'absolute',
              bottom: '30%',
              right: '15%',
              width: '60px',
              height: '60px',
              border: '1px solid rgba(200,90,48,0.15)',
              borderRadius: '50%',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: '40%',
              left: '10%',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(45deg, rgba(219,100,54,0.1), transparent)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />

          {/* Pulse rings */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              border: '1px solid rgba(219,100,54,0.1)',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.2, 0.05, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              border: '1px solid rgba(219,100,54,0.08)',
              pointerEvents: 'none',
            }}
          />

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.6, 0],
                x: [0, Math.sin(i) * 20, 0],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
              style={{
                position: 'absolute',
                left: `${20 + i * 10}%`,
                bottom: '10%',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(219,100,54,0.4)',
                boxShadow: '0 0 6px rgba(219,100,54,0.6)',
              }}
            />
          ))}
        </div>

        {/* Top glow line */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '50%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(219,100,54,0.4), transparent)',
        }} />

        {/* Heading */}
        <div style={{
          textAlign: 'center',
          padding: '0 clamp(20px, 4vw, 48px)',
          marginBottom: 'clamp(52px, 8vh, 80px)',
        }}>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(0.54rem, 0.9vw, 0.66rem)',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(219,100,54,0.55)',
              margin: '0 0 16px',
            }}
          >
            Trusted By
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
              letterSpacing: '-0.03em',
              color: '#f5f0eb',
              margin: '0 0 16px',
            }}
          >
            Brands that chose
            <span style={{ color: '#DB6436' }}> to grow</span> with us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.82rem, 1.4vw, 1rem)',
              color: 'rgba(245,240,235,0.38)',
              margin: 0,
            }}
          >
            {LOGOS.length}+ brands. Every story, every campaign — intentional.
          </motion.p>
        </div>

        {/* Ticker rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.35 }}
        >
          {/* Row 1 — left */}
          <Ticker logos={row1} dir="left" />

          {/* Divider */}
          <div style={{
            width: '100%', height: '1px',
            background: 'rgba(219,100,54,0.05)',
            margin: '0',
          }} />

          {/* Row 2 — right */}
          <Ticker logos={row2} dir="right" />
        </motion.div>

        {/* Left + right fade masks */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to right, #06050300 0%, transparent 0%, transparent 100%, #060503 100%)',
        }} />
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to right, #06050300, transparent 10%, transparent 90%, #060503)',
        }} />

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(24px, 4vw, 48px)',
            maxWidth: '800px',
            margin: 'clamp(52px, 8vh, 80px) auto 0',
            padding: '0 clamp(20px, 4vw, 48px)',
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {/* 17+ Brands */}
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
          }}>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              letterSpacing: '-0.04em',
              color: '#DB6436',
              lineHeight: 1,
              marginBottom: '8px',
              whiteSpace: 'nowrap',
            }}>
              17+
            </div>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.58rem, 1.1vw, 0.75rem)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,235,0.35)',
              lineHeight: 1.3,
              maxWidth: '140px',
              hyphens: 'auto',
            }}>
              Brands
            </div>
          </div>

          {/* 3× Avg. engagement lift */}
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
          }}>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              letterSpacing: '-0.04em',
              color: '#DB6436',
              lineHeight: 1,
              marginBottom: '8px',
              whiteSpace: 'nowrap',
            }}>
              3×
            </div>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.58rem, 1.1vw, 0.75rem)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,235,0.35)',
              lineHeight: 1.3,
              maxWidth: '140px',
              hyphens: 'auto',
            }}>
              Avg. engagement lift
            </div>
          </div>

          {/* 90d To measurable results */}
          <div style={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100px',
          }}>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              letterSpacing: '-0.04em',
              color: '#DB6436',
              lineHeight: 1,
              marginBottom: '8px',
              whiteSpace: 'nowrap',
            }}>
              90d
            </div>
            <div style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(0.58rem, 1.1vw, 0.75rem)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,235,0.35)',
              lineHeight: 1.3,
              maxWidth: '140px',
              hyphens: 'auto',
            }}>
              To measurable results
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
