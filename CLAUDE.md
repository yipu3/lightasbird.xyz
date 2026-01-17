# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server with hot reload (runs Next.js dev + content watcher in parallel)
- `npm run build` - Build for static export
- `npm run lint` - Run ESLint

## Architecture

This is a personal blog built with Next.js 14 App Router, statically exported via `output: "export"`. Blog posts are stored as MDX files in `public/` with the following structure:

```
public/
  post-slug/
    index.md          # MDX content with frontmatter
    components.js     # (optional) Post-specific React components
```

### Key Files

- `app/page.js` - Home page listing all posts; exports `getPosts()` which reads from `public/*/index.md`
- `app/[slug]/page.js` - Individual post page; renders MDX with `next-mdx-remote/rsc`
- `app/[slug]/mdx.js` - Custom remark plugin `remarkMdxEvalCodeBlock` for evaluating JS code blocks with `eval` meta
- `app/feed.js` - RSS/Atom feed generation helper
- `watcher.js` - WebSocket server (port 3001) that triggers browser refresh on content changes

### Post Frontmatter Format

```yaml
---
title: "Post Title"
date: '2024-01-01'
spoiler: "Brief description for post list"
---
```

### MDX Processing Pipeline

Posts are processed with:
- `remark-smartypants` - Smart quotes/dashes
- `remark-math` + `rehype-katex` - LaTeX math rendering
- `rehype-pretty-code` with Overnight theme - Syntax highlighting
- Custom `remarkMdxEvalCodeBlock` - Evaluates code blocks marked with ` ```js eval` ` meta

### Development Hot Reload

The dev server runs `watcher.js` alongside Next.js. When files in `public/` change, a WebSocket message triggers `router.refresh()` via `AutoRefresh.js`.
