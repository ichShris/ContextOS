/**
 * ContextOS MCP Resources — Track 3 (The Plumber)
 *
 * Exposes the engineering memory store and enterprise entities as MCP Resources.
 * Resources are read-only, URI-addressed datasets that clients (Claude Desktop,
 * NitroStack widgets) can browse without calling a tool.
 *
 * Resources:
 *   - contextos://memories          — All MemoryEntry records
 *   - contextos://entities          — All EnterpriseEntity records
 *   - contextos://enterprise-data   — Full raw database snapshot
 */

import { ResourceDecorator as Resource, ExecutionContext } from '@nitrostack/core';
import { getAllMemories, getEnterpriseEntities } from '../../agents/index.js';

// ---------------------------------------------------------------------------
// ContextOS Resources class
// ---------------------------------------------------------------------------

export class ContextOSResources {

  // ─── 1. Engineering Memory Resource ──────────────────────────────────────

  @Resource({
    uri: 'contextos://memories',
    name: 'Engineering Memory Store',
    description:
      'All MemoryEntry records currently loaded from enterprise-data.json. ' +
      'Each entry contains a question, a synthesized markdown answer, and ' +
      'evidence citations (PRs, commits, Slack threads, files).',
    mimeType: 'application/json',
  })
  async getMemoriesResource(uri: string, ctx: ExecutionContext) {
    ctx.logger.info('[ContextOS] resource: memories requested');

    const memories = await getAllMemories();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ count: memories.length, memories }, null, 2),
        },
      ],
    };
  }

  // ─── 2. Enterprise Entities Resource ─────────────────────────────────────

  @Resource({
    uri: 'contextos://entities',
    name: 'Enterprise Entity Registry',
    description:
      'All EnterpriseEntity records from the mock database. ' +
      'Includes Organizations, Repositories, SlackWorkspaces, Channels, and TeamMembers.',
    mimeType: 'application/json',
  })
  async getEntitiesResource(uri: string, ctx: ExecutionContext) {
    ctx.logger.info('[ContextOS] resource: entities requested');

    const entities = await getEnterpriseEntities();

    // Group by type for easier consumption
    const grouped = entities.reduce(
      (acc, entity) => {
        if (!acc[entity.type]) acc[entity.type] = [];
        acc[entity.type].push(entity);
        return acc;
      },
      {} as Record<string, typeof entities>,
    );

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            { count: entities.length, byType: grouped, entities },
            null,
            2,
          ),
        },
      ],
    };
  }

  // ─── 3. Full Enterprise Data Snapshot ────────────────────────────────────

  @Resource({
    uri: 'contextos://enterprise-data',
    name: 'Full Enterprise Data Snapshot',
    description:
      'Complete snapshot of the enterprise-data.json mock database, ' +
      'including both memoryEntries and enterpriseEntities in a single payload.',
    mimeType: 'application/json',
  })
  async getEnterpriseDataResource(uri: string, ctx: ExecutionContext) {
    ctx.logger.info('[ContextOS] resource: enterprise-data requested');

    const [memories, entities] = await Promise.all([
      getAllMemories(),
      getEnterpriseEntities(),
    ]);

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              memoryEntries: memories,
              enterpriseEntities: entities,
              meta: {
                memoryCount: memories.length,
                entityCount: entities.length,
                generatedAt: new Date().toISOString(),
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  }
}
