import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import KnowledgeGraph from './components/KnowledgeGraph';
import ExecutionTrace from './components/ExecutionTrace';
import Timeline from './components/Timeline';
import EntityGrid from './components/EntityGrid';
import { demoScenarios, enterpriseEntities, memoryEntries } from './utils/dataStore';
import type { DemoScenario } from './utils/dataStore';
import { 
  GitFork, 
  Layers, 
  Cpu
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(demoScenarios.redis);

  // Sync child scenario changes to root state
  const handleScenarioChange = (newScenario: DemoScenario) => {
    setActiveScenario(newScenario);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 w-full">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Active Pipeline Core</h4>
                  <p className="text-xs font-semibold text-white">NitroStack Core App</p>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                  <GitFork className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Indexed Subgraphs</h4>
                  <p className="text-xs font-semibold text-white">3 Scopes Connected</p>
                </div>
              </div>
              <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-mono text-gray-500 tracking-wider">Local Vector Cosine Math</h4>
                  <p className="text-xs font-semibold text-white">SQLite Memory Mode</p>
                </div>
              </div>
            </div>

            {/* Chat Panel visualizer */}
            <ChatPanel 
              activeScenario={activeScenario} 
              onScenarioChange={handleScenarioChange} 
            />

            {/* Dynamic Secondary Panel depending on question theme */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Dynamic slot 1: Graph or timeline visualizer */}
              {activeScenario.question.toLowerCase().includes('auth') || 
               activeScenario.question.toLowerCase().includes('evolution') ? (
                <Timeline />
              ) : (
                <KnowledgeGraph graphData={activeScenario.graph} />
              )}

              {/* Dynamic slot 2: Live execution trace console */}
              <ExecutionTrace task={activeScenario.task} />
            </div>
          </div>
        );

      case 'graph':
        return (
          <div className="space-y-6 w-full">
            <div className="glass-panel p-4 rounded-xl flex justify-between items-center bg-surface-hover/30 border-border/80">
              <div>
                <h2 className="text-base font-bold text-white">Fullscreen Graph Explorer</h2>
                <p className="text-xs text-gray-400">Query and isolate repository service clusters and files.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveScenario(demoScenarios.redis)}
                  className="px-2.5 py-1 rounded bg-background hover:bg-surface-hover border border-border text-[10px] font-mono text-gray-300 transition-colors"
                >
                  Load Redis Scope
                </button>
                <button 
                  onClick={() => setActiveScenario(demoScenarios.checkout)}
                  className="px-2.5 py-1 rounded bg-background hover:bg-surface-hover border border-border text-[10px] font-mono text-gray-300 transition-colors"
                >
                  Load Checkout Scope
                </button>
              </div>
            </div>
            <KnowledgeGraph graphData={activeScenario.graph} />
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6 w-full">
            <div className="glass-panel p-4 rounded-xl flex justify-between items-center bg-surface-hover/30 border-border/80">
              <div>
                <h2 className="text-base font-bold text-white">Execution Trace Inspector</h2>
                <p className="text-xs text-gray-400">Audit execution outputs and elapsed timeline metrics.</p>
              </div>
              <span className="text-[10px] bg-accent-blue/15 text-accent-blue px-2 py-0.5 rounded-full font-mono border border-accent-blue/30">
                ACTIVE TRACE: {activeScenario.task.id}
              </span>
            </div>
            <ExecutionTrace task={activeScenario.task} />
          </div>
        );

      case 'entities':
        return <EntityGrid entities={enterpriseEntities} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex text-gray-200">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        entityCount={enterpriseEntities.filter(e => e.type === 'TeamMember').length}
        memoryCount={memoryEntries.length}
      />

      {/* Main workspace frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar header */}
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-400 bg-background px-3 py-1 rounded-lg border border-border">
              c:\Users\Balamurugan\Documents\ContextOS\ContextOS\apps\web
            </span>
            <span className="text-[10px] text-accent-emerald flex items-center gap-1 bg-accent-emerald/10 px-2 py-0.5 rounded border border-accent-emerald/30 font-semibold font-mono">
              🚀 ACTIVE ENVIRONMENT
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick action buttons */}
            <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5 bg-background p-1.5 rounded-lg border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
              <span>Dev Server: localhost:5173</span>
            </div>
          </div>
        </header>

        {/* Content canvas container */}
        <main className="flex-1 p-8 overflow-y-auto bg-background/95">
          {renderTabContent()}
        </main>
      </div>

    </div>
  );
}
