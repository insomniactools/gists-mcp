# Gists MCP Server

An MCP (Model Context Protocol) server that enables Claude to manage GitHub Gists. Create, read, update, and delete gists directly from your Claude conversations.

## Features

- **List Gists**: View all your gists or public gists
- **Create Gists**: Create new gists with multiple files
- **Get Gist Details**: Retrieve specific gist information
- **Update Gists**: Modify existing gists
- **Delete Gists**: Remove gists you no longer need
- **Star/Unstar**: Manage starred gists
- **Fork Gists**: Fork other users' gists

## Installation

### Prerequisites

- Node.js 18 or higher
- A GitHub Personal Access Token with `gist` scope

### Setup

1. Clone this repository:
```bash
git clone https://github.com/insomniactools/gists-mcp.git
cd gists-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a descriptive name
   - Select the `gist` scope
   - Click "Generate token"
   - Copy the token (you won't be able to see it again!)

## Configuration

### Option 1: Using Claude Desktop App

Add the server to your Claude Desktop configuration:

**On macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**On Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "gists": {
      "command": "node",
      "args": ["/absolute/path/to/gists-mcp/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your-github-token-here"
      }
    }
  }
}
```

### Option 2: Using Claude CLI

```bash
claude mcp add gists \
  -e GITHUB_TOKEN=your-github-token-here \
  -- node /absolute/path/to/gists-mcp/dist/index.js
```

For global availability across all Claude sessions:
```bash
claude mcp add gists -s user \
  -e GITHUB_TOKEN=your-github-token-here \
  -- node /absolute/path/to/gists-mcp/dist/index.js
```

## Usage Examples

Once configured, you can ask Claude to:

- "List my gists"
- "Create a new gist with a Python hello world script"
- "Get the content of gist [gist-id]"
- "Update my gist to add error handling"
- "Delete the test gist I created earlier"
- "Show me the most recent public gists"
- "Star that useful gist we found"

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with auto-rebuild
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## API Functions

### Core Functions
- `list_gists` - List gists (user's or public)
- `get_gist` - Get a specific gist by ID
- `create_gist` - Create a new gist
- `update_gist` - Update an existing gist
- `delete_gist` - Delete a gist

### Additional Functions
- `list_public_gists` - List all public gists
- `list_starred_gists` - List starred gists
- `star_gist` - Star a gist
- `unstar_gist` - Unstar a gist
- `fork_gist` - Fork a gist

## Troubleshooting

### Server not connecting
1. Ensure your GitHub token has the `gist` scope
2. Check that the path to `index.js` is absolute
3. Verify Node.js is installed and accessible

### Permission errors
- Make sure your token is valid and not expired
- Ensure you have permissions for the gists you're trying to access

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built for use with [Anthropic's Model Context Protocol (MCP)](https://modelcontextprotocol.io/)