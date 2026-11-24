# Code2Chill website — local setup

The uploaded project was missing the React entry point (`client/src/main.jsx`) and the root application/router (`client/src/App.jsx`). Those files have been restored. A basic sign-in page and contact form are also included because the navbar already linked to those routes.

## Requirements

- Node.js 18 or newer
- npm

## Easiest option on Windows

Double-click `start-local-windows.bat`. It opens separate backend and frontend terminals, installs each folder's dependencies, and starts both development servers. Keep both windows open.

## Start the backend manually

Open Terminal 1:

```bash
cd server
npm install
npm run dev
```

The backend listens at `http://localhost:5000`. It attempts MongoDB first. If MongoDB is unavailable, this project is configured to use its in-memory seed store for local development.

## Start the frontend manually

Open Terminal 2 from the project root:

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). Keep both terminal windows running.

## Environment variables

`server/.env` is intentionally not included in this repaired ZIP. The project includes `server/.env.example`; copy it to `server/.env` only if you need custom configuration. For local testing, the in-memory store can start without a MongoDB server.

Do not commit `.env` files or publish database connection strings or JWT secrets.

## Editing your club's content

All sample content lives in `server/utils/seedData.js`:

- `teamMembersData`: club heads and members (set `isHead: true` for the "Club Heads" row; add `photo`, `skills`, `funFact`, `quote`, links)
- `projectsData`: projects (`status: 'Active'` or `'In Development'` shows as Ongoing, `'Completed'` as Completed)
- `goalsData`, `roadmapData`, `testimonialsData`: the Goals page and "Kind words" section
- `eventsData`, `domainsData`, `announcementsData`, `statsData`: everything else

The names, numbers and quotes are placeholders. Replace them with real ones before publishing. If you use MongoDB, run `npm run seed` in `server/` after editing.

## Admin panel

Sign in as `admin@code2chill.org` / `admin123` (seed account, in `server/utils/seedData.js`) and click **Admin** in the navbar. **Change this password before deploying.**

## Site features

Light/dark theme and an animations toggle (navbar), click-anywhere code-symbol bursts, live clock, flip-card team profiles, Ongoing/Completed project tabs, Goals & Roadmap page, and a confetti button.

## v5: Framer Motion + TypeScript upgrade

New files are `.tsx` (Vite + TypeScript, `npm run typecheck`); older `.jsx` files still work alongside them. Added: intro percentage loader with ASCII logo, assembling text (`ScrambleText`, `AsciiArt`), grid frame, click ripple + particles, optional click sound (Web Audio, off by default, remembered in localStorage), Framer Motion reveals/stagger/scroll-driven hero. Run `npm install` again in `client/` to get framer-motion and typescript.

## v6: tearing + ambient background

Drag the mouse across empty background in the Surface, Bedrock (events) and Crystal Caves (projects) layers to rip the page open and reveal what is underneath; tears heal after ~9 s. Mouse only (touch keeps normal scrolling). A particle field behind the page changes with depth (pollen, dust, crystal specks, embers, sparks) and drifts away from the cursor; blurred colour blobs drift in the background. Both switch off with the animations toggle. To add tearing elsewhere, drop `<TearZone kind="strata" />` (or `magma` / `void`) into any section.

## v7: dynamic scroll

Inertial smooth scrolling (Lenis, `npm install` in `client/` to add it), scroll-velocity effects (particles stream and streak, floating decorations swing), section titles that slide sideways as you pass them, and a navbar that hides on scroll down and returns on scroll up. Anchor jumps use the same engine (`src/lib/scroll.ts`). Turned off by the animations toggle or the OS reduce-motion setting. Add `data-lenis-prevent` to any custom scrollable box.

## v8: chainsaw, shovel, wrecking ball

Chainsaw: hold the mouse and drag across empty background in the Surface, Bedrock and Crystal Caves layers; a chainsaw sprite cuts a slot with chips and sparks flying (engine sound if click sounds are on). Cursor: a shovel everywhere. Wrecking ball: click the button at the bottom of the home page, or press W; a ball swings from your cursor and knocks cards and headings (3 hits makes one fall, then it rebuilds after ~6 s). Section titles no longer slide sideways.

## v9: glass shatter

Clicking any link or button shatters the screen like glass: a spider-web crack spreads from the click, then shards of the real page (captured with html2canvas, `npm install` to add it) fly and fall. A snapshot is taken in the background when the pointer rests on something clickable; if none is ready the shards fall back to plain translucent glass. For internal links the new page loads behind the falling glass (about 0.17 s in); for other buttons the shatter is a smaller burst around the cursor. Optional glass sound with click sounds on. Disabled with the animations toggle, while the wrecking ball is on, and for Ctrl/Cmd/Shift-clicks. Selector for what counts as clickable: `src/lib/clickable.ts`.

## One-page layout (v4)

The home page is a single scroll "descent into the earth": Surface (hero), Topsoil (about), Roots (domains), Bedrock (events), Crystal Caves (projects), Aquifer (team), Mantle (goals and roadmap), Core (join form and contact form). The navbar links jump to these layers. Old URLs like `/team` or `/projects` redirect to their layer. Event detail pages (`/events/:id`), sign-in and the admin panel are still separate pages.

There are no photos anywhere. Team cards use an emoji badge (set `emoji` per member, or use the Admin panel) and events and projects get generated colour covers. Team names are placeholders ("Name goes here") for you to fill in.
