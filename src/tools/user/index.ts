import type { AnyFastMCP } from '../commons/types.js';
import { registerGetUserRecentPagesTool } from './getUserRecentPages';

export async function loadUserTools(server: AnyFastMCP): Promise<void> {
  registerGetUserRecentPagesTool(server);
}
