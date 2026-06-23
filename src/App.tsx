import React, { useMemo, useState } from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'incidents', label: 'Incidents', icon: 'security' },
  { id: 'map', label: 'Map', icon: 'public' },
  { id: 'analysis', label: 'Analysis', icon: 'psychology' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

const incidents = [
  {
    timestamp: '2023.10.27 | 14:23:45',
    title: 'Encrypted Payload',
    subtitle: 'Heuristic Match #982',
    source: '192.168.0.124',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    icon: 'bug_report',
    iconBg: 'bg-rose-500/10 text-rose-300',
  },
  {
    timestamp: '2023.10.27 | 14:18:12',
    title: 'Auth Brute Force',
    subtitle: 'L3 Endpoint Breach Attempt',
    source: '45.23.120.9',
    severity: 'HIGH',
    status: 'BLOCKED',
    badgeClass: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    icon: 'login',
    iconBg: 'bg-orange-500/10 text-orange-300',
  },
  {
    timestamp: '2023.10.27 | 13:55:01',
    title: 'Service Outage',
    subtitle: 'Node AWS-04-A Unreachable',
    source: 'N/A (Cloud)',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    icon: 'cloud_off',
    iconBg: 'bg-amber-500/10 text-amber-300',
  },
]

const severityOptions = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

const sampleQueries = [
  'Suspicious outbound data transfer from finance server',
  'Repeated failed login attempts on admin portal',
  'Suspicious link sent to an employee inbox',
  'Encrypted payload detected in endpoint traffic',
]

const defaultAnalysis = {
  summary: 'Submit the query to receive an AI-style threat summary.',
  severity: 'INFO',
  confidence: 'N/A',
  actions: ['Type a scenario above and click Search to get a structured response.'],
  note: undefined,
}

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const generateLocalAnalysis = (prompt: string): AnalysisResult => {
  const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']
  const severity = randomItem(severities)
  const confidence = `${Math.floor(58 + Math.random() * 38)}%`
  const score = Math.floor(1000 + Math.random() * 9000)
  const lower = prompt.toLowerCase()
  const threatType = lower.includes('link') || lower.includes('url') || lower.includes('phish')
    ? 'phishing or malicious-link activity'
    : lower.includes('login') || lower.includes('auth')
    ? 'credential abuse'
    : lower.includes('payload') || lower.includes('file')
    ? 'malware delivery'
    : randomItem(['network anomaly', 'suspicious access pattern', 'endpoint alert', 'data movement signal'])

  return {
    summary: `Generated analysis #${score}: "${prompt}" resembles ${threatType}. The event should be reviewed, correlated with recent activity, and treated as ${severity.toLowerCase()} priority until validated.`,
    severity,
    confidence,
    actions: [
      randomItem([
        'Preserve the original alert, URL, headers, and affected asset details.',
        'Collect endpoint, identity, and network logs around the event time.',
        'Check whether other users or hosts saw the same indicator.',
      ]),
      randomItem([
        'Block the indicator temporarily while reputation and ownership are verified.',
        'Run the indicator through a sandbox or threat-intelligence lookup.',
        'Review recent sign-ins and revoke suspicious sessions if needed.',
      ]),
      randomItem([
        'Escalate to incident response if the indicator repeats or touches sensitive systems.',
        'Notify the impacted user and confirm whether they interacted with the event.',
        'Document the finding and tune detection rules after validation.',
      ]),
    ],
    note: 'Generated locally so the dashboard always shows output for non-empty input.',
  }
}

type AnalysisResult = {
  summary: string
  severity: string
  confidence: string
  actions: string[]
  note?: string
}

type AnalysisEntry = AnalysisResult & {
  id: number
  query: string
  time: string
}

type MetricCounts = {
  critical: number
  high: number
  medium: number
  low: number
}

const deriveMetrics = (input: string) => {
  const lower = input.toLowerCase()

  if (lower.includes('brute') || lower.includes('auth') || lower.includes('login')) {
    return {
      riskScore: 72,
      status: 'High Threat',
      trend: '+24% this hour',
      counts: { critical: 6, high: 18, medium: 22, low: 56 },
    }
  }

  if (lower.includes('payload') || lower.includes('encrypted') || lower.includes('exfiltration')) {
    return {
      riskScore: 88,
      status: 'Critical Threat',
      trend: '+42% this hour',
      counts: { critical: 14, high: 21, medium: 12, low: 28 },
    }
  }

  if (lower.includes('link') || lower.includes('url') || lower.includes('phish') || lower.includes('suspicious')) {
    return {
      riskScore: 76,
      status: 'High Threat',
      trend: '+31% this hour',
      counts: { critical: 9, high: 24, medium: 18, low: 40 },
    }
  }

  if (lower.includes('outbound') || lower.includes('data transfer') || lower.includes('cloud')) {
    return {
      riskScore: 64,
      status: 'Elevated Risk',
      trend: '+18% this hour',
      counts: { critical: 8, high: 14, medium: 24, low: 36 },
    }
  }

  if (lower.includes('rogue') || lower.includes('unknown device') || lower.includes('new device')) {
    return {
      riskScore: 56,
      status: 'Medium Risk',
      trend: '+12% this hour',
      counts: { critical: 4, high: 10, medium: 28, low: 48 },
    }
  }

  return {
    riskScore: 18,
    status: 'Minimal Threat',
    trend: '-12% from yesterday',
    counts: { critical: 4, high: 12, medium: 34, low: 128 },
  }
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [activeSeverity, setActiveSeverity] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>(defaultAnalysis)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisEntry[]>([])
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [metrics, setMetrics] = useState(deriveMetrics(''))

  const filteredIncidents = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    return incidents.filter((incident) => {
      const matchesSeverity = activeSeverity === 'ALL' || incident.severity === activeSeverity
      const matchesSearch = !normalized ||
        incident.title.toLowerCase().includes(normalized) ||
        incident.subtitle.toLowerCase().includes(normalized) ||
        incident.source.toLowerCase().includes(normalized) ||
        incident.severity.toLowerCase().includes(normalized)
      return matchesSeverity && matchesSearch
    })
  }, [activeSeverity, searchQuery])

  const sectionLabel = navItems.find((item) => item.id === activeSection)?.label || 'Dashboard'

  const handleAnalyze = async (query = searchQuery) => {
    const prompt = query.trim()
    setSearchQuery(prompt)
    setActiveSection('dashboard')

    if (!prompt) {
      setAnalysisError('Please enter a network event or query.')
      setAnalysisResult(defaultAnalysis)
      setMetrics(deriveMetrics(''))
      return
    }

    setAnalysisError('')
    setAnalysisLoading(false)
    setMetrics(deriveMetrics(prompt))

    const generated = generateLocalAnalysis(prompt)
    setAnalysisResult(generated)
    const entry: AnalysisEntry = {
      id: Date.now(),
      query: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...generated,
    }
    setAnalysisHistory((history) => [entry, ...history].slice(0, 4))
  }

  const handleQuickPrompt = (prompt: string) => {
    setSearchQuery(prompt)
    handleAnalyze(prompt)
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {analysisError ? (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">
                {analysisError}
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Risk score</p>
                <p className="mt-4 text-5xl font-semibold text-white">{metrics.riskScore}</p>
                <p className="mt-3 text-sm text-zinc-400">{metrics.status}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Critical</p>
                <p className="mt-4 text-4xl font-semibold text-rose-300">{metrics.counts.critical}</p>
                <p className="mt-3 text-sm text-zinc-400">{metrics.trend}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">High</p>
                <p className="mt-4 text-4xl font-semibold text-orange-300">{metrics.counts.high}</p>
                <p className="mt-3 text-sm text-zinc-400">Active investigations</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Medium</p>
                <p className="mt-4 text-4xl font-semibold text-amber-300">{metrics.counts.medium}</p>
                <p className="mt-3 text-sm text-zinc-400">Queued for review</p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Current analysis</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{analysisResult.severity} assessment</h3>
                  </div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-zinc-300">
                    Confidence <span className="font-semibold text-white">{analysisResult.confidence}</span>
                  </div>
                </div>
                <p className="mt-6 text-sm leading-7 text-zinc-300">{analysisResult.summary}</p>
                {analysisResult.note ? (
                  <p className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                    {analysisResult.note}
                  </p>
                ) : null}
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Response actions</p>
                <div className="mt-5 space-y-3">
                  {analysisResult.actions.map((action, index) => (
                    <div key={index} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-zinc-300">
                      <p className="font-semibold text-white">Action {index + 1}</p>
                      <p className="mt-2 leading-6">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Quick prompts</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {sampleQueries.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={analysisLoading}
                    className="rounded-2xl border border-slate-700 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 'incidents':
        return (
          <>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Incident Operations</p>
                  <h3 className="mt-3 text-3xl font-semibold text-white">Active incident feed</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {severityOptions.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setActiveSeverity(level)}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                        activeSeverity === level
                          ? 'bg-slate-200 text-slate-950'
                          : 'border border-slate-700 text-zinc-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[720px] border-separate border-spacing-y-3 text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Threat</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Severity</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map((incident) => (
                      <tr key={incident.timestamp} className="rounded-3xl bg-slate-950/80">
                        <td className="px-4 py-4 align-middle text-zinc-300">{incident.timestamp}</td>
                        <td className="px-4 py-4 align-middle text-white">
                          <div className="font-semibold">{incident.title}</div>
                          <div className="text-xs text-zinc-500">{incident.subtitle}</div>
                        </td>
                        <td className="px-4 py-4 align-middle text-zinc-300">{incident.source}</td>
                        <td className="px-4 py-4 align-middle">
                          <span className={`inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${
                            incident.severity === 'CRITICAL'
                              ? 'bg-rose-500/10 text-rose-300'
                              : incident.severity === 'HIGH'
                              ? 'bg-orange-500/10 text-orange-300'
                              : incident.severity === 'MEDIUM'
                              ? 'bg-amber-500/10 text-amber-300'
                              : 'bg-slate-500/10 text-slate-300'
                          }`}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-middle text-zinc-400">{incident.status}</td>
                      </tr>
                    ))}
                    {filteredIncidents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                          No incidents match your filter. Adjust the severity or search terms.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )

      case 'map':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Infrastructure view</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Threat map overview</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Visualize the active event topology and suspicious host clusters. This page focuses on network context and source distribution.
              </p>
              <div className="mt-8 h-[420px] rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white">
                <div className="grid h-full grid-cols-3 gap-5">
                  <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Suspicious hosts</p>
                    <p className="mt-4 text-4xl font-semibold">12</p>
                    <p className="mt-3 text-sm text-zinc-400">Top source clusters identified in the last hour.</p>
                  </div>
                  <div className="col-span-2 rounded-[2rem] border border-slate-700 bg-slate-950/50 p-6">
                    <div className="flex h-full items-center justify-center text-zinc-500">
                      <div className="space-y-4 text-center">
                        <div className="text-4xl">🛰️</div>
                        <p className="text-sm">Map visualization placeholder</p>
                        <p className="max-w-sm text-xs text-zinc-400">
                          This page is ready for integration with a live map provider or threat topology renderer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Traffic anomalies</p>
                <h4 className="mt-3 text-xl font-semibold text-white">Outbound spikes</h4>
                <p className="mt-4 text-sm text-zinc-300">The highest-risk outbound flows are clustered around the finance and cloud subnet groups. Watch for repeated destination changes.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Asset status</p>
                <h4 className="mt-3 text-xl font-semibold text-white">Hosts under review</h4>
                <ul className="mt-5 space-y-3 text-sm text-zinc-300">
                  <li>Finance server 1: suspicious packet burst</li>
                  <li>Admin portal: repeated credential checks</li>
                  <li>Cloud instance: unusual encrypted upload</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'analysis':
        return (
          <div className="space-y-6">
            {analysisError ? (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-200">
                {analysisError}
              </div>
            ) : null}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">AI-driven analysis</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Analyze event details</h3>
              <p className="mt-4 text-sm text-zinc-300">Use the input above to submit a network event directly to the AI analysis endpoint.</p>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Analysis summary</p>
                <div className="mt-5 rounded-3xl border border-slate-700 bg-slate-950 p-6 text-sm text-zinc-300">
                  <p>{analysisResult.summary}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-900 p-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
                      <p>Severity</p>
                      <p className="mt-2 text-white">{analysisResult.severity}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
                      <p>Confidence</p>
                      <p className="mt-2 text-white">{analysisResult.confidence}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 p-3 text-xs uppercase tracking-[0.28em] text-zinc-500">
                      <p>Actions</p>
                      <p className="mt-2 text-white">{analysisResult.actions.length}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Response actions</p>
                <div className="mt-5 space-y-3 text-sm text-zinc-300">
                  {analysisResult.actions.map((action, index) => (
                    <div key={index} className="rounded-3xl border border-slate-700 bg-slate-950 p-4">
                      <p className="font-semibold text-white">Action {index + 1}</p>
                      <p className="mt-2 text-zinc-300">{action}</p>
                    </div>
                  ))}
                </div>
                {analysisResult.note ? (
                  <div className="mt-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                    <p className="font-semibold">Backend note</p>
                    <p className="mt-2 text-zinc-200">{analysisResult.note}</p>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">History</p>
              <div className="mt-5 space-y-4">
                {analysisHistory.length === 0 ? (
                  <p className="text-sm text-zinc-500">No analysis history yet. Run a search to populate this panel.</p>
                ) : (
                  analysisHistory.map((entry) => (
                    <div key={entry.id} className="rounded-3xl border border-slate-700 bg-slate-950 p-4">
                      <div className="flex items-center justify-between text-sm text-zinc-400">
                        <span>{entry.time}</span>
                        <span>{entry.severity}</span>
                      </div>
                      <p className="mt-2 text-white">{entry.query}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">System settings</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Deployment and API</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                This page shows the setup you need for the backend API and OpenAI integration. Use it to verify that the project is ready for Vercel or local development.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Environment</p>
                <h4 className="mt-3 text-xl font-semibold text-white">OpenAI key</h4>
                <p className="mt-4 text-sm text-zinc-300">The backend uses an OpenAI key from `.env` or the deployment environment. Without it, the app falls back to local analysis.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Local development</p>
                <h4 className="mt-3 text-xl font-semibold text-white">Run the app</h4>
                <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                  <li>Install dependencies: `npm install`</li>
                  <li>Start app: `npm run dev`</li>
                  <li>Visit the local URL printed by Vite.</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm text-zinc-300">
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Notes</p>
              <p className="mt-4">The `/api/analyze` backend is handled by the local `server.js` Express endpoint. Vite proxies client requests to the API during development.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-800 bg-slate-900/95 px-6 py-8 backdrop-blur-xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.36em] text-zinc-500">Autonomous OPS</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">Aegis Hunter</h1>
        </div>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                activeSection === item.id
                  ? 'bg-zinc-200/10 text-white shadow-inner'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-4">
          <button className="w-full rounded-2xl bg-zinc-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-zinc-200">
            Investigate
          </button>
          <div className="rounded-3xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-zinc-400">
            <p className="font-semibold text-zinc-200">Shortcuts</p>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-xl border border-slate-700 px-3 py-2 text-left text-zinc-300 transition hover:border-slate-500 hover:text-white">Support</button>
              <button className="w-full rounded-xl border border-slate-700 px-3 py-2 text-left text-zinc-300 transition hover:border-slate-500 hover:text-white">Logs</button>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-72">
        <header className="border-b border-slate-800 bg-slate-900/90 px-container-padding py-8 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{sectionLabel} • Network Threat Intelligence</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {activeSection === 'dashboard' && 'Type your event and let the dashboard react.'}
                {activeSection === 'incidents' && 'Review and filter live incident data.'}
                {activeSection === 'map' && 'Inspect the network topology and suspicious flows.'}
                {activeSection === 'analysis' && 'Run AI analysis on your network event.'}
                {activeSection === 'settings' && 'Configure deployment and API settings.'}
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                {activeSection === 'dashboard' && 'Enter suspicious network activity, alert text, or attack details below. The search will update the incident feed and the analysis output.'}
                {activeSection === 'incidents' && 'Use the incident filter to focus on the threat categories that matter most to your team.'}
                {activeSection === 'map' && 'This page is for monitoring topology and detecting anomalous source/destination patterns.'}
                {activeSection === 'analysis' && 'Submit a query and receive a structured analysis with severity, confidence, and remediation actions.'}
                {activeSection === 'settings' && 'Verify that your local and deployment environment is ready for the AI backend.'}
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <div className="relative rounded-full border border-slate-700 bg-slate-950 px-4 py-3 shadow-xl shadow-slate-950/20">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleAnalyze()}
                  placeholder="Enter network event or alert text..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => handleAnalyze()}
                  disabled={analysisLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-zinc-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {analysisLoading ? 'Analyzing' : 'Search'}
                </button>
              </div>
              <p className="mt-3 text-sm text-zinc-500">Search updates the incident table and analysis panel. Press Enter or click Search.</p>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-container-padding py-10">{renderSectionContent()}</section>
      </main>
    </div>
  )
}

export default App
