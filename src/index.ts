#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

// GitHub API client
const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// Helper function to handle GitHub API errors
function handleGitHubError(error: any): never {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || 'Unknown GitHub API error';
    
    if (status === 401) {
      throw new McpError(ErrorCode.InvalidRequest, 'Invalid GitHub token');
    } else if (status === 404) {
      throw new McpError(ErrorCode.InvalidRequest, 'Resource not found');
    } else if (status === 403) {
      throw new McpError(ErrorCode.InvalidRequest, `GitHub API error: ${message}`);
    } else {
      throw new McpError(ErrorCode.InternalError, `GitHub API error: ${message}`);
    }
  } else {
    throw new McpError(ErrorCode.InternalError, 'Network error while connecting to GitHub');
  }
}

// Create server instance
const server = new Server(
  {
    name: 'gists-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_gists',
        description: 'List all gists for the authenticated user or a specific user',
        inputSchema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'Username to list gists for (optional, defaults to authenticated user)',
            },
            since: {
              type: 'string',
              description: 'Only show gists updated after this time (ISO 8601 format)',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (max 100)',
              default: 30,
            },
            page: {
              type: 'number',
              description: 'Page number to retrieve',
              default: 1,
            },
          },
        },
      },
      {
        name: 'list_public_gists',
        description: 'List all public gists',
        inputSchema: {
          type: 'object',
          properties: {
            since: {
              type: 'string',
              description: 'Only show gists updated after this time (ISO 8601 format)',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (max 100)',
              default: 30,
            },
            page: {
              type: 'number',
              description: 'Page number to retrieve',
              default: 1,
            },
          },
        },
      },
      {
        name: 'list_starred_gists',
        description: 'List all starred gists for the authenticated user',
        inputSchema: {
          type: 'object',
          properties: {
            since: {
              type: 'string',
              description: 'Only show gists updated after this time (ISO 8601 format)',
            },
            per_page: {
              type: 'number',
              description: 'Number of results per page (max 100)',
              default: 30,
            },
            page: {
              type: 'number',
              description: 'Page number to retrieve',
              default: 1,
            },
          },
        },
      },
      {
        name: 'get_gist',
        description: 'Get a single gist by ID',
        inputSchema: {
          type: 'object',
          properties: {
            gist_id: {
              type: 'string',
              description: 'The ID of the gist to retrieve',
            },
          },
          required: ['gist_id'],
        },
      },
      {
        name: 'create_gist',
        description: 'Create a new gist',
        inputSchema: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description: 'Description of the gist',
            },
            files: {
              type: 'object',
              description: 'Files to include in the gist (object with filename as key and content as value)',
              additionalProperties: {
                type: 'string',
              },
            },
            public: {
              type: 'boolean',
              description: 'Whether the gist should be public',
              default: false,
            },
          },
          required: ['files'],
        },
      },
      {
        name: 'update_gist',
        description: 'Update an existing gist',
        inputSchema: {
          type: 'object',
          properties: {
            gist_id: {
              type: 'string',
              description: 'The ID of the gist to update',
            },
            description: {
              type: 'string',
              description: 'New description for the gist',
            },
            files: {
              type: 'object',
              description: 'Files to update (object with filename as key and content as value, or null to delete)',
              additionalProperties: {
                type: ['string', 'null'],
              },
            },
          },
          required: ['gist_id'],
        },
      },
      {
        name: 'delete_gist',
        description: 'Delete a gist',
        inputSchema: {
          type: 'object',
          properties: {
            gist_id: {
              type: 'string',
              description: 'The ID of the gist to delete',
            },
          },
          required: ['gist_id'],
        },
      },
      {
        name: 'star_gist',
        description: 'Star a gist',
        inputSchema: {
          type: 'object',
          properties: {
            gist_id: {
              type: 'string',
              description: 'The ID of the gist to star',
            },
          },
          required: ['gist_id'],
        },
      },
      {
        name: 'unstar_gist',
        description: 'Unstar a gist',
        inputSchema: {
          type: 'object',
          properties: {
            gist_id: {
              type: 'string',
              description: 'The ID of the gist to unstar',
            },
          },
          required: ['gist_id'],
        },
      },
      {
        name: 'fork_gist',
        description: 'Fork a gist',
        inputSchema: {
          type: 'object',
          properties: {
            gist_id: {
              type: 'string',
              description: 'The ID of the gist to fork',
            },
          },
          required: ['gist_id'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_gists': {
        const { username, since, per_page = 30, page = 1 } = args as any;
        const endpoint = username ? `/users/${username}/gists` : '/gists';
        const params: any = { per_page, page };
        if (since) params.since = since;
        
        const response = await github.get(endpoint, { params });
        const gists = response.data.map((gist: any) => ({
          id: gist.id,
          description: gist.description || 'No description',
          public: gist.public,
          files: Object.keys(gist.files).join(', '),
          created_at: gist.created_at,
          updated_at: gist.updated_at,
          url: gist.html_url,
        }));
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(gists, null, 2),
            },
          ],
        };
      }

      case 'list_public_gists': {
        const { since, per_page = 30, page = 1 } = args as any;
        const params: any = { per_page, page };
        if (since) params.since = since;
        
        const response = await github.get('/gists/public', { params });
        const gists = response.data.map((gist: any) => ({
          id: gist.id,
          owner: gist.owner?.login || 'anonymous',
          description: gist.description || 'No description',
          files: Object.keys(gist.files).join(', '),
          created_at: gist.created_at,
          updated_at: gist.updated_at,
          url: gist.html_url,
        }));
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(gists, null, 2),
            },
          ],
        };
      }

      case 'list_starred_gists': {
        const { since, per_page = 30, page = 1 } = args as any;
        const params: any = { per_page, page };
        if (since) params.since = since;
        
        const response = await github.get('/gists/starred', { params });
        const gists = response.data.map((gist: any) => ({
          id: gist.id,
          owner: gist.owner?.login || 'anonymous',
          description: gist.description || 'No description',
          files: Object.keys(gist.files).join(', '),
          created_at: gist.created_at,
          updated_at: gist.updated_at,
          url: gist.html_url,
        }));
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(gists, null, 2),
            },
          ],
        };
      }

      case 'get_gist': {
        const { gist_id } = args as any;
        if (!gist_id) {
          throw new McpError(ErrorCode.InvalidParams, 'gist_id is required');
        }
        
        const response = await github.get(`/gists/${gist_id}`);
        const gist = response.data;
        
        const result = {
          id: gist.id,
          description: gist.description || 'No description',
          public: gist.public,
          owner: gist.owner?.login || 'anonymous',
          files: Object.entries(gist.files).map(([filename, file]: [string, any]) => ({
            filename,
            language: file.language,
            size: file.size,
            content: file.content,
          })),
          created_at: gist.created_at,
          updated_at: gist.updated_at,
          url: gist.html_url,
          forks: gist.forks?.length || 0,
          comments: gist.comments,
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_gist': {
        const { description, files, public: isPublic = false } = args as any;
        if (!files || Object.keys(files).length === 0) {
          throw new McpError(ErrorCode.InvalidParams, 'At least one file is required');
        }
        
        // Transform files to GitHub API format
        const gistFiles: any = {};
        for (const [filename, content] of Object.entries(files)) {
          gistFiles[filename] = { content };
        }
        
        const response = await github.post('/gists', {
          description,
          public: isPublic,
          files: gistFiles,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                id: response.data.id,
                url: response.data.html_url,
                description: response.data.description,
                message: 'Gist created successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'update_gist': {
        const { gist_id, description, files } = args as any;
        if (!gist_id) {
          throw new McpError(ErrorCode.InvalidParams, 'gist_id is required');
        }
        
        const updateData: any = {};
        if (description !== undefined) {
          updateData.description = description;
        }
        
        if (files) {
          updateData.files = {};
          for (const [filename, content] of Object.entries(files)) {
            if (content === null) {
              // Delete file
              updateData.files[filename] = null;
            } else {
              // Update file
              updateData.files[filename] = { content };
            }
          }
        }
        
        const response = await github.patch(`/gists/${gist_id}`, updateData);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                id: response.data.id,
                url: response.data.html_url,
                message: 'Gist updated successfully',
              }, null, 2),
            },
          ],
        };
      }

      case 'delete_gist': {
        const { gist_id } = args as any;
        if (!gist_id) {
          throw new McpError(ErrorCode.InvalidParams, 'gist_id is required');
        }
        
        await github.delete(`/gists/${gist_id}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Gist deleted successfully',
                gist_id,
              }, null, 2),
            },
          ],
        };
      }

      case 'star_gist': {
        const { gist_id } = args as any;
        if (!gist_id) {
          throw new McpError(ErrorCode.InvalidParams, 'gist_id is required');
        }
        
        await github.put(`/gists/${gist_id}/star`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Gist starred successfully',
                gist_id,
              }, null, 2),
            },
          ],
        };
      }

      case 'unstar_gist': {
        const { gist_id } = args as any;
        if (!gist_id) {
          throw new McpError(ErrorCode.InvalidParams, 'gist_id is required');
        }
        
        await github.delete(`/gists/${gist_id}/star`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Gist unstarred successfully',
                gist_id,
              }, null, 2),
            },
          ],
        };
      }

      case 'fork_gist': {
        const { gist_id } = args as any;
        if (!gist_id) {
          throw new McpError(ErrorCode.InvalidParams, 'gist_id is required');
        }
        
        const response = await github.post(`/gists/${gist_id}/forks`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                id: response.data.id,
                url: response.data.html_url,
                owner: response.data.owner?.login,
                message: 'Gist forked successfully',
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    handleGitHubError(error);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Gists MCP server running on stdio');
}

main().catch(console.error);
