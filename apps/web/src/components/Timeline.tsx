import { useState } from 'react';
import { 
  Milestone, 
  Calendar, 
  User, 
  FileDown, 
  ChevronRight, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  author: string;
  type: 'pr' | 'slack' | 'doc';
  description: string;
  excerpt: string;
}

export default function Timeline() {
  const events: TimelineEvent[] = [
    {
      id: 'step-1',
      title: 'Simple API Keys Implemented',
      date: 'Feb 15, 2026',
      author: 'Alice Chen',
      type: 'pr',
      description: 'First stage of authentication. Introduced simple header check (X-ContextOS-Key) to validate CLI calls.',
      excerpt: 'Adding SimpleApiKeyGuard to authenticate developer shell commands.'
    },
    {
      id: 'step-2',
      title: 'OAuth 2.1 Security Debate',
      date: 'Mar 1, 2026',
      author: 'Diana Ross',
      type: 'slack',
      description: 'Security review raised concerns that static API keys violate safety guidelines when shared with client-side applications.',
      excerpt: 'Diana: We cannot distribute raw API keys to external MCP applications. It violates client-side security policies. Charlie: Let\'s build OAuth token endpoints.'
    },
    {
      id: 'step-3',
      title: 'NitroStack Guarded OAuth Integrated',
      date: 'Apr 10, 2026',
      author: 'Charlie Davis',
      type: 'pr',
      description: 'Final migration path. Charlie wired custom auth servers with NitroStack @UseGuards to deliver short-lived JWT tokens.',
      excerpt: 'Feat: Implement OAuth2.1 flow via NitroStack Guards, generating short-lived JWT credentials.'
    }
  ];

  const [activeEvent, setActiveEvent] = useState<TimelineEvent>(events[0]);
  const [downloading, setDownloading] = useState(false);

  const downloadADR = () => {
    setDownloading(true);
    
    const adrContent = `# Architecture Decision Record: Authentication Evolution

**Status:** Approved
**Decided by:** Alice Chen, Bob Jenkins, Charlie Davis, Diana Ross
**Date:** 2026-07-25

## Context
ContextOS initially supported a static header key (\`X-ContextOS-Key\`) to authorize developer commands, which was committed in PR #12. 
When deploying client-facing MCP widgets to external environments, static API keys posed major credential distribution security risks. The team debated alternative mechanisms in Slack thread #202.

## Decision
We decided to migrate the authentication layer to an OAuth 2.1 authorization code flow with short-lived JWT credentials. We utilized NitroStack's native \`@UseGuards\` decorators and route interceptors, which was completed in PR #89.

## Consequences
- Decoupled client credential distribution.
- Native integration with NitroStack's route guards.
- Introduces additional JWT exchange and signature verification handlers.
`;

    const blob = new Blob([adrContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ADR-0042-authentication-evolution.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloading(false), 800);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Milestone className="w-5 h-5 text-accent-purple" />
            Context Evolution Timeline
          </h3>
          <p className="text-xs text-gray-400">
            Chronological milestone trace compiled from git commits, PRs, and team communications.
          </p>
        </div>
        
        <button
          onClick={downloadADR}
          disabled={downloading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-purple text-xs font-semibold text-white hover:bg-accent-purple/90 transition-colors shadow-glow-purple disabled:opacity-50"
        >
          <FileDown className="w-3.5 h-3.5" />
          {downloading ? 'Downloading...' : 'Generate ADR'}
        </button>
      </div>

      {/* Horizontal Line Timeline */}
      <div className="relative py-8 flex items-center justify-around">
        {/* Background Track Line */}
        <div className="absolute left-10 right-10 h-0.5 bg-border top-1/2 -translate-y-1/2" />
        
        {events.map((event, idx) => {
          const isActive = activeEvent.id === event.id;
          return (
            <button
              key={event.id}
              onClick={() => setActiveEvent(event)}
              className="relative z-10 flex flex-col items-center group focus:outline-none"
            >
              {/* Timeline dot */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-accent-purple border-accent-purple text-white scale-125 shadow-glow-purple' 
                  : 'bg-background border-border text-gray-500 hover:border-gray-400 hover:text-gray-300'
              }`}>
                <span className="text-xs font-bold font-mono">{idx + 1}</span>
              </div>
              
              {/* Event title mini text */}
              <span className={`text-[10px] font-mono mt-3 font-medium transition-colors ${
                isActive ? 'text-accent-purple' : 'text-gray-500 group-hover:text-gray-300'
              }`}>
                {event.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Event Details Display Card */}
      <div className="bg-background/40 border border-border/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
              activeEvent.type === 'pr' 
                ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                : 'bg-accent-rose/15 text-accent-rose border border-accent-rose/30'
            }`}>
              {activeEvent.type.toUpperCase()} MILESTONE
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <h4 className="text-sm font-semibold text-white">{activeEvent.title}</h4>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {activeEvent.date}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {activeEvent.author}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          {activeEvent.description}
        </p>

        <div className="space-y-1.5">
          <span className="text-[9px] uppercase tracking-wider font-mono text-gray-500 font-semibold block">Evidence Quote</span>
          <pre className="text-[11px] font-mono leading-relaxed bg-surface border border-border/60 p-3 rounded-lg text-gray-300 whitespace-pre-wrap">
            {activeEvent.excerpt}
          </pre>
        </div>
        
        <div className="pt-2 flex justify-between items-center text-[10px] font-mono text-gray-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
            Observed by ContextNode sync daemon
          </span>
          <a href="#" className="text-accent-purple hover:underline flex items-center gap-0.5">
            Trace PR file diffs <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
