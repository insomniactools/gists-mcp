# 🚀 Gists MCP Server - Your AI's Code Memory!

[![smithery badge](https://smithery.ai/badge/@insomniactools/github-gists)](https://smithery.ai/server/@insomniactools/github-gists)

> **Transform GitHub Gists into your AI assistant's personal code snippet library!** 🧠💾 (this readme totally wasn't written by Claude 😂)

Ever found yourself searching through GitHub repos and thinking "Wow, this code is gold!" only to lose it in your browser history? Or maybe you're tired of copy-pasting code between ChatGPT sessions? 

**Welcome to the future of AI-assisted development!** 🎉

## 🌟 What Makes This Special?

This MCP server turns Claude into your **intelligent code librarian** who can:
- 📥 **Save brilliant code** you discover anywhere on GitHub directly to YOUR gists
- 🔍 **Instantly retrieve** that authentication implementation you saved 3 months ago
- 📝 **Update and refine** your code collection as you learn better patterns
- 🗂️ **Organize snippets** with descriptive names that make sense to both you AND your AI
- 🔐 **Keep sensitive code private** or share useful utilities publicly
- 🚫 **No more local file clutter** - everything lives in the cloud!

## 💡 Real-World Magic

Imagine this workflow:
1. **You**: "Claude, search GitHub for the best React authentication patterns"
2. **Claude**: *finds amazing implementations*
3. **You**: "Save that JWT refresh token logic as a gist!"
4. **Claude**: *creates a perfectly organized gist with the code*
5. **Future You**: "Remember that auth code we saved?"
6. **Claude**: *instantly retrieves YOUR curated code*

## 🎯 Perfect For:

- **🔧 Developers** building their personal utility library
- **📚 Learners** collecting examples of best practices
- **🏢 Teams** sharing code patterns across projects
- **🎨 Creators** saving creative coding experiments
- **🛠️ DevOps** storing configuration snippets and scripts

## Features

- **List Gists**: View all your gists or explore public gists
- **Create Gists**: Save code with multiple files in one gist
- **Get Gist Details**: Retrieve any gist with full content
- **Update Gists**: Evolve your code as you learn
- **Delete Gists**: Clean up outdated snippets
- **Star/Unstar**: Bookmark the best of the best
- **Fork Gists**: Build upon others' great ideas

## 🚀 Quick Start

### Installing via Smithery

To install github-gists for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@insomniactools/github-gists):

```bash
npx -y @smithery/cli install @insomniactools/github-gists --client claude
```

### Prerequisites

- Node.js 18 or higher
- A GitHub Personal Access Token with `gist` scope
- Claude Desktop or Claude CLI

### Setup in 3 Minutes

1. **Clone the magic**:
```bash
git clone https://github.com/insomniactools/gists-mcp.git
cd gists-mcp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build it**:
```bash
npm run build
```

4. **Get your GitHub token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Name it something cool like "Claude's Code Memory"
   - Select the `gist` scope
   - Click "Generate token"
   - Copy the token (save it somewhere safe!)

## ⚙️ Configuration

### Option 1: Claude Desktop App

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

### Option 2: Claude CLI (Global Install)

```bash
claude mcp add gists -s user \
  -e GITHUB_TOKEN=your-github-token-here \
  -- node /absolute/path/to/gists-mcp/dist/index.js
```

## 🎮 Usage Examples

Once connected, just talk to Claude naturally:

- 🔍 "Show me all my gists"
- ✨ "Create a gist with that amazing debounce function we just found"
- 📖 "Get my authentication utilities gist"
- 🔄 "Update the API client gist with better error handling"
- 🗑️ "Delete that old test gist"
- ⭐ "Star this brilliant algorithm we discovered"
- 🔀 "Fork that awesome utility collection"

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development mode with hot reload
npm run dev

# Run tests
npm test

# Lint & format
npm run lint
npm run format
```

## 📚 API Functions

### Core Magic
- `list_gists` - Browse your code collection
- `get_gist` - Retrieve specific snippets
- `create_gist` - Save new discoveries
- `update_gist` - Improve existing code
- `delete_gist` - Clean up your library

### Extra Powers
- `list_public_gists` - Explore the community
- `list_starred_gists` - Your favorites collection
- `star_gist` - Bookmark the best
- `unstar_gist` - Update your bookmarks
- `fork_gist` - Build on others' work

## 🐛 Troubleshooting

### Connection Issues?
1. Double-check your GitHub token has `gist` scope
2. Ensure the path to `index.js` is absolute
3. Verify Node.js 18+ is installed

### Permission Denied?
- Token might be expired - generate a new one
- Ensure you own the gists you're trying to modify

## 🤝 Contributing

Have ideas to make this even better? PRs are welcome! Let's build the ultimate AI code memory together!

## 📜 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with ❤️ for the [Anthropic Model Context Protocol (MCP)](https://modelcontextprotocol.io/) ecosystem

---

**Ready to give your AI perfect memory for code?** Clone this repo and start building your personal code library today! 🚀
