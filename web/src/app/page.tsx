'use client'
import { useState } from 'react'

function parseGitHubUrl(url: string): string {
  let cleanUrl = url.trim()
  cleanUrl = cleanUrl.replace(/^https?:\/\//, '')
  cleanUrl = cleanUrl.replace(/^github\.com\//, '')
  
  const treeMatch = cleanUrl.match(/^([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)$/)
  if (treeMatch) {
    const [, owner, repo, branch, path] = treeMatch
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}/SKILL.md`
  }
  
  const blobMatch = cleanUrl.match(/^([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/)
  if (blobMatch) {
    const [, owner, repo, branch, path] = blobMatch
    if (path.endsWith('SKILL.md')) {
      return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
    }
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}/SKILL.md`
  }
  
  const simpleMatch = cleanUrl.match(/^([^\/]+)\/([^\/]+)\/?$/)
  if (simpleMatch) {
    const [, owner, repo] = simpleMatch
    return `https://raw.githubusercontent.com/${owner}/${repo}/main/SKILL.md`
  }
  
  return `https://raw.githubusercontent.com/${cleanUrl}/main/SKILL.md`
}

async function fetchSkillMd(url: string): Promise<string> {
  const rawUrl = parseGitHubUrl(url)
  let res = await fetch(rawUrl)
  if (!res.ok) {
    const masterUrl = rawUrl.replace('/main/', '/master/')
    res = await fetch(masterUrl)
    if (!res.ok) throw new Error(`Could not fetch SKILL.md from ${url}`)
  }
  return res.text()
}

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
        skills.filter(u => u.trim()).map(async (url) => {
          const content = await fetchSkillMd(url)
          return { url, content }
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
    } catch (e: any) { 
      setError(e.message || 'Failed to fetch skills') 
    }
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
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FFCF00] px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo - Skills Lego in one box */}
          <div className="bg-[#E3000B] rounded-lg px-4 py-2 flex items-center gap-2">
            <BrickIcon />
            <span className="text-white font-black text-lg tracking-tight">SKILLS LEGO</span>
          </div>
          
          {/* GitHub link with icon */}
          <a 
            href="https://github.com/prashaantr/skills-lego" 
            target="_blank"
            className="flex items-center gap-2 text-[#1B1B1B] hover:text-[#1B1B1B]/70 font-bold text-sm"
          >
            <GitHubIcon />
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#FFCF00] px-4 md:px-8 pb-12 pt-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-[#1B1B1B] mb-2">
            Build composite skills
          </h1>
          <p className="text-[#1B1B1B]/70 text-lg">
            Stack Claude skills like LEGO bricks
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 -mt-4">
        <div className="bg-white rounded-2xl border-2 border-[#1B1B1B]/10 p-6 md:p-8">
          
          {/* Name & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[#1B1B1B] font-bold text-sm mb-2">Skill Name</label>
              <input
                type="text"
                placeholder="my-composite-skill"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border-2 border-[#1B1B1B]/10 rounded-lg px-4 py-3 text-[#1B1B1B] placeholder:text-[#1B1B1B]/30 focus:border-[#0055BF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#1B1B1B] font-bold text-sm mb-2">Description</label>
              <input
                type="text"
                placeholder="What this skill does"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border-2 border-[#1B1B1B]/10 rounded-lg px-4 py-3 text-[#1B1B1B] placeholder:text-[#1B1B1B]/30 focus:border-[#0055BF] focus:outline-none"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-[#1B1B1B] font-bold text-sm mb-3">Skills to combine</label>
            <p className="text-[#1B1B1B]/50 text-xs mb-3">
              Supports: github.com/user/repo or github.com/user/repo/tree/main/path/to/skill
            </p>
            <div className="space-y-3">
              {skills.map((url, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    <Brick color="white" />
                  </div>
                  <input
                    type="text"
                    placeholder={`github.com/user/repo or .../tree/main/path`}
                    value={url}
                    onChange={e => { const n = [...skills]; n[i] = e.target.value; setSkills(n) }}
                    className="flex-1 border-2 border-[#1B1B1B]/10 rounded-lg px-4 py-3 text-[#1B1B1B] placeholder:text-[#1B1B1B]/30 focus:border-[#0055BF] focus:outline-none text-sm"
                  />
                  {skills.length > 1 && (
                    <button
                      onClick={() => setSkills(skills.filter((_, j) => j !== i))}
                      className="text-[#1B1B1B]/30 hover:text-[#E3000B] text-xl font-bold"
                    >
                      x
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setSkills([...skills, ''])}
              className="mt-3 text-[#0055BF] hover:underline font-bold text-sm"
            >
              + Add another skill
            </button>
          </div>

          {/* Workflow */}
          <div className="mb-6">
            <label className="block text-[#1B1B1B] font-bold text-sm mb-2">
              Workflow <span className="font-normal text-[#1B1B1B]/50">(how skills work together)</span>
            </label>
            <textarea
              placeholder={`Example:
1. Use skill-1 to extract data
2. Process with skill-2
3. Format output with skill-3`}
              value={workflow}
              onChange={e => setWorkflow(e.target.value)}
              rows={5}
              className="w-full border-2 border-[#1B1B1B]/10 rounded-lg px-4 py-3 text-[#1B1B1B] placeholder:text-[#1B1B1B]/30 focus:border-[#0055BF] focus:outline-none resize-none"
            />
          </div>

          {/* Build Button */}
          <button
            onClick={compose}
            disabled={loading || !skills.some(u => u.trim())}
            className="w-full md:w-auto px-8 py-4 bg-[#E3000B] hover:bg-[#C50000] text-white font-black text-lg rounded-lg disabled:bg-[#1B1B1B]/20 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Building...' : 'Build Skill'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-[#E3000B]/10 rounded-lg border border-[#E3000B]/20">
              <p className="text-[#E3000B] font-bold text-sm">{error}</p>
              <p className="text-[#1B1B1B]/50 text-xs mt-1">
                Make sure the repo/path contains a SKILL.md file
              </p>
            </div>
          )}
        </div>

        {/* Output */}
        {result && (
          <div className="mt-6 bg-[#1B1B1B] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10">
              <span className="text-white font-bold">
                {name || 'composed-skill'}/SKILL.md
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={copy}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={download}
                  className="px-4 py-2 bg-[#FFCF00] hover:bg-[#FFD633] text-[#1B1B1B] rounded-lg font-bold text-sm transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="p-6 text-white/80 text-sm overflow-auto max-h-96 font-mono">
              {result}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-8 h-6 rounded bg-[#E3000B]" />
          <div className="w-8 h-6 rounded bg-[#FFCF00]" />
          <div className="w-8 h-6 rounded bg-[#0055BF]" />
          <div className="w-8 h-6 rounded bg-[#237841]" />
        </div>
      </div>
    </main>
  )
}

function Brick({ color }: { color: string }) {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <rect y="4" width="20" height="12" rx="2" fill={color} />
      <circle cx="6" cy="4" r="3" fill={color} />
      <circle cx="14" cy="4" r="3" fill={color} />
    </svg>
  )
}

function BrickIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
      <rect y="5" width="24" height="15" rx="2" fill="white" />
      <circle cx="7" cy="5" r="4" fill="white" />
      <circle cx="17" cy="5" r="4" fill="white" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}
