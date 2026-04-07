import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import logo from '../asset/logo.png'

const CONTACT_CSS = `
.contact-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(245,240,235,0.12);
  padding: 18px 0 14px;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(0.9rem, 1.5vw, 1.05rem);
  color: #f5f0eb;
  letter-spacing: -0.01em;
  outline: none;
  transition: border-color 0.35s ease;
  box-sizing: border-box;
}
.contact-input::placeholder {
  color: rgba(245,240,235,0.2);
  font-weight: 300;
}
.contact-input:focus {
  border-bottom-color: #DB6436;
}
.contact-textarea {
  resize: none;
  min-height: 100px;
}
.send-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: 1px solid rgba(219,100,54,0.45);
  color: #f5f0eb;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 400;
  font-size: clamp(0.72rem, 1.1vw, 0.82rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 16px 36px;
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.35s ease, border-color 0.35s ease, transform 0.25s ease;
  white-space: nowrap;
}
.send-btn:hover {
  background: rgba(219,100,54,0.1);
  border-color: #DB6436;
  transform: translateY(-1px);
}
.send-btn:active { transform: translateY(0); }
.contact-link {
  color: rgba(245,240,235,0.55);
  text-decoration: none;
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(0.82rem, 1.3vw, 0.96rem);
  letter-spacing: -0.01em;
  transition: color 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.contact-link:hover { color: #f5f0eb; }
`

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 4l16 16M4 20L20 4" stroke="none"/>
      <path d="M3 5h4l4 5.5L15.5 5H21l-7 8.5L21 19h-4.5L12 13l-4.5 6H3l7.5-9L3 5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="rgba(219,100,54,0.6)" strokeWidth="1.4"/>
      <path d="M2 7l10 7 10-7" stroke="rgba(219,100,54,0.6)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 10.8a15.6 15.6 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.6 22 2 13.4 2 3c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" stroke="rgba(219,100,54,0.6)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgba(219,100,54,0.6)" strokeWidth="1.4"/>
      <circle cx="12" cy="9" r="2.5" stroke="rgba(219,100,54,0.6)" strokeWidth="1.4"/>
    </svg>
  )
}

export default function ContactSection() {
  const ref      = useRef(null)
  const inView   = useInView(ref, { once: true, margin: '-80px' })
  const [sent, setSent]     = useState(false)
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
  }
  const itemVariants = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <>
      <style>{CONTACT_CSS}</style>

      <section
        id="contact"
        ref={ref}
        style={{
          position: 'relative',
          background: '#0a0806',
          overflow: 'hidden',
          minHeight: '100vh',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* ── Background layers ── */}

        {/* Noise texture via SVG */}
        <svg aria-hidden style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.025, pointerEvents:'none' }}>
          <filter id="noise-c">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise-c)"/>
        </svg>

        {/* Large ambient glow — top left */}
        <div aria-hidden style={{
          position:'absolute', top:'-10%', left:'-5%',
          width:'clamp(320px,55vw,700px)', height:'clamp(320px,55vw,700px)',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(219,100,54,0.07) 0%, transparent 65%)',
          pointerEvents:'none',
          filter:'blur(60px)',
        }}/>

        {/* Accent glow — bottom right */}
        <div aria-hidden style={{
          position:'absolute', bottom:'-8%', right:'-4%',
          width:'clamp(240px,40vw,500px)', height:'clamp(240px,40vw,500px)',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(200,90,48,0.05) 0%, transparent 65%)',
          pointerEvents:'none',
          filter:'blur(50px)',
        }}/>

        {/* Horizontal rule that animates in */}
        <motion.div
          initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{
            position:'absolute', top:0, left:'8%', right:'8%',
            height:'1px', background:'linear-gradient(90deg, transparent, rgba(219,100,54,0.3), transparent)',
            transformOrigin:'left', pointerEvents:'none',
          }}
        />

        {/* ── Content ── */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(100px,14vh,160px) clamp(24px,6vw,80px) clamp(60px,8vh,100px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,420px), 1fr))',
          gap: 'clamp(56px,8vw,120px)',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Heading + contact info ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{ display:'flex', flexDirection:'column', gap:'clamp(32px,5vh,48px)' }}
          >
            {/* Label */}
            <motion.p variants={itemVariants} style={{
              fontFamily:"'Inter', system-ui, sans-serif",
              fontWeight:400, fontSize:'clamp(0.54rem,0.88vw,0.66rem)',
              letterSpacing:'0.32em', textTransform:'uppercase',
              color:'rgba(219,100,54,0.55)', margin:0,
            }}>
              Contact
            </motion.p>

            {/* Main heading */}
            <motion.div variants={itemVariants}>
              <h2 style={{
                fontFamily:"'Inter', system-ui, sans-serif",
                fontWeight:300,
                fontSize:'clamp(2.4rem,6vw,4.2rem)',
                letterSpacing:'-0.04em',
                lineHeight:1.06,
                color:'#f5f0eb',
                margin:'0 0 16px',
              }}>
                Let's build something
                <br/>
                <span style={{ color:'#DB6436' }}>meaningful.</span>
              </h2>
              <p style={{
                fontFamily:"'Inter', system-ui, sans-serif",
                fontWeight:300,
                fontSize:'clamp(0.9rem,1.5vw,1.05rem)',
                color:'rgba(245,240,235,0.38)',
                margin:0, lineHeight:1.7,
                maxWidth:'380px',
              }}>
                Start a conversation. Tell us about your brand, your goals, or just say hello.
              </p>
            </motion.div>

            {/* Contact details */}
            <motion.div variants={itemVariants} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              {[
                { icon: <MailIcon/>,  label:'Email',   value:'hello@yatharth.in',    href:'mailto:hello@yatharth.in' },
                { icon: <PhoneIcon/>, label:'Phone',   value:'+91 98765 43210',       href:'tel:+919876543210' },
                { icon: <PinIcon/>,  label:'Address', value:'Mangaluru, Karnataka',  href:null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  {icon}
                  <div>
                    <div style={{
                      fontFamily:"'Inter', system-ui, sans-serif",
                      fontWeight:400, fontSize:'0.6rem',
                      letterSpacing:'0.2em', textTransform:'uppercase',
                      color:'rgba(219,100,54,0.45)', marginBottom:'3px',
                    }}>{label}</div>
                    {href
                      ? <a href={href} className="contact-link">{value}</a>
                      : <span style={{
                          fontFamily:"'Inter', system-ui, sans-serif",
                          fontWeight:300, fontSize:'clamp(0.82rem,1.3vw,0.96rem)',
                          color:'rgba(245,240,235,0.55)', letterSpacing:'-0.01em',
                        }}>{value}</span>
                    }
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Social row */}
            <motion.div variants={itemVariants} style={{ display:'flex', gap:'12px', paddingTop:'8px' }}>
              {[
                { label: 'Instagram', icon: <InstagramIcon/>, href: '#' },
                { label: 'Twitter',   icon: <TwitterIcon/>,   href: '#' },
                { label: 'Facebook',  icon: <FacebookIcon/>,  href: '#' },
              ].map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width:'42px', height:'42px', borderRadius:'50%',
                    border:'1px solid rgba(245,240,235,0.1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color:'rgba(245,240,235,0.35)',
                    textDecoration:'none',
                    transition:'color 0.25s, border-color 0.25s, background 0.25s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#DB6436'
                    e.currentTarget.style.borderColor = 'rgba(219,100,54,0.4)'
                    e.currentTarget.style.background = 'rgba(219,100,54,0.07)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(245,240,235,0.35)'
                    e.currentTarget.style.borderColor = 'rgba(245,240,235,0.1)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {icon}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity:1 }}
                  exit={{ opacity:0, y:-20, transition:{ duration:0.4 } }}
                  style={{ display:'flex', flexDirection:'column', gap:'0' }}
                >
                  {/* Name */}
                  <motion.div variants={itemVariants} style={{ position:'relative', marginBottom:'8px' }}>
                    <label style={{
                      fontFamily:"'Inter', system-ui, sans-serif",
                      fontWeight:400, fontSize:'0.6rem', letterSpacing:'0.2em',
                      textTransform:'uppercase', color:'rgba(219,100,54,0.45)',
                      display:'block', marginBottom:'2px',
                    }}>Name</label>
                    <input
                      className="contact-input"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      required
                      onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused('')}
                    />
                    <motion.div
                      animate={{ scaleX: focused === 'name' ? 1 : 0 }}
                      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                      style={{
                        position:'absolute', bottom:0, left:0, right:0,
                        height:'1.5px', background:'#DB6436',
                        transformOrigin:'left',
                      }}
                    />
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} style={{ position:'relative', marginBottom:'8px' }}>
                    <label style={{
                      fontFamily:"'Inter', system-ui, sans-serif",
                      fontWeight:400, fontSize:'0.6rem', letterSpacing:'0.2em',
                      textTransform:'uppercase', color:'rgba(219,100,54,0.45)',
                      display:'block', marginBottom:'2px',
                    }}>Email</label>
                    <input
                      className="contact-input"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      required
                      onChange={e => setForm(f => ({...f, email: e.target.value}))}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused('')}
                    />
                    <motion.div
                      animate={{ scaleX: focused === 'email' ? 1 : 0 }}
                      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                      style={{
                        position:'absolute', bottom:0, left:0, right:0,
                        height:'1.5px', background:'#DB6436',
                        transformOrigin:'left',
                      }}
                    />
                  </motion.div>

                  {/* Message */}
                  <motion.div variants={itemVariants} style={{ position:'relative', marginBottom:'40px' }}>
                    <label style={{
                      fontFamily:"'Inter', system-ui, sans-serif",
                      fontWeight:400, fontSize:'0.6rem', letterSpacing:'0.2em',
                      textTransform:'uppercase', color:'rgba(219,100,54,0.45)',
                      display:'block', marginBottom:'2px',
                    }}>Message</label>
                    <textarea
                      className="contact-input contact-textarea"
                      placeholder="Tell us about your brand and what you're building..."
                      value={form.message}
                      required
                      onChange={e => setForm(f => ({...f, message: e.target.value}))}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                    />
                    <motion.div
                      animate={{ scaleX: focused === 'message' ? 1 : 0 }}
                      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                      style={{
                        position:'absolute', bottom:0, left:0, right:0,
                        height:'1.5px', background:'#DB6436',
                        transformOrigin:'left',
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button type="submit" className="send-btn">
                      Send message <ArrowIcon/>
                    </button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity:0, y:30 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
                  style={{
                    display:'flex', flexDirection:'column', justifyContent:'center',
                    minHeight:'340px', gap:'20px',
                  }}
                >
                  {/* Check mark */}
                  <motion.div
                    initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ delay:0.2, type:'spring', stiffness:200, damping:16 }}
                    style={{
                      width:'56px', height:'56px', borderRadius:'50%',
                      border:'1.5px solid rgba(219,100,54,0.4)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M4 11l5 5 9-9" stroke="#DB6436" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                  <h3 style={{
                    fontFamily:"'Inter', system-ui, sans-serif",
                    fontWeight:300, fontSize:'clamp(1.4rem,3vw,2rem)',
                    letterSpacing:'-0.03em', color:'#f5f0eb', margin:0,
                  }}>
                    Message received.
                  </h3>
                  <p style={{
                    fontFamily:"'Inter', system-ui, sans-serif",
                    fontWeight:300, fontSize:'clamp(0.85rem,1.3vw,0.95rem)',
                    color:'rgba(245,240,235,0.4)', margin:0, lineHeight:1.7, maxWidth:'340px',
                  }}>
                    We'll be in touch soon. Every conversation starts with one message.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Footer strip ── */}
        <motion.div
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
          transition={{ duration:1, delay:0.7 }}
          style={{
            borderTop:'1px solid rgba(245,240,235,0.05)',
            padding:'clamp(24px,4vh,36px) clamp(24px,6vw,80px)',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            flexWrap:'wrap',
            gap:'16px',
            maxWidth:'1200px',
            margin:'0 auto',
            width:'100%',
          }}
        >
          <img
            src={logo}
            alt="Yatharth"
            style={{
              height:'clamp(24px,3.5vw,32px)',
              width:'auto', objectFit:'contain',
              opacity:0.35,
              userSelect:'none', pointerEvents:'none',
            }}
          />
          <span style={{
            fontFamily:"'Inter', system-ui, sans-serif",
            fontWeight:300, fontSize:'clamp(0.58rem,0.88vw,0.68rem)',
            letterSpacing:'0.2em', textTransform:'uppercase',
            color:'rgba(245,240,235,0.18)',
          }}>
            Mangaluru &nbsp;·&nbsp; Est. 2020
          </span>
          <span style={{
            fontFamily:"'Inter', system-ui, sans-serif",
            fontWeight:300, fontSize:'clamp(0.58rem,0.88vw,0.68rem)',
            letterSpacing:'0.1em',
            color:'rgba(245,240,235,0.12)',
          }}>
            © {new Date().getFullYear()} Yatharth. All rights reserved.
          </span>
        </motion.div>
      </section>
    </>
  )
}
