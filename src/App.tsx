function App() {
  return (
    <div className="font-body-md text-on-surface bg-surface min-h-screen overflow-hidden">
      <aside className="w-[260px] h-screen fixed left-0 top-0 bg-slate-900 border-r border-subtle flex flex-col py-gutter px-4 z-50">
        <div className="mb-10 px-2">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">Aegis Hunter</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Autonomous Ops</p>
        </div>
        <nav className="flex-grow space-y-2">
          <a className="flex items-center gap-3 py-3 px-4 text-on-surface bg-white/5 border-l-2 border-zinc-400 font-label-caps text-label-caps duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors font-label-caps text-label-caps duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">security</span>
            Incidents
          </a>
          <a className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors font-label-caps text-label-caps duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">public</span>
            Map
          </a>
          <a className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors font-label-caps text-label-caps duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">psychology</span>
            Analysis
          </a>
          <a className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors font-label-caps text-label-caps duration-200 ease-in-out" href="#">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </nav>
        <div className="mt-auto space-y-4 px-2">
          <button className="w-full bg-zinc-100 text-slate-950 font-label-caps text-label-caps py-3 rounded-lg hover:bg-white transition-all uppercase tracking-widest">
            Investigate
          </button>
          <div className="pt-6 border-t border-subtle space-y-2">
            <a className="flex items-center gap-3 text-on-surface-variant font-label-caps text-label-caps hover:text-on-surface" href="#">
              <span className="material-symbols-outlined">help</span>
              Support
            </a>
            <a className="flex items-center gap-3 text-on-surface-variant font-label-caps text-label-caps hover:text-on-surface" href="#">
              <span className="material-symbols-outlined">terminal</span>
              Logs
            </a>
          </div>
        </div>
      </aside>

      <header className="flex justify-between items-center w-full pl-[260px] pr-container-padding h-16 fixed top-0 z-40 bg-surface border-b border-subtle">
        <div className="flex items-center gap-8">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input className="bg-slate-900 border-none rounded-lg pl-10 pr-4 py-1.5 font-label-caps text-label-caps focus:ring-1 focus:ring-zinc-400 w-64 transition-all" placeholder="SEARCH NETWORK..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-subtle pr-6">
            <button className="text-on-surface-variant hover:text-zinc-400 transition-all scale-95 active:scale-90">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-zinc-400 transition-all scale-95 active:scale-90">
              <span className="material-symbols-outlined">shield_with_heart</span>
            </button>
          </div>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right">
              <p className="font-label-caps text-label-caps text-on-surface leading-none">CISO ADMIN</p>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">Chief Officer</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-subtle flex items-center justify-center group-hover:border-zinc-400 transition-all">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            </div>
          </div>
        </div>
      </header>

      <main className="ml-[260px] pt-24 px-container-padding h-screen overflow-y-auto custom-scrollbar">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-white mb-2">Sentinel Monolith</h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-threat-emerald font-label-caps text-label-caps">
                <span className="w-2 h-2 rounded-full bg-threat-emerald animate-pulse" />
                System Online
              </span>
              <span className="text-on-surface-variant font-label-caps text-label-caps border-l border-subtle pl-3 uppercase tracking-widest">
                Last Scan: 2m ago
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-subtle px-4 py-2 font-label-caps text-label-caps hover:border-zinc-400 transition-all uppercase">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
            <button className="bg-zinc-100 text-slate-950 px-4 py-2 font-label-caps text-label-caps hover:bg-white transition-all uppercase">
              Refresh Data
            </button>
          </div>
        </div>

        <div className="bento-grid pb-12">
          <div className="col-span-12 lg:col-span-4 glass-card p-8 relative overflow-hidden flex flex-col justify-between h-[400px]">
            <div className="relative z-10">
              <p className="font-label-caps text-label-caps text-zinc-400 uppercase mb-2 tracking-widest">Global Risk Index</p>
              <h3 className="font-headline-lg text-headline-lg">Minimal Threat</h3>
            </div>
            <div className="relative flex items-center justify-center h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[12px] border-slate-800" />
                <svg className="absolute w-40 h-40 -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" fill="transparent" r="74" stroke="#0EA5E9" strokeDasharray="465" strokeDashoffset="380" strokeLinecap="round" strokeWidth="12" />
                </svg>
                <div className="absolute text-center">
                  <span className="font-headline-xl text-[64px] font-black">18</span>
                  <p className="font-label-caps text-[10px] text-zinc-400">/ 100</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 pt-4 border-t border-subtle">
              <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px]">
                <span>NOMINAL: 0-25</span>
                <span className="text-threat-emerald">-12% FROM YESTERDAY</span>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-critical-sapphire/10 blur-[80px] rounded-full" />
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-lg text-headline-lg tracking-tight uppercase">Active Threats</h4>
              <span className="text-on-surface-variant font-code-sm text-code-sm">Filtered by: SEVERITY_ALL</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-6 border-l-4 border-error hover:border-zinc-400 transition-all cursor-pointer">
                <p className="font-label-caps text-label-caps text-zinc-400 mb-4">CRITICAL</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg">04</span>
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-orange-500 hover:border-zinc-400 transition-all cursor-pointer">
                <p className="font-label-caps text-label-caps text-zinc-400 mb-4">HIGH</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg">12</span>
                  <span className="material-symbols-outlined text-orange-500">error_outline</span>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-zinc-400 hover:border-zinc-300 transition-all cursor-pointer">
                <p className="font-label-caps text-label-caps text-zinc-400 mb-4">MEDIUM</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg">34</span>
                  <span className="material-symbols-outlined text-zinc-400">info</span>
                </div>
              </div>
              <div className="glass-card p-6 border-l-4 border-slate-700 hover:border-zinc-400 transition-all cursor-pointer">
                <p className="font-label-caps text-label-caps text-zinc-400 mb-4">LOW</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline-lg text-headline-lg">128</span>
                  <span className="material-symbols-outlined text-slate-500">verified_user</span>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 h-[230px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <p className="font-label-caps text-label-caps text-zinc-400">Threat Activity (24h)</p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-critical-sapphire" />
                    <span className="font-label-caps text-[10px]">INBOUND</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    <span className="font-label-caps text-[10px]">BLOCKED</span>
                  </div>
                </div>
              </div>
              <div className="flex-grow relative flex items-end gap-1">
                {['h-32', 'h-24', 'h-40', 'h-16', 'h-28', 'h-36', 'h-20', 'h-32'].map((height, index) => (
                  <div key={index} className={`w-full bg-slate-800/30 ${height} relative rounded-t-sm`}>
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-critical-sapphire/20 to-critical-sapphire ${index % 3 === 0 ? 'h-2/3' : index % 2 === 0 ? 'h-3/4' : 'h-1/2'}`} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-label-caps text-zinc-500">
                <span>00:00</span>
                <span>04:00</span>
                <span>08:00</span>
                <span>12:00</span>
                <span>16:00</span>
                <span>20:00</span>
                <span>23:59</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-subtle flex justify-between items-center bg-white/5">
              <h5 className="font-headline-lg text-[20px] tracking-tight">Recent Incidents</h5>
              <button className="text-zinc-400 hover:text-white transition-all font-label-caps text-label-caps uppercase flex items-center gap-1">
                View All
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="px-6 py-3 font-label-caps text-label-caps text-zinc-500 uppercase tracking-widest">TIMESTAMP</th>
                    <th className="px-6 py-3 font-label-caps text-label-caps text-zinc-500 uppercase tracking-widest">THREAT TYPE</th>
                    <th className="px-6 py-3 font-label-caps text-label-caps text-zinc-500 uppercase tracking-widest">SOURCE IP</th>
                    <th className="px-6 py-3 font-label-caps text-label-caps text-zinc-500 uppercase tracking-widest">SEVERITY</th>
                    <th className="px-6 py-3 font-label-caps text-label-caps text-zinc-500 uppercase tracking-widest">STATUS</th>
                    <th className="px-6 py-3 font-label-caps text-label-caps text-zinc-500 uppercase tracking-widest text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle">
                  {[
                    {
                      timestamp: '2023.10.27 | 14:23:45',
                      title: 'Encrypted Payload',
                      subtitle: 'Heuristic Match #982',
                      source: '192.168.0.124',
                      severity: 'CRITICAL',
                      status: 'ACTIVE',
                      badge: 'bg-error/10 text-error border-error/20',
                      icon: 'bug_report',
                      iconBg: 'bg-error/10 text-error',
                      action: 'Isolate Node',
                    },
                    {
                      timestamp: '2023.10.27 | 14:18:12',
                      title: 'Auth Brute Force',
                      subtitle: 'L3 Endpoint Breach Attempt',
                      source: '45.23.120.9',
                      severity: 'HIGH',
                      status: 'BLOCKED',
                      badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
                      icon: 'login',
                      iconBg: 'bg-critical-sapphire/10 text-critical-sapphire',
                      action: 'Logs',
                    },
                    {
                      timestamp: '2023.10.27 | 13:55:01',
                      title: 'Service Outage',
                      subtitle: 'Node AWS-04-A Unreachable',
                      source: 'N/A (Cloud)',
                      severity: 'MEDIUM',
                      status: 'INVESTIGATING',
                      badge: 'bg-zinc-400/10 text-zinc-400 border-zinc-400/20',
                      icon: 'cloud_off',
                      iconBg: 'bg-slate-800 text-zinc-400',
                      action: 'Reboot',
                    },
                  ].map((incident) => (
                    <tr key={incident.timestamp} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4 font-code-sm text-code-sm text-on-surface-variant">{incident.timestamp}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded ${incident.iconBg} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[18px]">{incident.icon}</span>
                          </div>
                          <div>
                            <p className="font-label-caps text-label-caps font-bold">{incident.title}</p>
                            <p className="text-[10px] text-zinc-500">{incident.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-code-sm text-code-sm">{incident.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded ${incident.badge} font-label-caps text-[9px]`}>{incident.severity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${incident.status === 'ACTIVE' ? 'bg-error' : incident.status === 'BLOCKED' ? 'bg-threat-emerald' : 'bg-critical-sapphire'} animate-pulse`} />
                          <span className="font-label-caps text-label-caps text-on-surface-variant">{incident.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-critical-sapphire font-label-caps text-label-caps uppercase">{incident.action}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-12 glass-card p-6 border-t-2 border-t-critical-sapphire bg-gradient-to-br from-critical-sapphire/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-critical-sapphire/20 flex items-center justify-center text-critical-sapphire">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h6 className="font-label-caps text-label-caps text-white font-bold tracking-widest uppercase">Autonomous Intelligence Insight</h6>
                  <span className="text-[10px] font-code-sm text-critical-sapphire">CONFIDENCE: 94.2%</span>
                </div>
                <p className="font-body-md text-on-surface-variant max-w-4xl">
                  Sentinel has detected an unusual sequence of lateral movement attempts originating from the <span className="text-white">Marketing-VLAN</span>. Pattern matching suggests a slow-drip data exfiltration attempt mimicking normal NTP traffic. Recommend immediate segmentation of subnet 10.4.x.x and rotation of all administrative tokens.
                </p>
                <div className="mt-4 flex gap-3">
                  <button className="bg-critical-sapphire text-white px-4 py-1.5 font-label-caps text-[10px] hover:bg-opacity-80 transition-all uppercase rounded-sm">Execute Countermeasure</button>
                  <button className="border border-subtle text-on-surface-variant px-4 py-1.5 font-label-caps text-[10px] hover:bg-white/5 transition-all uppercase rounded-sm">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[60] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
    </div>
  )
}

export default App
