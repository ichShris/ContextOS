import type { EnterpriseEntity } from '@contextos/shared-types';
import { 
  Users, 
  Github, 
  Slack, 
  Database,
  ExternalLink,
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface EntityGridProps {
  entities: EnterpriseEntity[];
}

export default function EntityGrid({ entities }: EntityGridProps) {
  const teamMembers = entities.filter(e => e.type === 'TeamMember');
  const integrations = entities.filter(e => e.type !== 'TeamMember');

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'Organization':
      case 'Repository':
        return <Github className="w-5 h-5 text-gray-300" />;
      case 'SlackWorkspace':
      case 'Channel':
        return <Slack className="w-5 h-5 text-accent-rose" />;
      default:
        return <Database className="w-5 h-5 text-accent-indigo" />;
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Team Members Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Users className="w-5 h-5 text-accent-indigo" />
            Engineering Team Members
          </h3>
          <p className="text-xs text-gray-400">
            Assigned developers and workspace administrators executing parallel tracks on synchronization clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between h-56">
              <div className="space-y-3">
                {/* User avatar and status */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img 
                      src={member.metadata?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.name}`}
                      alt={member.name}
                      className="w-12 h-12 rounded-xl bg-surface border border-border/80 object-cover"
                      onError={(e) => {
                        // Fallback avatar if url fails
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${member.name}`;
                      }}
                    />
                    {member.metadata?.isActive && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-emerald border-2 border-surface rounded-full" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5 bg-background px-2 py-0.5 rounded border border-border">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-indigo" />
                    Dev {member.id.replace('person:', '').toUpperCase()}
                  </span>
                </div>

                {/* User Info */}
                <div>
                  <h4 className="text-sm font-semibold text-white">{member.name}</h4>
                  <p className="text-[11px] text-gray-400 leading-normal mt-1 min-h-[32px]">
                    {member.metadata?.description || 'ContextOS workspace member.'}
                  </p>
                </div>
              </div>

              {/* Contact Links */}
              <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs">
                <a 
                  href={`mailto:${member.metadata?.email}`}
                  className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono text-[10px]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
                <a 
                  href={member.metadata?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-indigo hover:text-white flex items-center gap-1 transition-colors font-mono text-[10px]"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Integrations Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
            <Database className="w-5 h-5 text-accent-blue" />
            Connected Sources & Scope Indexes
          </h3>
          <p className="text-xs text-gray-400">
            Registered channels, workspaces, and code repositories monitored by the agentic context layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((source) => (
            <div key={source.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between h-44">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-surface border border-border">
                      {getIntegrationIcon(source.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{source.name}</h4>
                      <span className="text-[9px] text-gray-500 font-mono">{source.type}</span>
                    </div>
                  </div>
                  {source.metadata?.isActive && (
                    <span className="text-[9px] bg-accent-emerald/10 text-accent-emerald px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-mono">
                      <CheckCircle2 className="w-3 h-3" /> ACTIVE
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 leading-normal">
                  {source.metadata?.description || 'Connected context node source provider.'}
                </p>
              </div>

              {/* Source Link */}
              {source.metadata?.url && (
                <div className="border-t border-border/50 pt-2.5 flex justify-end">
                  <a 
                    href={source.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-accent-blue hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Manage Index <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
