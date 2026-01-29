import { loadCommentsTools } from './comments';
import type { AnyFastMCP } from './commons/types.js';
import { loadPageTools } from './page';
import { loadRevisionTools } from './revision';
import { loadShareLinksTools } from './shareLinks';
import { loadTagTools } from './tag';
import { loadUserTools } from './user';

/**
 * Loads and registers all MCP tools with the server.
 * As new tools are added, their registration functions should be imported
 * and called here.
 */
export async function loadTools(server: AnyFastMCP): Promise<void> {
  loadPageTools(server);
  loadUserTools(server);
  loadRevisionTools(server);
  loadTagTools(server);
  loadShareLinksTools(server);
  loadCommentsTools(server);
}
