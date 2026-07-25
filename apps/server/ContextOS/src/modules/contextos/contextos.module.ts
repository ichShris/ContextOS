/**
 * ContextOS Module — Track 3 (The Plumber)
 *
 * NitroStack @Module that registers ContextOSTools and ContextOSResources.
 * Import this module in app.module.ts to expose all ContextOS MCP tools
 * and resources.
 */

import { Module } from '@nitrostack/core';
import { ContextOSTools } from './contextos.tools.js';
import { ContextOSResources } from './contextos.resources.js';

@Module({
  name: 'contextos',
  description:
    'ContextOS agentic engineering memory layer — exposes Planner, Retriever, ' +
    'MemoryManager, and ContextBuilder as MCP tools and resources.',
  controllers: [ContextOSTools, ContextOSResources],
})
export class ContextOSModule {}
