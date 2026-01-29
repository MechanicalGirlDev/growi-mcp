import type { AnyFastMCP } from '../commons/types.js';
import { registerGetCommentsTool } from './getComments';

export async function loadCommentsTools(server: AnyFastMCP): Promise<void> {
  registerGetCommentsTool(server);
}
