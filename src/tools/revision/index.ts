import type { AnyFastMCP } from '../commons/types.js';
import { registerGetRevisionTool } from './getRevision';
import { registerListRevisionsTool } from './listRevisions';

export function loadRevisionTools(server: AnyFastMCP): void {
  registerListRevisionsTool(server);
  registerGetRevisionTool(server);
}
