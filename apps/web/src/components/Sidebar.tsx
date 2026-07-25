import { 
  LayoutDashboard, 
  Brain, 
  GitFork, 
  Activity, 
  Users, 
  Cpu,
  RefreshCw
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  entityCount: number;
  memoryCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, entityCount, memoryCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Memory Workspace', icon: LayoutDashboard },
    { id: 'graph', name: 'Context Graph', icon: GitFork },
    { id: 'tasks', name: 'Execution Traces', icon: Activity },
    { id: 'entities', name: 'System Entities', icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-screen sticky top-0">
      {/* Brand Section */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-purple flex items-center justify-center shadow-glow-indigo">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            ContextOS
          </h1>
          <span className="text-[10px] text-gray-500 font-mono">v1.0.0-HACKATHON</span>
        </div>
      </div>

      {/* Connection Indicator */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald"></span>
          </span>
          <span className="text-xs font-mono text-gray-400">MCP Server Online</span>
        </div>
        <div className="text-[10px] bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
          <Cpu className="w-3 h-3" /> DEMO CACHE
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-accent-indigo/10 border border-accent-indigo/30 text-white font-medium shadow-glow-indigo'
                  : 'text-gray-400 hover:text-white hover:bg-surface-hover border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-accent-indigo animate-pulse' : 'text-gray-400'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Quick Statistics Summary */}
      <div className="p-4 m-4 rounded-xl bg-background border border-border/80">
        <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">Workspace Stats</h4>
        <div className="space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Memory Entries</span>
            <span className="text-white font-semibold">{memoryCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Context Nodes</span>
            <span className="text-white font-semibold">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Team Members</span>
            <span className="text-white font-semibold">{entityCount}</span>
          </div>
        </div>
        <button className="mt-4 w-full flex items-center justify-center gap-2 py-1.5 rounded bg-surface-hover hover:bg-surface border border-border text-[10px] text-gray-400 hover:text-white transition-colors duration-150">
          <RefreshCw className="w-3 h-3" /> Re-sync Database
        </button>
      </div>
    </aside>
  );
}
