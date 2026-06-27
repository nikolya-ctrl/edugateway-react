import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = [
  { id: 1, title: 'Your background' },
  { id: 2, title: 'Your interests' },
  { id: 3, title: 'Your goals' },
]

export default function PathwayGenerator() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', edu: '', field: '',
    interests: [], location: '', salary: '',
    time: '', budget: '',
  })
  const [pathway, setPathway] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleInterest = (val) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(val)
        ? f.interests.filter(i => i !== val)
        : [...f.interests, val]
    }))
  }

  const generatePathway = async () => {
    setLoading(true)
    const prompt = `You are an expert education advisor for Sri Lankan students. 
A student has provided the following profile:
- Name: ${form.name}
- Education level: ${form.edu}
- Field of study: ${form.field}
- Interest areas: ${form.interests.join(', ')}
- Preferred work location: ${form.location}
- Target salary: ${form.salary} LKR/month
- Study time available: ${form.time} hours/week
- Study budget: ${form.budget} LKR

Generate a personalised certification pathway for this student. 
Respond ONLY with a JSON object in this exact format, no markdown, no explanation:
{
  "summary": "2-3 sentence personalised summary for this student",
  "paths": [
    {
      "title": "Path name",
      "description": "Brief description",
      "steps": [
        {
          "cert": "Certification name",
          "provider": "Provider name",
          "duration": "X months",
          "cost_lkr": 50000,
          "difficulty": "Beginner/Intermediate/Advanced",
          "why": "Why this cert suits this student specifically"
        }
      ],
      "pros": ["pro 1", "pro 2", "pro 3"],
      "cons": ["con 1", "con 2"],
      "local_demand": "High/Medium/Low",
      "salary_range": "LKR X - Y per month"
    }
  ]
}`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 8000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      const data = await res.json()
      if (data.error) {
        alert('API Error: ' + data.error.message)
        setLoading(false)
        return
      }
      const text = data.content[0].text
      const clean = text.replace(/```json|```/g, '').trim()
      setPathway(JSON.parse(clean))
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
    setLoading(false)
  }

  const inputClass = "w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
  const inputStyle = {background:'rgba(255,255,255,0.04)', border:'1px solid rgba(212,175,55,0.2)', color:'#F5F0E8'}
  const inputFocus = {borderColor:'#D4AF37'}

  return (
    <div className="min-h-screen font-sans" style={{background:'#080F1E', color:'#F5F0E8'}}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 h-16 border-b"
        style={{borderColor:'rgba(212,175,55,0.12)', background:'rgba(8,15,30,0.9)', backdropFilter:'blur(12px)'}}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{background:'#D4AF37'}}></span>
          <span className="font-bold text-lg">EduGateway</span>
        </button>
        <span className="text-sm" style={{color:'rgba(245,240,232,0.4)'}}>Pathway generator</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {!pathway ? (
          <>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-10">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300"
                    style={{
                      background: step === s.id ? 'linear-gradient(135deg, #D4AF37, #B8960C)' : step > s.id ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                      color: step === s.id ? '#080F1E' : step > s.id ? '#D4AF37' : 'rgba(245,240,232,0.4)',
                      boxShadow: step === s.id ? '0 4px 12px rgba(212,175,55,0.3)' : 'none'
                    }}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className="text-sm font-medium" style={{color: step === s.id ? '#F5F0E8' : 'rgba(245,240,232,0.35)'}}>
                    {s.title}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="w-8 h-px mx-1" style={{background: step > s.id ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.08)'}}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress line */}
            <div className="h-px mb-10 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.06)'}}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{width:`${((step-1)/3)*100}%`, background:'linear-gradient(90deg, #D4AF37, #B8960C)'}}></div>
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="mb-8">
                  <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{color:'#D4AF37'}}>Step 1 of 3</div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2" style={{letterSpacing:'-1px'}}>Tell us about yourself</h2>
                  <p className="text-sm" style={{color:'rgba(245,240,232,0.45)'}}>We'll use this to personalise your certification roadmap.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Full name</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    className={inputClass} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocus)}
                    onBlur={e => Object.assign(e.target.style, {borderColor:'rgba(212,175,55,0.2)'})} />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Email address</label>
                  <input value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="you@email.com" type="email"
                    className={inputClass} style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, inputFocus)}
                    onBlur={e => Object.assign(e.target.style, {borderColor:'rgba(212,175,55,0.2)'})} />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Education level</label>
                  <select value={form.edu} onChange={e => update('edu', e.target.value)}
                    className={inputClass} style={{...inputStyle, appearance:'none'}}>
                    <option value="" style={{background:'#080F1E'}}>Select your level</option>
                    <option value="O/L completed" style={{background:'#080F1E'}}>O/L completed</option>
                    <option value="A/L completed" style={{background:'#080F1E'}}>A/L completed</option>
                    <option value="Diploma / HND" style={{background:'#080F1E'}}>Diploma / HND</option>
                    <option value="Undergraduate degree" style={{background:'#080F1E'}}>Undergraduate degree</option>
                    <option value="Postgraduate / Masters" style={{background:'#080F1E'}}>Postgraduate / Masters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Field of study</label>
                  <select value={form.field} onChange={e => update('field', e.target.value)}
                    className={inputClass} style={{...inputStyle, appearance:'none'}}>
                    <option value="" style={{background:'#080F1E'}}>Select your field</option>
                    <option value="IT and Computer Science" style={{background:'#080F1E'}}>IT and Computer Science</option>
                    <option value="Business and Management" style={{background:'#080F1E'}}>Business and Management</option>
                    <option value="Commerce and Accounting" style={{background:'#080F1E'}}>Commerce and Accounting</option>
                    <option value="Engineering" style={{background:'#080F1E'}}>Engineering</option>
                    <option value="Physical or Applied Science" style={{background:'#080F1E'}}>Physical or Applied Science</option>
                    <option value="Arts and Humanities" style={{background:'#080F1E'}}>Arts and Humanities</option>
                    <option value="Other" style={{background:'#080F1E'}}>Other</option>
                  </select>
                </div>
                <button onClick={() => {
                  if (!form.name || !form.edu || !form.field) { alert('Please fill in all fields.'); return }
                  setStep(2)
                }} className="w-full font-bold py-4 rounded-xl transition-all duration-300"
                  style={{background:'linear-gradient(135deg, #D4AF37, #B8960C)', color:'#080F1E', boxShadow:'0 8px 24px rgba(212,175,55,0.25)'}}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="mb-8">
                  <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{color:'#D4AF37'}}>Step 2 of 3</div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2" style={{letterSpacing:'-1px'}}>What interests you?</h2>
                  <p className="text-sm" style={{color:'rgba(245,240,232,0.45)'}}>Pick all the areas you want to explore.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Cloud computing','Software development','Cybersecurity','Data and AI','Finance and accounting','Marketing','Project management','MBA preparation'].map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                      style={{
                        border: form.interests.includes(i) ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.15)',
                        color: form.interests.includes(i) ? '#D4AF37' : 'rgba(245,240,232,0.45)',
                        background: form.interests.includes(i) ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                        boxShadow: form.interests.includes(i) ? '0 0 12px rgba(212,175,55,0.15)' : 'none'
                      }}>
                      {i}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Where do you want to work?</label>
                  <select value={form.location} onChange={e => update('location', e.target.value)}
                    className={inputClass} style={{...inputStyle, appearance:'none'}}>
                    <option value="" style={{background:'#080F1E'}}>Select preference</option>
                    <option value="Stay in Sri Lanka" style={{background:'#080F1E'}}>Stay in Sri Lanka</option>
                    <option value="Work abroad" style={{background:'#080F1E'}}>Work abroad</option>
                    <option value="Remote or freelance" style={{background:'#080F1E'}}>Remote or freelance</option>
                    <option value="Open to anything" style={{background:'#080F1E'}}>Open to anything</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{border:'1px solid rgba(212,175,55,0.15)', color:'rgba(245,240,232,0.5)'}}>
                    ← Back
                  </button>
                  <button onClick={() => {
                    if (form.interests.length === 0 || !form.location) { alert('Please select at least one interest and your location preference.'); return }
                    setStep(3)
                  }} className="flex-1 font-bold py-4 rounded-xl transition-all duration-300"
                    style={{background:'linear-gradient(135deg, #D4AF37, #B8960C)', color:'#080F1E', boxShadow:'0 8px 24px rgba(212,175,55,0.25)'}}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="mb-8">
                  <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{color:'#D4AF37'}}>Step 3 of 3</div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2" style={{letterSpacing:'-1px'}}>Your goals and availability</h2>
                  <p className="text-sm" style={{color:'rgba(245,240,232,0.45)'}}>This helps us recommend paths that are realistic for you.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Target monthly salary (LKR)</label>
                  <select value={form.salary} onChange={e => update('salary', e.target.value)}
                    className={inputClass} style={{...inputStyle, appearance:'none'}}>
                    <option value="" style={{background:'#080F1E'}}>Select range</option>
                    <option value="Under 100,000" style={{background:'#080F1E'}}>Under LKR 100,000</option>
                    <option value="100,000 to 200,000" style={{background:'#080F1E'}}>LKR 100,000 – 200,000</option>
                    <option value="200,000 to 400,000" style={{background:'#080F1E'}}>LKR 200,000 – 400,000</option>
                    <option value="400,000+" style={{background:'#080F1E'}}>LKR 400,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Study time per week</label>
                  <select value={form.time} onChange={e => update('time', e.target.value)}
                    className={inputClass} style={{...inputStyle, appearance:'none'}}>
                    <option value="" style={{background:'#080F1E'}}>Select hours</option>
                    <option value="1 to 5" style={{background:'#080F1E'}}>1–5 hours/week</option>
                    <option value="5 to 10" style={{background:'#080F1E'}}>5–10 hours/week</option>
                    <option value="10 to 20" style={{background:'#080F1E'}}>10–20 hours/week</option>
                    <option value="20+" style={{background:'#080F1E'}}>20+ hours/week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{color:'rgba(245,240,232,0.5)'}}>Total study budget (LKR)</label>
                  <select value={form.budget} onChange={e => update('budget', e.target.value)}
                    className={inputClass} style={{...inputStyle, appearance:'none'}}>
                    <option value="" style={{background:'#080F1E'}}>Select range</option>
                    <option value="Under 50,000" style={{background:'#080F1E'}}>Under LKR 50,000</option>
                    <option value="50,000 to 150,000" style={{background:'#080F1E'}}>LKR 50,000 – 150,000</option>
                    <option value="150,000 to 500,000" style={{background:'#080F1E'}}>LKR 150,000 – 500,000</option>
                    <option value="500,000+" style={{background:'#080F1E'}}>LKR 500,000+</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(2)}
                    className="px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{border:'1px solid rgba(212,175,55,0.15)', color:'rgba(245,240,232,0.5)'}}>
                    ← Back
                  </button>
                  <button onClick={() => {
                    if (!form.salary || !form.time || !form.budget) { alert('Please fill in all fields.'); return }
                    generatePathway()
                  }} className="flex-1 font-bold py-4 rounded-xl transition-all duration-300"
                    style={{
                      background: loading ? 'rgba(212,175,55,0.3)' : 'linear-gradient(135deg, #D4AF37, #B8960C)',
                      color:'#080F1E',
                      boxShadow: loading ? 'none' : '0 8px 24px rgba(212,175,55,0.25)'
                    }}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{borderColor:'rgba(8,15,30,0.3)', borderTopColor:'#080F1E'}}></span>
                        Building your pathway...
                      </span>
                    ) : 'Build my pathway →'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* RESULTS */
          <div className="space-y-8">
            <div className="mb-4">
              <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{color:'#D4AF37'}}>Your personalised pathway</div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3" style={{letterSpacing:'-1px'}}>Here's your roadmap, {form.name.split(' ')[0]}</h2>
              <p style={{color:'rgba(245,240,232,0.55)', lineHeight:'1.7'}}>{pathway.summary}</p>
            </div>

            {pathway.paths.map((path, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{border:'1px solid rgba(212,175,55,0.15)', background:'rgba(255,255,255,0.02)'}}>

                {/* Path header */}
                <div className="p-6 border-b" style={{borderColor:'rgba(212,175,55,0.1)', background:'rgba(212,175,55,0.04)'}}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{color:'#D4AF37'}}>{path.title}</h3>
                      <p className="text-sm" style={{color:'rgba(245,240,232,0.5)'}}>{path.description}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                      style={{
                        background: path.local_demand === 'High' ? 'rgba(212,175,55,0.15)' : path.local_demand === 'Medium' ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.06)',
                        color: path.local_demand === 'High' ? '#D4AF37' : path.local_demand === 'Medium' ? '#FBB724' : 'rgba(245,240,232,0.4)',
                        border: `1px solid ${path.local_demand === 'High' ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.1)'}`
                      }}>
                      {path.local_demand} demand
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Cert steps */}
                  <div className="space-y-3">
                    {path.steps.map((s, j) => (
                      <div key={j} className="flex gap-4 rounded-xl p-4"
                        style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(212,175,55,0.08)'}}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                          style={{background:'rgba(212,175,55,0.15)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.25)'}}>
                          {j+1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-sm">{s.cert}</span>
                            <span style={{color:'rgba(245,240,232,0.25)'}}>·</span>
                            <span className="text-xs" style={{color:'rgba(245,240,232,0.45)'}}>{s.provider}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                              style={{background:'rgba(212,175,55,0.1)', color:'#D4AF37', border:'1px solid rgba(212,175,55,0.2)'}}>
                              {s.difficulty}
                            </span>
                          </div>
                          <p className="text-xs mb-2" style={{color:'rgba(245,240,232,0.45)', lineHeight:'1.6'}}>{s.why}</p>
                          <div className="flex gap-4 text-xs" style={{color:'rgba(245,240,232,0.35)'}}>
                            <span>⏱ {s.duration}</span>
                            <span>💰 LKR {s.cost_lkr?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pros / Cons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl p-4" style={{background:'rgba(212,175,55,0.04)', border:'1px solid rgba(212,175,55,0.1)'}}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#D4AF37'}}>Pros</p>
                      {path.pros.map((p, j) => (
                        <p key={j} className="text-xs mb-2 flex gap-2" style={{color:'rgba(245,240,232,0.55)'}}>
                          <span style={{color:'#D4AF37'}}>✓</span> {p}
                        </p>
                      ))}
                    </div>
                    <div className="rounded-xl p-4" style={{background:'rgba(255,100,100,0.03)', border:'1px solid rgba(255,100,100,0.1)'}}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'#EF8888'}}>Cons</p>
                      {path.cons.map((c, j) => (
                        <p key={j} className="text-xs mb-2 flex gap-2" style={{color:'rgba(245,240,232,0.55)'}}>
                          <span style={{color:'#EF8888'}}>✗</span> {c}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center justify-between pt-2 border-t" style={{borderColor:'rgba(212,175,55,0.1)'}}>
                    <span className="text-sm" style={{color:'rgba(245,240,232,0.45)'}}>Estimated salary range</span>
                    <span className="font-bold text-sm" style={{color:'#D4AF37'}}>{path.salary_range}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button onClick={() => { setPathway(null); setStep(1); setForm({ name:'',email:'',edu:'',field:'',interests:[],location:'',salary:'',time:'',budget:'' }) }}
                className="flex-1 py-4 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{border:'1px solid rgba(212,175,55,0.15)', color:'rgba(245,240,232,0.5)'}}>
                Start over
              </button>
              <button onClick={() => navigate('/')}
                className="flex-1 py-4 rounded-xl font-bold transition-all duration-300"
                style={{background:'linear-gradient(135deg, #D4AF37, #B8960C)', color:'#080F1E'}}>
                Back to home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}