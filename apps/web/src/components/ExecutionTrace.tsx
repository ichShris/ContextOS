import { useState } from 'react';
import type { AgentTask } from '@contextos/shared-types';
import { 
  Activity, 
  Terminal, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Play
} from 'lucide-react';

interface ExecutionTraceProps {
  task: AgentTask;
}

export default function ExecutionTrace({ task }: ExecutionTraceProps) {
  const [openToolCallId, setOpenToolCallId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20';
      case 'failed': return 'text-accent-rose bg-accent-rose/10 border-accent-rose/20';
      case 'running': return 'text-accent-blue bg-accent-blue/10 border-accent-blue/20';
      default: return 'text-gray-400 bg-background border-border';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-accent-emerald" />;
      case 'failed': return <XCircle className="w-4 h-4 text-accent-rose" />;
      case 'running': return <Activity className="w-4 h-4 text-accent-blue animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const steps = [
    'received',
    'planning',
    'retrieving',
    'reasoning',
    'reflecting',
    'completed'
  ];

  const currentStepIndex = steps.indexOf(task.status === 'failed' ? 'completed' : task.status);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-[520px] w-full relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-3">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Terminal className="w-5 h-5 text-accent-emerald" />
            Agent Task & Execution Trace
          </h3>
          <p className="text-xs text-gray-400">
            Pipeline logging showing tools called and checks performed by the AI planner agent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 font-mono">Status:</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
      </div>

      {/* Progress Pipeline Stepper */}
      <div className="mb-6 bg-background/50 border border-border/60 p-4 rounded-xl">
        <div className="flex items-center justify-between w-full relative">
          {/* Connector bar behind steps */}
          <div className="absolute left-4 right-4 h-0.5 bg-border top-1/2 -translate-y-1/2 -z-0" />
          <div 
            className="absolute left-4 h-0.5 bg-accent-emerald top-1/2 -translate-y-1/2 -z-0 transition-all duration-500" 
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 96}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = step === task.status;
            
            return (
              <div key={step} className="flex flex-col items-center z-10 relative">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-background border-accent-blue text-accent-blue scale-110 shadow-glow-indigo'
                    : isCompleted 
                      ? 'bg-accent-emerald border-accent-emerald text-white' 
                      : 'bg-background border-border text-gray-600'
                }`}>
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold font-mono">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-mono mt-2 font-medium capitalize ${
                  isCurrent ? 'text-accent-blue' : isCompleted ? 'text-accent-emerald' : 'text-gray-600'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Logs and Planned Tool Calls Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        
        {/* Left Column: Trace Logs */}
        <div className="bg-background/40 border border-border/80 rounded-xl p-4 flex flex-col min-h-0">
          <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-accent-emerald animate-pulse" />
            Execution Chronology
          </h4>
          
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {task.executionTrace.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {getStepIcon(idx === task.executionTrace.length - 1 ? 'running' : 'completed')}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono text-gray-300 uppercase">
                      {log.step.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
            {task.status === 'failed' && (
              <div className="flex items-start gap-2.5 text-accent-rose">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold font-mono uppercase">PIPELINE FAILURE</span>
                  <p className="text-[11px] leading-normal text-accent-rose/90">
                    Execution aborted due to missing local cache records.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Planned Tool Calls & Details */}
        <div className="bg-background/40 border border-border/80 rounded-xl p-4 flex flex-col min-h-0">
          <h4 className="text-xs font-semibold text-white mb-3 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
            Planned & Executed Tool Calls
          </h4>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {task.plan.length > 0 ? (
              task.plan.map((call) => {
                const isOpen = openToolCallId === call.id;
                return (
                  <div 
                    key={call.id} 
                    className="border border-border/60 rounded-lg bg-surface/30 overflow-hidden"
                  >
                    {/* Header trigger button */}
                    <button
                      onClick={() => setOpenToolCallId(isOpen ? null : call.id)}
                      className="w-full flex items-center justify-between p-2.5 text-left hover:bg-surface-hover/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Play className="w-3 h-3 text-accent-emerald rotate-90" />
                        <div>
                          <span className="text-xs font-mono text-white font-semibold block">
                            {call.toolName}
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono">
                            ID: {call.id}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize ${
                          call.status === 'completed' 
                            ? 'bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald' 
                            : 'bg-accent-rose/10 border-accent-rose/20 text-accent-rose'
                        }`}>
                          {call.status}
                        </span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
                      </div>
                    </button>

                    {/* Collapsible Details */}
                    {isOpen && (
                      <div className="border-t border-border/50 bg-background/60 p-3 space-y-3">
                        {/* Arguments */}
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-semibold font-mono text-gray-500">Arguments</span>
                          <pre className="text-[10px] font-mono leading-relaxed bg-surface border border-border/50 p-2 rounded text-gray-300 overflow-x-auto">
                            {JSON.stringify(call.arguments, null, 2)}
                          </pre>
                        </div>

                        {/* Result / Error */}
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase tracking-wider font-semibold font-mono text-gray-500">
                            {call.status === 'completed' ? 'Result' : 'Error'}
                          </span>
                          <pre className={`text-[10px] font-mono leading-relaxed p-2 rounded border overflow-x-auto ${
                            call.status === 'completed'
                              ? 'bg-surface border-border/50 text-gray-300'
                              : 'bg-accent-rose/5 border-accent-rose/20 text-accent-rose/90'
                          }`}>
                            {call.status === 'completed'
                              ? JSON.stringify(call.result, null, 2)
                              : call.error}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Terminal className="w-8 h-8 text-gray-700 mx-auto mb-2 stroke-1" />
                <p className="text-xs">No tool calls made in cached fast-path mode.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
