import type { AnyFastMCP } from '../commons/types.js';
import { registerGetTagListTool } from './getTagList';
import { registerSearchTagsTool } from './searchTags';
import { registerUpdateTagTool } from './updateTag';

export async function loadTagTools(server: AnyFastMCP): Promise<void> {
  registerUpdateTagTool(server);
  registerGetTagListTool(server);
  registerSearchTagsTool(server);
}
