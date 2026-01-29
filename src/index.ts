#!/usr/bin/env node

import { axiosInstanceManager } from '@growi/sdk-typescript';
import { FastMCP } from 'fastmcp';
import { authenticateBearer } from './auth/bearer-auth.js';
import config from './config/default.js';
import httpConfig from './config/http-config.js';
import type { GrowiAppConfig } from './config/types.js';

// Add global error handlers for debugging
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Wrap authenticate function to log errors
const authenticateWithLogging = async (request: Parameters<typeof authenticateBearer>[0]) => {
  console.log('🔐 Authentication request received');
  console.log('   Headers:', JSON.stringify(request.headers, null, 2));
  try {
    const result = await authenticateBearer(request);
    console.log('✅ Authentication successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    throw error;
  }
};

const server = new FastMCP({
  name: 'growi-mcp',
  version: '1.0.0',
  authenticate: authenticateWithLogging,
  health: {
    enabled: true,
    path: '/health',
    message: 'ok',
  },
});

// Add event handlers for debugging
server.on('connect', ({ session }) => {
  console.log('Client connected:', session);
});

server.on('disconnect', ({ session }) => {
  console.log('Client disconnected:', session);
});

/**
 * Initialize Axios instances for all GROWI apps.
 */
const setupAxiosInstance = async (apps: Map<string, GrowiAppConfig>): Promise<void> => {
  Array.from(apps.values()).map((app) => {
    axiosInstanceManager.addAxiosInstance({
      appName: app.name,
      baseURL: app.baseUrl,
      token: app.apiToken,
    });
  });
};

async function main(): Promise<void> {
  setupAxiosInstance(config.growi.apps);

  try {
    // Loaders are imported dynamically so that the module will be garbage collected
    const { loadTools } = await import('./tools/index.js');
    const { loadResources } = await import('./resources/index.js');
    const { loadPrompts } = await import('./prompts/index.js');
    console.log('📦 Loading tools...');
    await loadTools(server);
    console.log('📦 Loading resources...');
    await loadResources(server);
    console.log('📦 Loading prompts...');
    await loadPrompts(server);
    console.log('✅ All loaders completed');

    // Log registered items
    // @ts-expect-error Accessing private property for debugging
    console.log(`   Tools registered: ${server.options?.tools?.length ?? 'unknown'}`);

    console.log('🚀 Starting server...');
    await server.start({
      transportType: 'httpStream',
      httpStream: {
        port: httpConfig.port,
      },
    });

    console.log(`🚀 GROWI MCP HTTP server started on http://${httpConfig.host}:${httpConfig.port}`);
    console.log(`   - MCP endpoint: http://${httpConfig.host}:${httpConfig.port}/stream`);
    console.log(`   - Health check: http://${httpConfig.host}:${httpConfig.port}/health`);
  } catch (error) {
    console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
