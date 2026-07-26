import 'dotenv/config';
import { planAndExecute } from './src/agents/planner/planner.js';

async function run() {
  console.log('--- Starting ContextOS Agent Pipeline ---');
  try {
    const task = await planAndExecute('Why are we using Redis?');
    console.log('\n✅ Pipeline Completed Successfully!');
    
    const reflectTool = task.plan.find(t => t.toolName === 'reflect_and_answer');
    const retrieveTool = task.plan.find(t => t.toolName === 'retrieve_memories');
    
    console.log('\n--- Final Answer ---');
    console.log(reflectTool?.result?.answer || 'No answer found.');
    
    console.log('\n--- Evidence Used ---');
    console.log(`Retrieved ${retrieveTool?.result?.evidenceItems || 0} pieces of evidence.`);
    
    console.log('\n--- Task Traces ---');
    console.log(`Executed ${task.executionTrace.length} agentic steps.`);
    console.log(task.executionTrace.map(t => `- [${t.step}]: ${t.description}`).join('\n'));
  } catch (err: any) {
    console.error('\n❌ Pipeline Failed:', err);
  }
}

run();
