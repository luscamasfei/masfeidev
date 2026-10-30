# Portfolio Desktop

An interactive portfolio that recreates, in the browser, the Linux desktop I use every day (Arch Linux, Hyprland and Waybar). Visitors explore my work the way they would explore my computer: through a top bar, desktop icons, windows, a file manager and a terminal.

The visual identity is taken from the real configuration files of that desktop rather than approximated from a screenshot: the color palette, the bar layout, window borders, animation curves, the terminal theme, the shell prompt and the launcher all mirror their originals.

A plain, linear version of the same content is always one click away (`?view=simple`) for visitors who prefer a conventional page.

## Features

- **Desktop**: wallpaper, loose icons (on workspace 1 only) for the main apps and for every project, selection (click, Ctrl+click, rubber band), drag and drop within the screen bounds, keyboard navigation, and context menus.
- **Top bar**: a recreation of the Waybar modules: session menu, four workspaces, open-window list, tray, status modules, and a clock with a calendar.
- **Window manager**: open, close, focus, minimize, restore, maximize, drag (from the title bar, or anywhere with Alt), resize from any edge, workspaces, and keyboard shortcuts. Windows can never be lost off-screen.
- **Pre-populated workspaces**: workspace 2 runs *Falsefy*, a non-functional music player in the shape of Spotify (with the Spicetify colors of the real setup) pretending to play BLACKPINK, and workspace 3 shows a staged Claude Code session that explains a piece of code "as if I were a donkey". Both can be closed and reopened from the launcher.
- **Workspace transitions**: switching workspaces slides the whole desktop (icons and windows) sideways, as Hyprland does, while the wallpaper stays still.
- **File manager**: back/forward history, breadcrumbs, sidebar places, grid and list views, metadata in the status bar, and keyboard navigation.
- **Terminal**: a playground for fun commands. For now it only has `help`; new commands are added in one place (see below). It keeps a command history (arrow keys) and completes command names with Tab.
- **Viewers**: project pages, plain text files, About, Contact and a shortcuts reference.
- **Launcher**: a Rofi-style search over apps and files (Alt+Space).
- **Persistence**: icon positions, wallpaper choice, view mode and recent files are stored locally. Missing, corrupted or outdated data falls back to defaults, and the site works without storage.
- **Accessibility**: visible focus states, keyboard access throughout, ARIA labels, `prefers-reduced-motion` support, a skip link to the simple view, and full-screen windows on small screens.

## Tech stack

- [React](https://react.dev) 19 and [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) for development and builds
- CSS Modules with design tokens in `src/styles/tokens.css`
- [Lucide](https://lucide.dev) icons
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via Fontsource
- [Vitest](https://vitest.dev) for unit tests

There are no state-management, routing or drag-and-drop libraries. The window manager is a `useReducer`, and dragging uses Pointer Events.

## Getting started

Requirements: Node.js 20.19+ or 22.12+ (required by Vite 8) and pnpm (npm works as well).

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

Other scripts:

| Command          | Purpose                                        |
| ---------------- | ---------------------------------------------- |
| `pnpm build`     | Type-check and create a production build in `dist/` |
| `pnpm preview`   | Serve the production build locally             |
| `pnpm typecheck` | Run the TypeScript compiler only               |
| `pnpm test`      | Run the unit tests                             |

## Project structure

```text
src/
├── content/      Personal data and projects (the only files to edit for content)
├── fs/           Virtual file system generated from content/, plus path helpers
├── wm/           Window manager: reducer, provider, window frame, shortcuts
├── desktop/      Wallpaper, desktop icons and their layout helpers
├── bar/          Top bar modules (workspaces, tasks, tray, clock, session menu)
├── apps/         Internal applications, one folder each, plus the app registry
├── terminal/     Command parser, command table and completion
├── launcher/     Rofi-style launcher
├── shell/        Desktop-wide services: notifications, launcher state, simple view
├── simple/       Linear, conventional version of the portfolio
├── prefs/        Local preferences with validation
├── ui/           Shared UI pieces (context menu, error boundary, icons)
├── lib/          Small utilities (safe external links, pointer tracking)
└── styles/       Design tokens and global styles
public/
└── wallpaper/    Wallpaper in AVIF and WebP
```

## Architecture

- **Content is data.** `src/content` holds the profile, contacts and projects. `src/fs/vfs.ts` turns them into a virtual directory tree under `/home/visitante`, read by the file manager and the launcher, and into the list of desktop icons (`desktopEntries`). A change in `content/` shows up everywhere.
- **One window manager.** `src/wm/windowReducer.ts` is a pure reducer that owns every window's position, size, workspace, minimized and maximized state, and the stacking order (`stack`, from which z-indexes are derived). Components never position windows themselves. State and actions are exposed through separate contexts, so app content does not re-render while a window is dragged.
- **Apps are registered, not hard-wired.** `src/apps/registry.ts` declares each app's name, icon, default size, title, and whether it is single-instance. Apps are code-split with `React.lazy` and downloaded on first use. Each window has its own error boundary, so one failing app does not take down the desktop.
- **A single way to open things.** `useOpener` decides which app handles a path or desktop item (folder, text, project, app or external link). The desktop, file manager and launcher all use it.
- **Workspace transitions without re-mounting.** `src/wm/WorkspaceStage.tsx` takes a static DOM copy of the leaving workspace right before React commits the change (`getSnapshotBeforeUpdate`), then slides that copy out and the live desktop in with the Web Animations API. Real windows are never re-mounted, so they keep their state.
- **The terminal is not a shell.** Input is tokenized and the first word is looked up in a fixed command table. No input is ever evaluated.

## Adding a project

Add an object to the `projects` array in `src/content/projects.ts`:

```ts
{
  slug: 'my-project',               // file name and terminal argument
  name: 'My Project',
  summary: 'One paragraph describing what it is.',
  goal: 'Why it exists.',           // optional
  status: 'em-desenvolvimento',     // or 'concluido' | 'pausado'
  technologies: [{ area: 'Backend', items: ['Java', 'Spring Boot'] }],
  features: ['What already works.'],
  notYet: ['What is planned but not built.'],             // optional
  screenshots: [{ src: 'projects/my-project/home.webp', alt: 'Home screen' }], // optional, files in public/
  repository: { url: 'https://github.com/user/repo', private: false },
  demoUrl: 'https://example.com',   // optional
}
```

The project then appears as a desktop icon and in `~/Projetos`, `~/Repositorios`, the launcher and the simple view. Optional fields that are left out are not rendered.

## Adding a terminal command

Add an entry to `commands` in `src/terminal/commands.tsx`:

```tsx
hello: {
  usage: 'hello [name]',
  summary: 'says hello',
  run: (args) => ({ output: `Hello, ${args[0] ?? 'visitor'}!` }),
},
```

It is listed by `help` and completed with Tab automatically. Return `{ output, error: true }` to print an error.

## Changing personal information

- `src/content/profile.ts`: name, location, biography, technologies and hobbies. The optional `education` and `goals` sections are shown only when filled in.
- `src/content/contacts.ts`: contact channels. Only `https:` and `mailto:` links are accepted. Anything else is not rendered as a link.
- `index.html`: page title, meta description and the `<noscript>` fallback.

## Build and deployment

`pnpm build` writes a static site to `dist/`. Asset URLs are relative (`base: './'` in `vite.config.ts`), so the output works from a domain root or a sub-path such as a GitHub Pages project site.

To publish on GitHub Pages, upload the contents of `dist/` with the official `actions/upload-pages-artifact` and `actions/deploy-pages` actions, or push it to a `gh-pages` branch. Any static host (Netlify, Vercel, Cloudflare Pages) works with build command `pnpm build` and output directory `dist`.

With the Vercel CLI, the framework (Vite) is detected automatically:

```bash
npx vercel deploy --prod   # build on Vercel and publish to the production URL
```

`.vercelignore` keeps `node_modules` and `dist` out of the upload. Production URLs are public; per-deployment preview URLs require a Vercel login under the default Deployment Protection.

The site needs no server-side code, environment variables or secrets.

## Known limitations

- Browsers do not receive the Super key reliably, so Alt takes its place. Some Alt combinations may be captured by the operating system or the browser on certain platforms. Every action is also available with the mouse.
- Workspace shortcuts use Ctrl+Alt+number to avoid the browser's own tab shortcuts.
- The status modules (Bluetooth, network, battery, volume) are decorative. The network label follows `navigator.onLine`, and the battery uses the Battery Status API where available (Chromium).
- The virtual file system is read-only, and window layouts are not restored after a reload. Only desktop preferences persist.
- The terminal does not navigate the file system; it only runs the commands in its table.
- No résumé or contact channel other than GitHub is included yet (`~/Contato/contato.txt` is intentionally empty).
- Falsefy plays no audio and the Claude session is fixed text; nothing is sent to any service.

## Credits

- Desktop configuration recreated from my own Hyprland, Waybar, Ghostty, Starship, Rofi and fastfetch setup.
- Wallpaper: third-party fan art used as a temporary placeholder. The artist's signature is on the image. The image will be replaced or properly credited before public release.
- Icons: [Lucide](https://lucide.dev) (ISC License).
- Font: [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) (SIL Open Font License 1.1), distributed through [Fontsource](https://fontsource.org).
