import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState({})

  // Geometric canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight

    const shapes = Array.from({length: 18}, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      size: 40 + Math.random() * 120,
      speed: 0.08 + Math.random() * 0.12,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.003,
      type: i % 3,
      opacity: 0.03 + Math.random() * 0.06,
      drift: { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 }
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      shapes.forEach(s => {
        s.angle += s.rotSpeed
        s.x += s.drift.x
        s.y += s.drift.y
        if (s.x < -200) s.x = w + 200
        if (s.x > w + 200) s.x = -200
        if (s.y < -200) s.y = h + 200
        if (s.y > h + 200) s.y = -200

        ctx.save()
        ctx.translate(s.x, s.y)
        ctx.rotate(s.angle)
        ctx.strokeStyle = `rgba(212,175,55,${s.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()

        if (s.type === 0) {
          // Hexagon
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI * 2) / 6
            i === 0 ? ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
                    : ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
          }
          ctx.closePath()
        } else if (s.type === 1) {
          // Triangle
          for (let i = 0; i < 3; i++) {
            const a = (i * Math.PI * 2) / 3 - Math.PI / 2
            i === 0 ? ctx.moveTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
                    : ctx.lineTo(Math.cos(a) * s.size, Math.sin(a) * s.size)
          }
          ctx.closePath()
        } else {
          // Square
          ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size)
        }
        ctx.stroke()
        ctx.restore()
      })
      animId = requestAnimationFrame(draw)
    }

    draw()
    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  // Scroll nav effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection observer for fade-ins
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisible(v => ({...v, [e.target.dataset.id]: true}))
      })
    }, {threshold: 0.15})
    document.querySelectorAll('[data-id]').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const fadeIn = (id, delay = 0) => ({
    'data-id': id,
    style: {
      opacity: visible[id] ? 1 : 0,
      transform: visible[id] ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }
  })

  const tiltCard = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`
  }
  const resetTilt = (e) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div className="min-h-screen font-sans" style={{background:'#080F1E', color:'#F5F0E8'}}>

      {/* CANVAS BACKGROUND */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{zIndex:0}}/>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 transition-all duration-500"
        style={{
          height: scrolled ? '56px' : '72px',
          background: scrolled ? 'rgba(8,15,30,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212,175,55,0.15)' : 'none',
        }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full transition-all duration-300" style={{background:'#D4AF37', boxShadow: scrolled ? '0 0 8px rgba(212,175,55,0.6)' : 'none'}}></span>
          <span className="font-bold text-lg" style={{color:'#F5F0E8'}}>EduGateway</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Tracks', 'How it works', 'Mentors'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ','-')}`}
              className="text-sm font-medium relative group transition-colors"
              style={{color:'rgba(245,240,232,0.6)'}}>
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{background:'#D4AF37'}}></span>
            </a>
          ))}
          <button onClick={() => navigate('/pathway')}
            className="text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden group"
            style={{background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.4)', color:'#D4AF37'}}>
            <span className="relative z-10">Get started free</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background:'rgba(212,175,55,0.15)'}}></span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center" style={{zIndex:1}}>
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-8"
          style={{background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.25)', color:'#D4AF37'}}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:'#D4AF37'}}></span>
          Built for Sri Lankan students
        </div>

        <h1 className="font-extrabold leading-none tracking-tight mb-6 max-w-5xl"
          style={{fontSize:'clamp(44px,7vw,82px)', letterSpacing:'-3px'}}>
          Your gateway to<br />
          <span style={{
            background:'linear-gradient(135deg, #D4AF37 0%, #F5D76E 50%, #B8960C 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'
          }}>global certifications</span>
        </h1>

        <p className="text-lg max-w-xl mb-12 leading-relaxed" style={{color:'rgba(245,240,232,0.55)'}}>
          Tell us where you are and where you want to go. We'll map the path — exams, timelines, costs in LKR, and pros and cons — instantly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => navigate('/pathway')}
            className="font-bold px-8 py-4 rounded-xl transition-all duration-300 text-base relative overflow-hidden group"
            style={{background:'linear-gradient(135deg, #D4AF37, #B8960C)', color:'#080F1E', boxShadow:'0 8px 32px rgba(212,175,55,0.3)'}}>
            Build my pathway free →
          </button>
          <a href="#how"
            className="font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-base"
            style={{border:'1px solid rgba(245,240,232,0.15)', color:'rgba(245,240,232,0.8)'}}>
            See how it works
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs" style={{color:'rgba(245,240,232,0.3)'}}>scroll</span>
          <div className="w-px h-8" style={{background:'linear-gradient(to bottom, rgba(212,175,55,0.4), transparent)'}}></div>
        </div>
      </section>

      {/* STATS */}
      <div className="relative z-10 grid grid-cols-3" style={{borderTop:'1px solid rgba(212,175,55,0.12)', borderBottom:'1px solid rgba(212,175,55,0.12)', background:'rgba(8,15,30,0.8)', backdropFilter:'blur(12px)'}}>
        {[
          { num: '60+', label: 'Global certifications mapped' },
          { num: '2', label: 'Tracks — tech & business' },
          { num: '100%', label: 'Built for Sri Lanka' },
        ].map((s, i) => (
          <div key={i} className="py-12 text-center" style={{borderRight: i < 2 ? '1px solid rgba(212,175,55,0.12)' : 'none'}}>
            <div className="text-4xl font-extrabold tracking-tight" style={{color:'#D4AF37'}}>{s.num}</div>
            <div className="text-sm mt-2" style={{color:'rgba(245,240,232,0.45)'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section className="py-24 px-8 relative z-10" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div {...fadeIn('how-eye', 0)} className="text-xs font-bold tracking-widest uppercase mb-4" style={{color:'#D4AF37'}}>How it works</div>
          <div {...fadeIn('how-title', 0.1)}>
            <h2 className="font-extrabold tracking-tight mb-4" style={{fontSize:'clamp(28px,4vw,42px)', letterSpacing:'-1px'}}>From profile to pathway<br />in minutes</h2>
          </div>
          <div {...fadeIn('how-sub', 0.2)}>
            <p className="text-lg mb-14 max-w-lg leading-relaxed" style={{color:'rgba(245,240,232,0.5)'}}>No lengthy forms. No waiting. Enter your background and get a structured roadmap instantly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: '📋', title: 'Enter your profile', desc: 'Tell us your education level, subjects, and what area interests you most.' },
              { n: '02', icon: '🧭', title: 'Get your roadmap', desc: 'Our AI maps 2–3 realistic pathways with full details on what each involves.' },
              { n: '03', icon: '📊', title: 'Compare paths', desc: 'See pros, cons, costs in LKR, timelines, and local job market demand.' },
              { n: '04', icon: '🚀', title: 'Register or book', desc: 'Go straight to the official exam provider or book a mentor session.' },
            ].map((s, i) => (
              <div key={i} {...fadeIn(`how-${i}`, i * 0.1)}
                className="rounded-2xl p-6 cursor-default transition-all duration-300"
                style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(212,175,55,0.12)', backdropFilter:'blur(8px)'}}
                onMouseMove={tiltCard} onMouseLeave={resetTilt}>
                <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{color:'rgba(212,175,55,0.6)'}}>{s.n}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'rgba(245,240,232,0.5)'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="py-24 px-8 relative z-10" id="tracks" style={{background:'rgba(212,175,55,0.03)'}}>
        <div className="max-w-5xl mx-auto">
          <div {...fadeIn('tracks-eye', 0)} className="text-xs font-bold tracking-widest uppercase mb-4" style={{color:'#D4AF37'}}>Certification tracks</div>
          <div {...fadeIn('tracks-title', 0.1)}>
            <h2 className="font-extrabold tracking-tight mb-14" style={{fontSize:'clamp(28px,4vw,42px)', letterSpacing:'-1px'}}>Two tracks. Dozens of doors.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '💻', title: 'Tech track',
                desc: 'From entry-level cloud practitioner to advanced security specialist — every major tech certification mapped to what Colombo employers are hiring for.',
                certs: ['AWS Cloud Practitioner', 'AWS Solutions Architect', 'Google Associate Cloud', 'CompTIA Security+', 'CEH', 'PCEP / PCAP', 'TensorFlow Developer', 'DP-100 Azure AI', 'PMP', 'PRINCE2'],
                coming: 'Data engineering & DevOps coming soon'
              },
              {
                icon: '📈', title: 'Business track',
                desc: 'Finance, marketing, operations, and management credentials that open doors at top firms — with context on which qualifications Sri Lankan employers value.',
                certs: ['ACCA', 'CFA Level I–III', 'CPA', 'Google Digital Marketing', 'HubSpot Content', 'GMAT Prep', 'SHRM-CP', 'APICS CPIM', 'Six Sigma Green Belt'],
                coming: 'Law & medicine tracks in planning'
              }
            ].map((t, i) => (
              <div key={i} {...fadeIn(`track-${i}`, i * 0.15)}
                className="rounded-2xl p-8 transition-all duration-300"
                style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(212,175,55,0.15)', backdropFilter:'blur(8px)'}}
                onMouseMove={tiltCard} onMouseLeave={resetTilt}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.2)'}}>{t.icon}</div>
                  <h3 className="text-xl font-bold">{t.title}</h3>
                </div>
                <p className="text-sm mb-6 leading-relaxed" style={{color:'rgba(245,240,232,0.5)'}}>{t.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {t.certs.map((c, j) => (
                    <span key={j} className="text-xs font-semibold px-3 py-1.5 rounded-full cursor-default transition-all duration-200 hover:border-yellow-500/50"
                      style={{border:'1px solid rgba(212,175,55,0.15)', color:'rgba(245,240,232,0.5)', background:'rgba(212,175,55,0.05)'}}>{c}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{color:'rgba(245,240,232,0.35)'}}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:'#D4AF37'}}></span>{t.coming}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTORS */}
      <section className="py-24 px-8 relative z-10" id="mentors">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div {...fadeIn('mentor-eye')} className="text-xs font-bold tracking-widest uppercase mb-4" style={{color:'#D4AF37'}}>Mentors</div>
              <div {...fadeIn('mentor-title', 0.1)}>
                <h2 className="font-extrabold tracking-tight mb-4" style={{fontSize:'clamp(28px,4vw,42px)', letterSpacing:'-1px'}}>Guidance from people who've been there</h2>
              </div>
              <div {...fadeIn('mentor-sub', 0.2)}>
                <p className="text-lg mb-8 leading-relaxed" style={{color:'rgba(245,240,232,0.5)'}}>Book a session with a vetted mentor — professionals who hold the certifications you're targeting and understand the Sri Lankan context.</p>
              </div>
              <button onClick={() => navigate('/pathway')}
                className="font-bold px-8 py-4 rounded-xl transition-all duration-300"
                style={{background:'linear-gradient(135deg, #D4AF37, #B8960C)', color:'#080F1E', boxShadow:'0 8px 24px rgba(212,175,55,0.25)'}}>
                Join as a mentor
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { initials: 'KP', name: 'Kasun Perera', role: 'AWS Solutions Architect · Dialog', price: 'LKR 4,500 / session', badge: 'AWS Pro' },
                { initials: 'ND', name: 'Nisha De Silva', role: 'CFA Charterholder · Commercial Bank', price: 'LKR 5,000 / session', badge: 'CFA' },
                { initials: 'RJ', name: 'Rangi Jayawardena', role: 'Cybersecurity lead · Axiata Digital', price: 'LKR 3,800 / session', badge: 'CEH · CompTIA' },
              ].map((m, i) => (
                <div key={i} {...fadeIn(`mentor-${i}`, i * 0.1)}
                  className="flex items-center gap-4 rounded-2xl p-5 transition-all duration-300"
                  style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(212,175,55,0.12)', backdropFilter:'blur(8px)'}}
                  onMouseMove={tiltCard} onMouseLeave={resetTilt}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm"
                    style={{background:'rgba(212,175,55,0.15)', border:'1px solid rgba(212,175,55,0.3)', color:'#D4AF37'}}>{m.initials}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-xs mt-0.5" style={{color:'rgba(245,240,232,0.45)'}}>{m.role}</div>
                    <div className="text-xs mt-1" style={{color:'rgba(245,240,232,0.35)'}}>{m.price}</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                    style={{background:'rgba(212,175,55,0.1)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.25)'}}>{m.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 text-center relative z-10" style={{background:'rgba(212,175,55,0.04)', borderTop:'1px solid rgba(212,175,55,0.1)'}}>
        <div className="max-w-2xl mx-auto">
          <div {...fadeIn('cta-title')}>
            <h2 className="font-extrabold tracking-tight mb-5" style={{fontSize:'clamp(32px,5vw,56px)', letterSpacing:'-2px'}}>
              Your global career<br />starts with one step
            </h2>
          </div>
          <div {...fadeIn('cta-sub', 0.1)}>
            <p className="text-lg mb-10" style={{color:'rgba(245,240,232,0.45)'}}>Build your pathway free. No account needed to explore.</p>
          </div>
          <div {...fadeIn('cta-btns', 0.2)} className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/pathway')}
              className="font-bold px-10 py-4 rounded-xl transition-all duration-300 text-base"
              style={{background:'linear-gradient(135deg, #D4AF37, #B8960C)', color:'#080F1E', boxShadow:'0 8px 32px rgba(212,175,55,0.35)'}}>
              Get started free
            </button>
            <a href="#tracks"
              className="font-semibold px-10 py-4 rounded-xl transition-all duration-300 text-base"
              style={{border:'1px solid rgba(245,240,232,0.15)', color:'rgba(245,240,232,0.7)'}}>
              Explore certifications
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{borderTop:'1px solid rgba(212,175,55,0.1)', background:'rgba(8,15,30,0.9)'}}>
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="w-2 h-2 rounded-full" style={{background:'#D4AF37'}}></span>EduGateway
        </div>
        <p className="text-sm" style={{color:'rgba(245,240,232,0.35)'}}>© 2025 EduGateway · Built for Sri Lanka</p>
        <div className="flex gap-6">
          {['About', 'Contact', 'Privacy'].map(l => (
            <a key={l} href="#" className="text-sm transition-colors hover:text-white" style={{color:'rgba(245,240,232,0.35)'}}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}