import type { AnyFastMCP } from '../tools/commons/types.js';
import { registerSummarizePagePrompt } from './summarizePagePrompt.js';
// Other prompt definition files can be imported here

export async function loadPrompts(server: AnyFastMCP): Promise<void> {
  // Register each prompt
  registerSummarizePagePrompt(server);
  // Additional prompt registrations can be added in the future
  // Example: await registerAnotherPrompt(server);
}
