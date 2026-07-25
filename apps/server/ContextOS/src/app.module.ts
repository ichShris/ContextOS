import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { CalculatorModule } from './modules/calculator/calculator.module.js';
import { ContextOSModule } from './modules/contextos/contextos.module.js';
import { SystemHealthCheck } from './health/system.health.js';

/**
 * Root Application Module — ContextOS
 *
 * Bootstraps the NitroStack MCP server for ContextOS.
 * Registered modules:
 *   - ContextOSModule : 7 MCP tools + 3 resources (Track 3 — The Plumber)
 *   - CalculatorModule: retained for reference / example tooling
 *
 * Transport is configured via the MCP_TRANSPORT_TYPE environment variable:
 *   stdio  — STDIO only (Claude Desktop)
 *   http   — HTTP SSE only (web dashboard)
 *   dual   — Both simultaneously (default in .env)
 */
@McpApp({
  module: AppModule,
  server: {
    name: 'contextos-server',
    version: '1.0.0',
  },
  logging: {
    level: 'info',
  },
})
@Module({
  name: 'app',
  description: 'ContextOS — Agentic Engineering Memory Layer',
  imports: [
    ConfigModule.forRoot(),
    ContextOSModule,
    CalculatorModule,
  ],
  providers: [
    // Health Checks
    SystemHealthCheck,
  ],
})
export class AppModule {}
