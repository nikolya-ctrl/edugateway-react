import { useState } from 'react'

const steps = [
  { id: 1, title: 'Your background' },
  { id: 2, title: 'Your interests' },
  { id: 3, title: 'Your goals' },
]

export default function PathwayGenerator() {
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
      max_tokens: 4000,
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

  return (
    <div className="min-h-screen bg-[#0B1628] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-8 py-4 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#00C9A7]"></span>
        <span className="font-bold text-lg">EduGateway</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {!pathway ? (
          <>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-10">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${step === s.id ? 'bg-[#00C9A7] text-[#0B1628]' : step > s.id ? 'bg-[#00C9A7]/30 text-[#00C9A7]' : 'bg-white/10 text-gray-400'}`}>
                    {step > s.id ? '✓' : s.id}
                  </div>
                  <span className={`text-sm ${step === s.id ? 'text-white font-semibold' : 'text-gray-500'}`}>{s.title}</span>
                  {i < steps.length - 1 && <div className="w-8 h-px bg-white/10 mx-1"></div>}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Tell us about yourself</h2>
                  <p className="text-gray-400 text-sm">We'll use this to personalise your certification roadmap.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Full name</label>
                  <input value={form.name} onChange={e => update('name', e.target.value)}
                    placeholder="e.g. Kasun Perera"
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#00C9A7] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email address</label>
                  <input value={form.email} onChange={e => update('email', e.target.value)}
                    placeholder="you@email.com" type="email"
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#00C9A7] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Education level</label>
                  <select value={form.edu} onChange={e => update('edu', e.target.value)}
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00C9A7] transition-colors">
                    <option value="">Select your level</option>
                    <option value="O/L completed">O/L completed</option>
                    <option value="A/L completed">A/L completed</option>
                    <option value="Diploma / HND">Diploma / HND</option>
                    <option value="Undergraduate degree">Undergraduate degree</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Field of study</label>
                  <select value={form.field} onChange={e => update('field', e.target.value)}
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00C9A7] transition-colors">
                    <option value="">Select your field</option>
                    <option value="IT and Computer Science">IT and Computer Science</option>
                    <option value="Business and Management">Business and Management</option>
                    <option value="Commerce and Accounting">Commerce and Accounting</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Physical or Applied Science">Physical or Applied Science</option>
                    <option value="Arts and Humanities">Arts and Humanities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button onClick={() => {
                  if (!form.name || !form.edu || !form.field) { alert('Please fill in all fields.'); return }
                  setStep(2)
                }} className="w-full bg-[#00C9A7] text-[#0B1628] font-bold py-4 rounded-xl hover:bg-[#00A98C] transition-colors">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold mb-1">What interests you?</h2>
                  <p className="text-gray-400 text-sm">Pick all the areas you want to explore.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['Cloud computing','Software development','Cybersecurity','Data and AI','Finance and accounting','Marketing','Project management','MBA preparation'].map(i => (
                    <button key={i} onClick={() => toggleInterest(i)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                        ${form.interests.includes(i) ? 'border-[#00C9A7] text-[#00C9A7] bg-[#00C9A7]/10' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      {i}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Where do you want to work?</label>
                  <select value={form.location} onChange={e => update('location', e.target.value)}
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00C9A7] transition-colors">
                    <option value="">Select preference</option>
                    <option value="Stay in Sri Lanka">Stay in Sri Lanka</option>
                    <option value="Work abroad">Work abroad</option>
                    <option value="Remote or freelance">Remote or freelance</option>
                    <option value="Open to anything">Open to anything</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-4 border border-white/10 rounded-xl text-gray-400 hover:border-white/30 transition-colors">← Back</button>
                  <button onClick={() => {
                    if (form.interests.length === 0 || !form.location) { alert('Please select at least one interest and your location preference.'); return }
                    setStep(3)
                  }} className="flex-1 bg-[#00C9A7] text-[#0B1628] font-bold py-4 rounded-xl hover:bg-[#00A98C] transition-colors">
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Your goals and availability</h2>
                  <p className="text-gray-400 text-sm">This helps us recommend paths that are realistic for you.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Target monthly salary (LKR)</label>
                  <select value={form.salary} onChange={e => update('salary', e.target.value)}
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00C9A7] transition-colors">
                    <option value="">Select range</option>
                    <option value="Under 100,000">Under LKR 100,000</option>
                    <option value="100,000 to 200,000">LKR 100,000 – 200,000</option>
                    <option value="200,000 to 400,000">LKR 200,000 – 400,000</option>
                    <option value="400,000+">LKR 400,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Study time per week</label>
                  <select value={form.time} onChange={e => update('time', e.target.value)}
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00C9A7] transition-colors">
                    <option value="">Select hours</option>
                    <option value="1 to 5">1–5 hours/week</option>
                    <option value="5 to 10">5–10 hours/week</option>
                    <option value="10 to 20">10–20 hours/week</option>
                    <option value="20+">20+ hours/week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Total study budget (LKR)</label>
                  <select value={form.budget} onChange={e => update('budget', e.target.value)}
                    className="w-full bg-[#132038] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#00C9A7] transition-colors">
                    <option value="">Select range</option>
                    <option value="Under 50,000">Under LKR 50,000</option>
                    <option value="50,000 to 150,000">LKR 50,000 – 150,000</option>
                    <option value="150,000 to 500,000">LKR 150,000 – 500,000</option>
                    <option value="500,000+">LKR 500,000+</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-4 border border-white/10 rounded-xl text-gray-400 hover:border-white/30 transition-colors">← Back</button>
                  <button onClick={() => {
                    if (!form.salary || !form.time || !form.budget) { alert('Please fill in all fields.'); return }
                    generatePathway()
                  }} className="flex-1 bg-[#00C9A7] text-[#0B1628] font-bold py-4 rounded-xl hover:bg-[#00A98C] transition-colors">
                    {loading ? 'Building your pathway...' : 'Build my pathway →'}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your personalised pathway</h2>
              <p className="text-gray-400">{pathway.summary}</p>
            </div>
            {pathway.paths.map((path, i) => (
              <div key={i} className="bg-[#132038] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#00C9A7]">{path.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{path.description}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap
                    ${path.local_demand === 'High' ? 'bg-[#00C9A7]/15 text-[#00C9A7]' : path.local_demand === 'Medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-white/10 text-gray-400'}`}>
                    {path.local_demand} local demand
                  </span>
                </div>
                <div className="space-y-3">
                  {path.steps.map((s, j) => (
                    <div key={j} className="flex gap-4 bg-[#0B1628] rounded-xl p-4">
                      <div className="w-7 h-7 rounded-full bg-[#00C9A7]/15 text-[#00C9A7] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{j+1}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{s.cert}</span>
                          <span className="text-xs text-gray-500">·</span>
                          <span className="text-xs text-gray-400">{s.provider}</span>
                          <span className="text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">{s.difficulty}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{s.why}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>⏱ {s.duration}</span>
                          <span>💰 LKR {s.cost_lkr?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#00C9A7] mb-2">PROS</p>
                    {path.pros.map((p, j) => <p key={j} className="text-xs text-gray-400 mb-1">✓ {p}</p>)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-400 mb-2">CONS</p>
                    {path.cons.map((c, j) => <p key={j} className="text-xs text-gray-400 mb-1">✗ {c}</p>)}
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <span className="text-sm text-gray-400">Salary range: <span className="text-white font-semibold">{path.salary_range}</span></span>
                </div>
              </div>
            ))}
            <button onClick={() => { setPathway(null); setStep(1); setForm({ name:'',email:'',edu:'',field:'',interests:[],location:'',salary:'',time:'',budget:'' }) }}
              className="w-full border border-white/10 text-gray-400 py-4 rounded-xl hover:border-white/30 transition-colors">
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  )
}