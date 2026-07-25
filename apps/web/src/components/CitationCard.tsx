import { 
  GitPullRequest, 
  GitCommit, 
  MessageSquare, 
  FileCode, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';
import type { EvidenceItem } from '@contextos/shared-types';

interface CitationCardProps {
  citation: EvidenceItem;
}

export default function CitationCard({ citation }: CitationCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'pr':
        return <GitPullRequest className="w-4 h-4 text-accent-blue" />;
      case 'commit':
        return <GitCommit className="w-4 h-4 text-accent-purple" />;
      case 'slack_thread':
        return <MessageSquare className="w-4 h-4 text-accent-rose" />;
      case 'file':
        return <FileCode className="w-4 h-4 text-accent-indigo" />;
      default:
        return <BookOpen className="w-4 h-4 text-accent-emerald" />;
    }
  };

  const getSourceLabel = (type: string, id: string) => {
    switch (type) {
      case 'pr':
        return `GitHub PR #${id.replace('gh-pr-', '')}`;
      case 'commit':
        return `Commit ${id.slice(0, 8)}`;
      case 'slack_thread':
        return `Slack Thread #${id.replace('slack-msg-', '')}`;
      case 'file':
        return `File: ${id.replace('gh-file-', '')}`;
      default:
        return `Document: ${id}`;
    }
  };

  const formattedDate = new Date(citation.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-card p-4 rounded-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-surface border border-border">
            {getIcon(citation.type)}
          </div>
          <div>
            <h5 className="text-xs font-semibold text-white flex items-center gap-1">
              {getSourceLabel(citation.type, citation.sourceId)}
            </h5>
            <span className="text-[10px] text-gray-500 font-mono">{formattedDate}</span>
          </div>
        </div>

        {/* Relevance Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 font-mono">Relevance</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            citation.relevanceScore >= 0.9 
              ? 'bg-accent-emerald/10 border-accent-emerald/30 text-accent-emerald' 
              : 'bg-accent-indigo/10 border-accent-indigo/30 text-accent-indigo'
          }`}>
            {(citation.relevanceScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Code excerpt block */}
      <div className="relative">
        <pre className="text-[11px] font-mono leading-relaxed bg-background/80 p-3 rounded-lg border border-border/50 text-gray-300 overflow-x-auto max-h-32 whitespace-pre-wrap">
          {citation.excerpt}
        </pre>
      </div>

      {/* Footer Link */}
      <div className="flex justify-end">
        <a 
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-accent-indigo hover:text-white flex items-center gap-1 transition-colors duration-150"
        >
          View Source <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
