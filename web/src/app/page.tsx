"use client";

import { useState } from "react";

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
}

const SKILLS: Skill[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web using Perplexity or Brave API",
    category: "Research",
    code: `# Web Search Skill
def web_search(query: str) -> str:
    """Search the web for information."""
    # Implementation here
    pass`,
  },
  {
    id: "file-operations",
    name: "File Operations",
    description: "Read, write, and manage files",
    category: "System",
    code: `# File Operations Skill
def read_file(path: str) -> str:
    """Read file contents."""
    with open(path, 'r') as f:
        return f.read()`,
  },
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Execute Python code safely",
    category: "System",
    code: `# Code Execution Skill
def execute_code(code: str) -> str:
    """Execute Python code in sandbox."""
    # Safe execution here
    pass`,
  },
  {
    id: "api-integration",
    name: "API Integration",
    description: "Connect to external APIs and services",
    category: "Integration",
    code: `# API Integration Skill
def call_api(url: str, method: str = "GET") -> dict:
    """Make API requests."""
    import requests
    return requests.request(method, url).json()`,
  },
  {
    id: "memory-storage",
    name: "Memory Storage",
    description: "Persistent memory for context retention",
    category: "Memory",
    code: `# Memory Storage Skill
def store_memory(key: str, value: str) -> None:
    """Store data in persistent memory."""
    # Supabase or local storage
    pass`,
  },
  {
    id: "browser-control",
    name: "Browser Control",
    description: "Automate web browsers for scraping and testing",
    category: "Automation",
    code: `# Browser Control Skill
def browse(url: str) -> str:
    """Control browser and extract content."""
    # Playwright automation
    pass`,
  },
];

const CATEGORIES = ["All", "Research", "System", "Integration", "Memory", "Automation"];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 14V5C4 3.89543 4.89543 3 6 3H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 3V13M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 15V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export default function Home() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [copied, setCopied] = useState(false);

  const filteredSkills = activeCategory === "All" 
    ? SKILLS 
    : SKILLS.filter(s => s.category === activeCategory);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const composedCode = selectedSkills
    .map(id => SKILLS.find(s => s.id === id)?.code)
    .filter(Boolean)
    .join("\n\n");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(composedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([composedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "composed_skill.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-accent">
              <BlockIcon />
            </div>
            <h1 className="text-xl font-semibold">Skills Lego</h1>
          </div>
          <a 
            href="https://github.com/prashaantr/skills-lego"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text transition-colors text-sm"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Build AI Skills Like <span className="text-accent">Lego Blocks</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Select and compose modular skill blocks to create powerful AI agent capabilities. 
            Mix and match to build exactly what you need.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "bg-surface text-text-muted hover:text-text border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Grid */}
          <div className="lg:col-span-2">
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredSkills.map(skill => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`p-5 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-accent/10 border-accent"
                        : "bg-surface border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium text-accent bg-accent/20 px-2 py-1 rounded">
                        {skill.category}
                      </span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-accent border-accent text-white" 
                          : "border-border"
                      }`}>
                        {isSelected && <CheckIcon />}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{skill.name}</h3>
                    <p className="text-sm text-text-muted">{skill.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Composer Panel */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-5 sticky top-8">
              <h3 className="font-semibold mb-4">
                Composed Skill
                <span className="text-text-muted font-normal ml-2">
                  ({selectedSkills.length} blocks)
                </span>
              </h3>

              {selectedSkills.length === 0 ? (
                <div className="text-text-muted text-sm py-8 text-center">
                  Select skill blocks to compose
                </div>
              ) : (
                <>
                  <div className="bg-background rounded-lg p-4 mb-4 max-h-80 overflow-auto">
                    <pre className="text-xs text-text-muted font-mono whitespace-pre-wrap">
                      {composedCode}
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium transition-colors"
                    >
                      <CopyIcon />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={downloadFile}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border hover:border-accent text-text rounded-lg font-medium transition-colors"
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16 px-6 py-6">
        <div className="max-w-7xl mx-auto text-center text-text-muted text-sm">
          Built with Skills Lego - Modular AI Agent Skills
        </div>
      </footer>
    </main>
  );
}
