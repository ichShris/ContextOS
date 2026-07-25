/**
 * ContextOS MCP Server — Track 3 (The Plumber)
 *
 * Main entry point for the ContextOS NitroStack MCP server.
 * Wraps Track 2's agent logic (Planner, Retriever, MemoryManager,
 * ContextBuilder) into 7 callable MCP tools + 3 MCP resources.
 *
 * Transport Configuration (set via MCP_TRANSPORT_TYPE in .env):
 *   stdio  — STDIO only (for Claude Desktop / MCP CLI clients)
 *   http   — HTTP SSE only (for Krish's dashboard at apps/web)
 *   dual   — Both simultaneously (default — recommended for hackathon demo)
 *
 * HTTP endpoint: http://localhost:3001
 *   POST /mcp  → JSON-RPC 2.0 tool calls
 *   GET  /mcp  → SSE stream for real-time task updates
 *
 * CORS is enabled via ENABLE_CORS=true in .env so the React
 * dashboard (localhost:5173) can call this server directly.
 */

import 'dotenv/config';
import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

/**
 * Bootstrap the ContextOS MCP server
 */
async function bootstrap() {
  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

bootstrap().catch((error) => {
  console.error('❌ ContextOS server failed to start:', error);
  process.exit(1);
});
