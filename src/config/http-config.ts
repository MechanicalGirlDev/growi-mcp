import dotenvFlow from 'dotenv-flow';
import { z } from 'zod';

// Define schema for HTTP server configuration
const httpConfigSchema = z.object({
  port: z.coerce.number().min(1).max(65535).default(3001),
  host: z.string().default('127.0.0.1'),
  authTokens: z
    .string()
    .transform((str) =>
      str
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    )
    .pipe(z.array(z.string().min(32, 'Each token must be at least 32 characters')).min(1, 'At least one auth token is required')),
});

export type HttpConfig = z.infer<typeof httpConfigSchema>;

// Parse environment variables
dotenvFlow.config();

const parsedConfig = httpConfigSchema.safeParse({
  port: process.env.MCP_HTTP_PORT,
  host: process.env.MCP_HTTP_HOST,
  authTokens: process.env.MCP_AUTH_TOKENS,
});

if (!parsedConfig.success) {
  console.error('❌ Invalid HTTP configuration:', JSON.stringify(parsedConfig.error.format(), null, 2));
  throw new Error('Invalid HTTP configuration');
}

const httpConfig: HttpConfig = parsedConfig.data;

export default httpConfig;
