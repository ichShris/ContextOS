import rawEnterpriseData from '../../../../packages/shared-types/src/enterprise-data.json';
import type { MemoryEntry, ContextGraph, AgentTask, EnterpriseEntity, ContextNode, ContextEdge } from '@contextos/shared-types';

export interface DemoScenario {
  question: string;
  answer: string;
  citations: any[];
  graph: ContextGraph;
  task: AgentTask;
}

// Map the raw data to typed objects
export const enterpriseEntities: EnterpriseEntity[] = rawEnterpriseData.enterpriseEntities as any[];
export const memoryEntries: MemoryEntry[] = rawEnterpriseData.memoryEntries as any[];

// Standard execution trace helper
function createTrace(step: string, desc: string, timeSecsOffset: number) {
  const baseTime = new Date('2026-07-25T18:30:00Z').getTime();
  return {
    step,
    timestamp: new Date(baseTime + timeSecsOffset * 1000).toISOString(),
    description: desc
  };
}

// Preset Scenario 1: Why Redis?
const redisScenario: DemoScenario = {
  question: "Why are we using Redis?",
  answer: memoryEntries.find(m => m.id === 'mem:why-redis')?.answer || "",
  citations: memoryEntries.find(m => m.id === 'mem:why-redis')?.citations || [],
  graph: {
    nodes: [
      { id: "repo:contextos-core", type: "File", name: "contextos-core" },
      { id: "person:bob", type: "Person", name: "Bob Jenkins" },
      { id: "person:alice", type: "Person", name: "Alice Chen" },
      { id: "pr:48", type: "PullRequest", name: "PR #48: Replace local session store with Redis" },
      { id: "slack-msg:101", type: "SlackThread", name: "Slack #engineering: session auth misses" },
      { id: "decision:redis-cache", type: "Decision", name: "Adopt RedisSessionStore" }
    ],
    edges: [
      { id: "e1", fromId: "pr:48", toId: "person:bob", type: "AUTHORED_BY" },
      { id: "e2", fromId: "pr:48", toId: "slack-msg:101", type: "DISCUSSED_IN" },
      { id: "e3", fromId: "decision:redis-cache", toId: "slack-msg:101", type: "DISCUSSED_IN" },
      { id: "e4", fromId: "pr:48", toId: "decision:redis-cache", type: "IMPLEMENTS" },
      { id: "e5", fromId: "pr:48", toId: "repo:contextos-core", type: "MODIFIES" }
    ]
  },
  task: {
    id: "task:why-redis",
    question: "Why are we using Redis?",
    status: "completed",
    plan: [
      {
        id: "call:redis-pr",
        toolName: "search_pull_requests",
        arguments: { query: "Redis" },
        status: "completed",
        result: { prs: ["#48 Replace InMemorySessionStore with RedisSessionStore"] },
        timestamp: "2026-07-25T18:30:02Z"
      },
      {
        id: "call:redis-slack",
        toolName: "search_messages",
        arguments: { query: "Redis" },
        status: "completed",
        result: { messages: ["slack-msg-101: Bob: We need to scale the server. Storing session state in Node memory is causing multi-instance auth misses..."] },
        timestamp: "2026-07-25T18:30:03Z"
      }
    ],
    executionTrace: [
      createTrace("planner_initiate", "Planner initiated scope resolution for 'Why are we using Redis?'", 0),
      createTrace("scope_resolved", "Scope resolved to: ['Redis', 'session-cache']", 0.5),
      createTrace("retriever_pr", "Retriever called search_pull_requests: found PR #48 replacing local memory with RedisSessionStore.", 1.2),
      createTrace("retriever_slack", "Retriever called search_messages: found Slack thread #101 where Bob/Alice debated session auth failures.", 2.1),
      createTrace("context_build", "Context Builder assembled citation-addressable context bundle with 2 items.", 2.8),
      createTrace("reasoning", "Reasoning Agent generated answer explaining session fragmentation, scaling benefits, and Pub/Sub potential.", 3.5),
      createTrace("reflection", "Reflection Agent validated claims: 2/2 assertions fully grounded in PR #48 & Slack msg.", 4.1),
      createTrace("memory_persist", "Memory Manager persisted verified answer as mem:why-redis.", 4.5)
    ],
    createdAt: "2026-07-25T18:30:00Z",
    updatedAt: "2026-07-25T18:30:05Z"
  }
};

// Preset Scenario 2: CheckoutService Impact
const checkoutScenario: DemoScenario = {
  question: "What happens if I modify CheckoutService?",
  answer: memoryEntries.find(m => m.id === 'mem:checkout-service-dependencies')?.answer || "",
  citations: memoryEntries.find(m => m.id === 'mem:checkout-service-dependencies')?.citations || [],
  graph: {
    nodes: [
      { id: "service:CheckoutService", type: "Service", name: "CheckoutService" },
      { id: "file:src/services/checkout.ts", type: "File", name: "checkout.ts" },
      { id: "service:PaymentGateway", type: "Service", name: "PaymentGateway" },
      { id: "service:OrderController", type: "Service", name: "OrderController" },
      { id: "pr:112", type: "PullRequest", name: "PR #112: Refactor checkout events" },
      { id: "person:charlie", type: "Person", name: "Charlie Davis" },
      { id: "person:alice", type: "Person", name: "Alice Chen" }
    ],
    edges: [
      { id: "e10", fromId: "service:PaymentGateway", toId: "service:CheckoutService", type: "DEPENDS_ON" },
      { id: "e11", fromId: "service:OrderController", toId: "service:CheckoutService", type: "DEPENDS_ON" },
      { id: "e12", fromId: "pr:112", toId: "file:src/services/checkout.ts", type: "MODIFIES" },
      { id: "e13", fromId: "file:src/services/checkout.ts", toId: "service:CheckoutService", type: "IMPLEMENTS" },
      { id: "e14", fromId: "pr:112", toId: "person:charlie", type: "AUTHORED_BY" }
    ]
  },
  task: {
    id: "task:modify-checkout",
    question: "What happens if I modify CheckoutService?",
    status: "completed",
    plan: [
      {
        id: "call:checkout-grep",
        toolName: "grep_codebase",
        arguments: { query: "CheckoutService" },
        status: "completed",
        result: { matches: ["src/services/payment.ts", "src/controllers/order.ts"] },
        timestamp: "2026-07-25T18:31:02Z"
      },
      {
        id: "call:checkout-pr",
        toolName: "search_pull_requests",
        arguments: { filePath: "src/services/checkout.ts" },
        status: "completed",
        result: { prs: ["#112 Refactor checkout flow to emit order.created events"] },
        timestamp: "2026-07-25T18:31:03Z"
      }
    ],
    executionTrace: [
      createTrace("planner_initiate", "Planner initiated scope resolution for 'What happens if I modify CheckoutService?'", 0),
      createTrace("scope_resolved", "Scope resolved to: ['CheckoutService', 'src/services/checkout.ts']", 0.4),
      createTrace("retriever_grep", "Retriever called grep_codebase: identified CheckoutService imports in PaymentGateway and OrderController.", 1.3),
      createTrace("retriever_pr", "Retriever called search_pull_requests: found PR #112 introducing order.created event-driven pipeline.", 2.2),
      createTrace("context_build", "Context Builder compiled static import chain and mapped dependency graph.", 2.7),
      createTrace("reasoning", "Reasoning Agent completed blast radius estimation: High Risk (PaymentGateway and OrderController dependents, worker pipelines break without compilation failure).", 3.6),
      createTrace("reflection", "Reflection Agent validated grounding: 2/2 citations verified.", 4.2),
      createTrace("memory_persist", "Memory Manager persisted verified answer as mem:checkout-service-dependencies.", 4.6)
    ],
    createdAt: "2026-07-25T18:31:00Z",
    updatedAt: "2026-07-25T18:31:05Z"
  }
};

// Preset Scenario 3: Auth Evolution
const authScenario: DemoScenario = {
  question: "Show me how authentication evolved.",
  answer: memoryEntries.find(m => m.id === 'mem:auth-evolution')?.answer || "",
  citations: memoryEntries.find(m => m.id === 'mem:auth-evolution')?.citations || [],
  graph: {
    nodes: [
      { id: "service:AuthService", type: "Service", name: "AuthService" },
      { id: "pr:12", type: "PullRequest", name: "PR #12: SimpleApiKeyGuard" },
      { id: "slack-msg:202", type: "SlackThread", name: "Slack #engineering: OAuth 2.1 Debate" },
      { id: "pr:89", type: "PullRequest", name: "PR #89: OAuth Integration via NitroStack Guards" },
      { id: "person:alice", type: "Person", name: "Alice Chen" },
      { id: "person:charlie", type: "Person", name: "Charlie Davis" },
      { id: "person:diana", type: "Person", name: "Diana Ross" }
    ],
    edges: [
      { id: "e20", fromId: "pr:12", toId: "person:alice", type: "AUTHORED_BY" },
      { id: "e21", fromId: "pr:89", toId: "slack-msg:202", type: "DISCUSSED_IN" },
      { id: "e22", fromId: "pr:89", toId: "person:charlie", type: "AUTHORED_BY" },
      { id: "e23", fromId: "pr:89", toId: "pr:12", type: "DEPENDS_ON" },
      { id: "e24", fromId: "slack-msg:202", toId: "person:diana", type: "AUTHORED_BY" }
    ]
  },
  task: {
    id: "task:auth-evolution",
    question: "Show me how authentication evolved.",
    status: "completed",
    plan: [
      {
        id: "call:auth-pr",
        toolName: "search_pull_requests",
        arguments: { query: "auth" },
        status: "completed",
        result: { prs: ["#12 Adding SimpleApiKeyGuard", "#89 Feat: Implement OAuth2.1 flow via NitroStack Guards"] },
        timestamp: "2026-07-25T18:32:02Z"
      },
      {
        id: "call:auth-slack",
        toolName: "search_messages",
        arguments: { query: "auth" },
        status: "completed",
        result: { messages: ["slack-msg-202: Diana: We can't distribute raw API keys to external MCP apps..."] },
        timestamp: "2026-07-25T18:32:03Z"
      }
    ],
    executionTrace: [
      createTrace("planner_initiate", "Planner initiated scope resolution for 'How did authentication evolve?'", 0),
      createTrace("scope_resolved", "Scope resolved to: ['auth', 'authentication']", 0.5),
      createTrace("retriever_pr1", "Retriever called search_pull_requests: found PR #12 introducing static API key guard.", 1.2),
      createTrace("retriever_slack", "Retriever called search_messages: found Slack debate #202 (Diana/Charlie debating client OAuth).", 2.2),
      createTrace("retriever_pr2", "Retriever called search_pull_requests: found PR #89 integrating NitroStack OAuth guards.", 3.1),
      createTrace("context_build", "Context Builder ordered evidence chronologically to reconstruct authentication history.", 3.8),
      createTrace("reasoning", "Reasoning Agent drafted the 3-stage evolution summary (Static Keys -> OAuth Debate -> NitroStack OAuth integration).", 4.5),
      createTrace("reflection", "Reflection Agent validated grounding: 3/3 claims matched exact sources.", 5.0)
    ],
    createdAt: "2026-07-25T18:32:00Z",
    updatedAt: "2026-07-25T18:32:06Z"
  }
};

export const demoScenarios: Record<string, DemoScenario> = {
  "redis": redisScenario,
  "checkout": checkoutScenario,
  "auth": authScenario
};

// Fallback dynamic generator for typed queries
export function searchKnowledgeBase(query: string): DemoScenario {
  const normQuery = query.toLowerCase();
  
  // Try exact preset matching first
  if (normQuery.includes('redis')) return redisScenario;
  if (normQuery.includes('checkout')) return checkoutScenario;
  if (normQuery.includes('auth')) return authScenario;

  // Try matching against memory entry tags or question text
  const match = memoryEntries.find(entry => 
    entry.question.toLowerCase().includes(normQuery) || 
    (entry.tags && entry.tags.some(t => normQuery.includes(t.toLowerCase())))
  );

  if (match) {
    // Generate a graph dynamically based on the entry's citations
    const nodes: ContextNode[] = [
      { id: "search:query", type: "Decision", name: `Topic: ${match.question}` }
    ];
    const edges: ContextEdge[] = [];

    match.citations.forEach((cit, index) => {
      const typeLabel = cit.type === 'pr' ? 'PullRequest' : cit.type === 'slack_thread' ? 'SlackThread' : 'File';
      nodes.push({
        id: cit.sourceId,
        type: typeLabel as any,
        name: `${cit.type.toUpperCase()}: ${cit.sourceId}`
      });
      edges.push({
        id: `dyn-edge-${index}`,
        fromId: cit.sourceId,
        toId: "search:query",
        type: "DISCUSSED_IN"
      });
    });

    // Make sure we have at least a developer node in the graph
    nodes.push({ id: "person:bob", type: "Person", name: "Bob Jenkins" });
    edges.push({ id: "dyn-edge-dev", fromId: "search:query", toId: "person:bob", type: "AUTHORED_BY" });

    return {
      question: match.question,
      answer: match.answer,
      citations: match.citations,
      graph: { nodes, edges },
      task: {
        id: `task:${match.id}`,
        question: match.question,
        status: "completed",
        plan: [
          {
            id: `call:${match.id}-fetch`,
            toolName: "search_messages",
            arguments: { query: normQuery },
            status: "completed",
            result: { count: match.citations.length },
            timestamp: new Date().toISOString()
          }
        ],
        executionTrace: [
          createTrace("planner_initiate", `Planner initiated scope resolution for '${match.question}'`, 0),
          createTrace("scope_resolved", `Scope resolved: [${match.tags?.join(', ') || 'general'}]`, 0.4),
          createTrace("retriever_match", `Retriever fetched matching documents from SQLite engineering memory: found ${match.citations.length} citations.`, 1.1),
          createTrace("reasoning", "Reasoning Agent prepared cached response directly from memory table.", 1.8),
          createTrace("reflection", "Reflection Agent approved claim grounds.", 2.2)
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }

  // Complete fallback for unknown questions
  return {
    question: query,
    answer: `No exact cached entry was found for "${query}". Here is a live reasoning attempt:\n\nBased on scanning the static repository metadata, this context relates to our **${enterpriseEntities[1]?.name || 'ContextOS Core'}** workspace. We have registered ${enterpriseEntities.filter(e => e.type === 'TeamMember').length} core team members and multiple integrations (GitHub, Slack channel \`#engineering\`).\n\nTo resolve this further, please consult the team members in the dashboard directory or ask a question related to **Redis**, **CheckoutService**, or **Authentication** for high-fidelity traces.`,
    citations: [],
    graph: {
      nodes: [
        { id: "node:search", type: "Decision", name: `Query: ${query}` },
        { id: "repo:contextos-core", type: "Service", name: "contextos-core" },
        { id: "person:diana", type: "Person", name: "Diana Ross" }
      ],
      edges: [
        { id: "e-fallback-1", fromId: "node:search", toId: "repo:contextos-core", type: "DEPENDS_ON" },
        { id: "e-fallback-2", fromId: "node:search", toId: "person:diana", type: "AUTHORED_BY" }
      ]
    },
    task: {
      id: "task:fallback",
      question: query,
      status: "failed",
      plan: [
        {
          id: "call:fallback",
          toolName: "grep_codebase",
          arguments: { query },
          status: "failed",
          error: "No matching semantic results found in local memory table.",
          timestamp: new Date().toISOString()
        }
      ],
      executionTrace: [
        createTrace("planner_initiate", `Planner searching for '${query}'`, 0),
        createTrace("scope_resolved", "Scope resolved: [general]", 0.3),
        createTrace("retriever_scan", "Retriever scanned SQLite database: memory miss.", 1.2),
        createTrace("reasoning", "Reasoning Agent noted database miss; generating informative response based on active workspace metadata.", 2.0)
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
}
