'use client'
import { useState } from 'react'

export default function Home() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState(['', '', ''])
  const [workflow, setWorkflow] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const compose = async () => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      const fetchedSkills = await Promise.all(
        skills.filter(u => u.trim()).map(async (url, i) => {
          const rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
          const skillUrl = rawUrl.includes('SKILL.md') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/main/SKILL.md`
          const res = await fetch(skillUrl)
          if (!res.ok) {
            const res2 = await fetch(skillUrl.replace('/main/', '/master/'))
            if (!res2.ok) throw new Error(`fetch failed: skill ${i + 1}`)
            return { url, content: await res2.text() }
          }
          return { url, content: await res.text() }
        })
      )
      
      const skillName = name || 'composed-skill'
      const composed = `---
name: "${skillName}"
description: "${description || `Composite skill combining ${fetchedSkills.length} capabilities`}"
---

# ${skillName}

${workflow ? `## Workflow\n\n${workflow}\n\n` : ''}## Skills Reference

| Skill | Source |
|-------|--------|
${fetchedSkills.map((s, i) => `| Skill ${i + 1} | ${s.url} |`).join('\n')}

---

${fetchedSkills.map((s, i) => `## references/skill-${i + 1}.md

${s.content}`).join('\n\n---\n\n')}
`
      setResult(composed)
    } catch (e: any) { setError(e.message || 'Failed') }
    setLoading(false)
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([result], { type: 'text/markdown' }))
    a.download = `${name || 'composed-skill'}.md`
    a.click()
  }

  const copy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const colors = ['#E3000B', '#FFCF00', '#0055BF']

  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-4 md:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brick color="#E3000B" />
            <span className="font-mono font-bold text-sm">skills-lego</span>
          </div>
          <a 
            href="https://github.com/prashaantr/skills-lego" 
            target="_blank"
            className="text-white/50 hover:text-white text-sm font-mono"
          >
            github
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-start gap-4 mb-8">
          <div className="hidden md:flex flex-col gap-1 pt-1">
            <Brick color="#FFCF00" size="sm" />
            <Brick color="#0055BF" size="sm" />
            <Brick color="#237841" size="sm" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Compose Skills
            </h1>
            <p className="text-white/50 font-mono text-sm">
              Combine Claude skills into one composite with orchestration logic
            </p>
          </div>
        </div>

        {/* Name & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-white/50 font-mono text-xs mb-2">--name</label>
            <input
              type="text"
              placeholder="my-composite-skill"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 font-mono text-sm placeholder:text-white/30 focus:border-white/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white/50 font-mono text-xs mb-2">--description</label>
            <input
              type="text"
              placeholder="What this composite does"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 font-mono text-sm placeholder:text-white/30 focus:border-white/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-white/50 font-mono text-xs mb-2">--skills</label>
          <div className="space-y-3">
            {skills.map((url, i) => (
              <div key={i} className="relative">
                <div 
                  className="rounded-lg p-3 border"
                  style={{ 
                    backgroundColor: `${colors[i]}10`,
                    borderColor: `${colors[i]}30`
                  }}
                >
                  <div className="absolute -top-1.5 left-3 flex gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }} />
                  </div>
                  <input
                    type="text"
                    placeholder={`github.com/user/skill-${i + 1}`}
                    value={url}
                    onChange={e => { const n = [...skills]; n[i] = e.target.value; setSkills(n) }}
                    className="w-full bg-[#0D0D0D] border border-white/10 rounded px-3 py-2 font-mono text-sm placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSkills([...skills, ''])}
            className="mt-2 text-white/40 hover:text-white/70 text-xs font-mono"
          >
            + add skill
          </button>
        </div>

        {/* Workflow */}
        <div className="mb-6">
          <label className="block text-white/50 font-mono text-xs mb-2">
            --workflow <span className="text-[#FFCF00]">(orchestration logic)</span>
          </label>
          <textarea
            placeholder={`How the skills work together. Example:

When creating a study guide:
1. Extract video transcript using skill-1
2. For EACH major concept:
   a. Create a diagram using skill-2
   b. Add context and explanation
3. Compile final PDF using skill-3

IMPORTANT: Process concepts incrementally, not all at end.`}
            value={workflow}
            onChange={e => setWorkflow(e.target.value)}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded px-3 py-3 font-mono text-sm placeholder:text-white/30 focus:border-white/30 focus:outline-none resize-none"
          />
          <p className="mt-1 text-white/30 text-xs font-mono">
            The workflow is the secret sauce - tells Claude how to coordinate the skills
          </p>
        </div>

        {/* Compose Button */}
        <button
          onClick={compose}
          disabled={loading || !skills.some(u => u.trim())}
          className="relative px-8 py-3 bg-[#FFCF00] text-[#0D0D0D] font-bold rounded text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
            <div className="w-2 h-2 rounded-full bg-[#FFE066]" />
            <div className="w-2 h-2 rounded-full bg-[#FFE066]" />
          </div>
          {loading ? 'composing...' : 'lego.py compose'}
        </button>

        {error && (
          <p className="mt-4 text-[#E3000B] font-mono text-sm">
            error: {error}
          </p>
        )}

        {/* Output */}
        {result && (
          <div className="mt-8 border border-white/10 rounded-lg overflow-hidden relative">
            <div className="absolute -top-1.5 left-6 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#237841]" />
              <div className="w-3 h-3 rounded-full bg-[#237841]" />
              <div className="w-3 h-3 rounded-full bg-[#237841]" />
            </div>
            
            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/10">
              <span className="font-mono text-sm text-white/50">
                {name || 'composed-skill'}/SKILL.md
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={copy}
                  className="px-3 py-1 text-xs font-mono text-white/70 hover:text-white border border-white/20 rounded"
                >
                  {copied ? 'copied' : 'copy'}
                </button>
                <button 
                  onClick={download}
                  className="px-3 py-1 text-xs font-mono bg-[#FFCF00] text-[#0D0D0D] rounded font-bold"
                >
                  download
                </button>
              </div>
            </div>
            <pre className="p-4 text-sm font-mono text-white/80 overflow-auto max-h-96 bg-[#0D0D0D]">
              {result}
            </pre>
          </div>
        )}

        {/* CLI equivalent */}
        <div className="mt-8 border border-white/10 rounded-lg p-4">
          <p className="text-white/40 text-xs font-mono mb-2">CLI equivalent:</p>
          <code className="text-[#FFCF00] text-xs font-mono break-all">
            python lego.py --name "{name || 'my-skill'}" --skills {skills.filter(s => s).map(s => `"${s}"`).join(' ') || '"..."'} --workflow "..." --output ./output
          </code>
        </div>
      </div>
    </main>
  )
}

function Brick({ color, size = 'md' }: { color: string; size?: 'xs' | 'sm' | 'md' }) {
  const dims = {
    xs: { w: 16, h: 10, stud: 4 },
    sm: { w: 24, h: 14, stud: 5 },
    md: { w: 32, h: 18, stud: 6 },
  }[size]
  
  return (
    <div className="relative" style={{ width: dims.w, height: dims.h + dims.stud }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-0.5">
        <div className="rounded-full" style={{ width: dims.stud, height: dims.stud, backgroundColor: color, filter: 'brightness(1.2)' }} />
        <div className="rounded-full" style={{ width: dims.stud, height: dims.stud, backgroundColor: color, filter: 'brightness(1.2)' }} />
      </div>
      <div className="absolute bottom-0 w-full rounded-sm" style={{ height: dims.h, backgroundColor: color }} />
    </div>
  )
}
