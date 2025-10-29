# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Next.js 15 starter template for building chat applications powered by OpenAI's ChatKit library and Agent Builder workflows. It demonstrates a minimal client-server architecture with secure session management and dark mode support.

## Common Development Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Run ESLint checks
```

**Environment Setup:**
```bash
cp env.template .env.local
# Then add:
# OPENAI_API_KEY=sk_...
# NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=wf_...
```

## Tech Stack

- **Framework:** Next.js 15 (App Router, Edge Runtime)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19 with Hooks + OpenAI ChatKit React library
- **Styling:** Tailwind CSS 4 with custom CSS variables (light/dark themes)
- **Linting:** ESLint 9 (Next.js + TypeScript rules)
- **Deployment:** Vercel (primary) or Azure Static Web Apps

## Architecture Overview

### High-Level Data Flow

```
User Request
    ↓
app/page.tsx (Server, force-dynamic)
    ↓
App.tsx (Client Component)
    ├─→ useColorScheme hook (theme state, localStorage persistence)
    └─→ ChatKitPanel (ChatKit configuration & lifecycle)
         ├─→ useChatKit() (ChatKit React hook)
         ├─→ <openai-chatkit> web component (from CDN)
         └─→ ErrorOverlay (error/loading UI)
              ↓
API Route: POST /api/create-session (Edge Runtime)
    ↓
OpenAI ChatKit API
    ↓
Workflow Execution
```

### Key Components

**app/layout.tsx** - Root layout
- Injects ChatKit CDN script (`https://cdn.platform.openai.com/deployments/chatkit/chatkit.js`)
- Sets page metadata

**app/page.tsx** - Home page
- `export const dynamic = "force-dynamic"` prevents static generation
- Renders App component (ensures fresh sessions)

**App.tsx** - Main client container
- Uses `useColorScheme` hook for light/dark mode
- Passes theme state to ChatKitPanel
- Renders ChatKitPanel with error handling callbacks

**ChatKitPanel.tsx** - ChatKit integration hub
- Manages ChatKit web component lifecycle
- Fetches session from `/api/create-session` endpoint
- Handles custom tools: `switch_theme`, `record_fact`
- Comprehensive error state tracking (script load, session creation, integration errors)
- Remounts widget on reset to clear state

**api/create-session/route.ts** - Session management (Edge Runtime)
- Calls OpenAI's ChatKit API with bearer token
- Creates/retrieves user sessions via `chatkit_session_id` cookie (30-day expiry)
- Resolves workflow ID from POST body or env variable
- Extracts and returns friendly error messages

**useColorScheme hook** - Theme management
- Detects system preference via `matchMedia("(prefers-color-scheme: dark)")`
- Persists user choice to localStorage (`chatkit-color-scheme`)
- Syncs across browser tabs via storage events
- Returns scheme, preference, and setters for component use

**lib/config.ts** - Centralized configuration
- `WORKFLOW_ID` - From env variable (trimmed)
- `STARTER_PROMPTS`, `PLACEHOLDER_INPUT`, `GREETING` - UI text customization
- `getThemeConfig(theme)` - Returns ChatKit theme colors based on current scheme

### State Management Pattern

Uses **React Hooks only** (no Redux/Zustand):
- `useState` for local component state
- `useRef` for instance tracking (processed facts, mounted status, widget key)
- `useSyncExternalStore` for cross-tab color scheme synchronization
- `useCallback`/`useMemo` for performance optimization
- `localStorage` for persistent theme preference

### Error Handling Strategy

Three-tier error system with recovery:

1. **Script Load Error** - ChatKit CDN failed to load
   - 5-second timeout if no load event
   - User sees error overlay with retry button

2. **Session Creation Error** - API endpoint call failed
   - Typically OPENAI_API_KEY or NEXT_PUBLIC_CHATKIT_WORKFLOW_ID issues
   - Friendly error message extracted from OpenAI response

3. **Integration Error** - ChatKit widget runtime error
   - Handled via `onIntegrationError` callback
   - Reset button available to user

All errors include a development console log with context for debugging.

## Environment Configuration

**Required Variables:**
```
OPENAI_API_KEY                    # Server-side only (never exposed to browser)
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID   # Client-side, workflow ID format: wf_...
```

**Optional Variables:**
```
CHATKIT_API_BASE                  # Custom API endpoint (defaults to https://api.openai.com)
```

See `env.template` for the template file.

## API Route: POST /api/create-session

**Purpose:** Create or retrieve a ChatKit user session with OpenAI's API

**Request Body:**
```typescript
{
  workflow?: { id?: string | null },
  workflowId?: string | null,
  chatkit_configuration?: {
    file_upload?: { enabled?: boolean }
  }
}
```

**Response (200 OK):**
```typescript
{
  client_secret: string,
  expires_after: number
}
```

**Error Response:**
```typescript
{
  error: string,
  details?: Record<string, unknown>
}
```

**Key Implementation Details:**
- Uses Edge Runtime for fast serverless execution
- Sends bearer token: `Authorization: Bearer ${OPENAI_API_KEY}`
- Includes OpenAI beta header: `OpenAI-Beta: chatkit_beta=v1`
- Sets HttpOnly, SameSite=Lax cookie: `chatkit_session_id` (30-day expiry)
- Resolves workflow ID: POST body takes precedence over env variable
- Extracts nested error details from OpenAI response for user display

## Customization Points

1. **Theme & Text** → `lib/config.ts`
   - Edit `STARTER_PROMPTS`, `PLACEHOLDER_INPUT`, `GREETING`
   - Modify `getThemeConfig()` for ChatKit theme colors

2. **ChatKit Behavior** → `components/ChatKitPanel.tsx`
   - Add/modify client tool handlers (`switch_theme`, `record_fact`)
   - Adjust error messages or retry logic
   - Change script load timeout (currently 5 seconds)

3. **Color Scheme** → `app/globals.css`
   - CSS variables for light/dark mode
   - Dark mode triggered by `data-color-scheme="dark"` or `.dark` class
   - System preference fallback via media query

4. **Session Logic** → `api/create-session/route.ts`
   - Modify cookie configuration
   - Add validation or custom session handling
   - Change error extraction logic

## Important Files & Purposes

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, loads ChatKit CDN script |
| `app/page.tsx` | Home page, forces dynamic rendering |
| `app/App.tsx` | Main client component, theme management |
| `components/ChatKitPanel.tsx` | ChatKit wrapper with session & error handling |
| `hooks/useColorScheme.ts` | Color scheme detection & persistence |
| `lib/config.ts` | Configuration: prompts, theme, endpoints |
| `api/create-session/route.ts` | Session creation API (Edge Runtime) |
| `globals.css` | Tailwind CSS, theme variables, dark mode |

## Known Design Choices

1. **Force Dynamic Rendering** - `app/page.tsx` uses `dynamic = "force-dynamic"` to prevent caching issues with user sessions
2. **No Global State Manager** - React hooks + localStorage keep bundle size minimal
3. **Single API Endpoint** - `/api/create-session` is the only backend route; ChatKit handles all other API calls
4. **External ChatKit Package** - Marked as external in webpack config for Vercel optimization
5. **Comprehensive Error Tracking** - Three independent error states allow fine-grained UI feedback
6. **Client Tools for Actions** - Workflow can trigger client-side actions (theme switch, fact recording) via tool invocations

## Deployment

**Primary:** Vercel
- Automatic deployments on main branch push
- Environment variables configured in Vercel dashboard
- Supports Edge Runtime for `api/create-session`

**Secondary:** Azure Static Web Apps
- GitHub Actions workflow in `.github/workflows/azure-static-web-apps-*.yml`
- Build command: `npm run build`
- Output directory: `.next`

See `DEPLOYMENT.md` for detailed instructions.

## Code Quality

- **TypeScript:** Strict mode enabled, full type annotations
- **Type Coverage:** All components and API routes fully typed
- **Linting:** ESLint 9 with next/core-web-vitals + next/typescript rules
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Memory Leaks:** Prevented via mount tracking and event listener cleanup
