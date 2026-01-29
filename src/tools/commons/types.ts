import type { FastMCP } from 'fastmcp';

/**
 * Type alias for FastMCP with any auth configuration.
 * Used in tool registration to support both authenticated and unauthenticated servers.
 */
// biome-ignore lint/suspicious/noExplicitAny: FastMCP generic type varies based on auth configuration
export type AnyFastMCP = FastMCP<any>;
