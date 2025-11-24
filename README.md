# React Advanced 2025 Workshop

> How To Enhance an Existing React App With AI, Without Rewriting It From Scratch

Welcome to my React Advanced 2025 workshop! In this workshop, you'll enhance a full-stack React application with thoughtful sprinklings of AI.

## Prerequisites

Before starting this workshop, ensure you have:

- **Cloudflare account**: [Sign up for free](http://dash.cloudflare.com/sign-up/workers-and-pages)

- **Familiarity with React and TypeScript**: You should be comfortable with React hooks, components, and TypeScript basics. Knowledge of React Server Components will help, but is not strictly necessary.

- **Node.js LTS (v24.11.1)**: Download from [nodejs.org](https://nodejs.org/en/download) or use a version manager. I personally am liking [`mise`](https://mise.jdx.dev/) at the moment.

## Getting Started

1.  **Clone this repository** (if you haven't already):

    ```bash
    git clone https://github.com/GregBrimble/react-advanced-2025-workshop.git
    ```

2.  **Install dependencies** from the **root** directory:

    ```bash
    npm install
    ```

    **Important**: Use `npm` rather than other package managers. This workshop relies on npm's [`workspaces`](https://docs.npmjs.com/cli/v11/using-npm/workspaces) feature to manage the lesson structure.

3.  **Navigate to lesson 1** to begin:

    ```bash
    cd lesson-1
    ```

    Then follow the instructions in `/lesson-1/README.md`.

## Workshop Structure

This workshop is organized into progressive lessons, each contained in its own directory:

```
react-advanced-2025-workshop/
├── lesson-1/
├── lesson-2/
├── lesson-3/
└── ...
```

### How Lessons Work

**Each lesson directory is a complete, standalone snapshot of the project at that stage.** This means:

- Each lesson has its own `package.json`, `src/` directory, and configuration files
- Each lesson builds on concepts from previous lessons
- If you get stuck, you can peek ahead at the code in the next lesson to get an hint
- If you get completely stuck, you can skip the current lesson and just start fresh with a working copy in the next lesson

### Lesson Progression

1. **Lesson 1**: Start here! Set up the React Rental Agency, create a D1 database, and deploy the application to Cloudflare
2. **Lesson 2**: Add AI-powered natural language search using Workers AI
3. **Lesson 3**: Create an MCP server and interact with it from an AI assistant
4. **Lesson 4**: Choose your own adventure

**Don't worry about getting every detail perfect.** Each lesson acts as a checkpoint. The goal is to learn the concepts and move forward.

### Development Ports

Each lesson runs on its own ports to avoid conflicts. The development servers run on port `800N` and the preview servers run on port `900N`, where `N` is the lesson number. For example, lesson 3's development server is available at [http://localhost:8003/](http://localhost:8003/) and its preview server is available at [http://localhost:9003/](http://localhost:9003/).

This ensures you're never port-squatting and hitting a previous lesson by accident. And it allows you to run multiple lessons simultaneously for comparison if needed.

## Feedback

After you're done, please consider [leaving some feedback](https://forms.gle/uvrFG14Basf6o83V6) for me so that I can continue to improve these sessions. It's just a two minute anonymous Google Form — thank you!

## References

For more about Cloudflare:

- [Workers AI](https://developers.cloudflare.com/workers-ai/) — Machine learning models running on Cloudflare's serverless GPUs.
- [Workers](https://developers.cloudflare.com/workers/) — Serverless JavaScript execution at the edge
- [D1 Database](https://developers.cloudflare.com/d1/) — Cloudflare's serverless SQLite database
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) — Command-line tool for Cloudflare's Developer Platform

For more about React Server Components (RSC) and Server Functions:

- [Server Components](https://react.dev/reference/rsc/server-components)
- [Server Functions](https://react.dev/reference/rsc/server-functions)
- [`@vitejs/plugin-rsc`](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)
