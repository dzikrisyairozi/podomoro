# UI/UX Spec — Issue #2
## Podomoro: Timer, Header, and Session List

---

## 1. Design Decisions (Concrete Choices)

**Progress indicator: Circular ring**
A circular SVG progress ring centered beneath the mode label and above the timer digits. A ring keeps the timer digits visually dominant and avoids the horizontal space constraints a bar imposes on narrow viewports.

**Dark-mode toggle cycle: light ↔ dark (two-state only)**
System preference is respected on first load (if no saved preference exists) but the toggle itself only switches between `"light"` and `"dark"`. A three-state cycle adds UI complexity (a third icon state, a third label) that is not justified for a focused timer app. The value stored in `localStorage['podomoro:theme']` is `"light"` or `"dark"`; on first visit when no key exists, the inline script reads `prefers-color-scheme` to set the initial class.

---

## 2. Color Palette

All tokens are from the default Tailwind CSS palette.

| Role | Light mode | Dark mode |
|------|-----------|-----------|
| Page background | `bg-neutral-50` | `dark:bg-neutral-950` |
| Surface (header, card) | `bg-white` | `dark:bg-neutral-900` |
| Border | `border-neutral-200` | `dark:border-neutral-800` |
| Body text (primary) | `text-neutral-900` | `dark:text-neutral-100` |
| Body text (muted) | `text-neutral-500` | `dark:text-neutral-400` |
| **Focus mode accent** | `text-rose-600`, `bg-rose-600` | `dark:text-rose-400`, `dark:bg-rose-500` |
| Focus ring stroke | `stroke-rose-600` | `dark:stroke-rose-400` |
| **Break mode accent** | `text-teal-600`, `bg-teal-600` | `dark:text-teal-400`, `dark:bg-teal-500` |
| Break ring stroke | `stroke-teal-600` | `dark:stroke-teal-400` |
| Ring track (background) | `stroke-neutral-200` | `dark:stroke-neutral-700` |
| Success (session complete) | `text-emerald-600` | `dark:text-emerald-400` |
| Focus accent for UI rings | `ring-rose-500` | `dark:ring-rose-400` |
| Destructive / reset | `text-neutral-500` | `dark:text-neutral-400` |

---

## 3. Layout Structure

### ASCII Sketch — Mobile (< 640px)

```
┌─────────────────────────────────────┐
│ HEADER                              │
│  Podomoro          [debug] [☀/☾]   │
├─────────────────────────────────────┤
│ MAIN                                │
│                                     │
│   ┌── mode label ──┐                │
│         Focus                       │
│   └────────────────┘                │
│                                     │
│        ╭──────────╮                 │
│       ╱            ╲                │
│      │   25:00       │              │
│       ╲            ╱                │
│        ╰──────────╯                 │
│                                     │
│   [ Focus (25m) ] [ Break (5m) ]    │
│                                     │
│        [ ▶  Start ]                 │
│           [ Reset ]                 │
│                                     │
├─────────────────────────────────────┤
│ TODAY'S SESSIONS                    │
│  No sessions yet today.             │
│  Start one!                         │
└─────────────────────────────────────┘
```

### ASCII Sketch — Desktop (≥ 1024px)

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER                                                         │
│  Podomoro                              [Debug: 5s]  [☀/☾]    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│            MAIN (centered, max-w-md)       SESSIONS PANEL     │
│                                            (right side)        │
│   Focus                                   Today's Sessions     │
│                                           ─────────────────── │
│        ╭──────────────╮                   09:12  Focus  25m   │
│       ╱                ╲                  08:45  Break   5m   │
│      │    25:00          │                08:20  Focus  25m   │
│       ╲                ╱                                       │
│        ╰──────────────╯                                        │
│                                                                │
│  [ Focus (25m) ]  [ Break (5m) ]                               │
│                                                                │
│          [ ▶  Start ]                                          │
│             [ Reset ]                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Component Tree

```
<html class="dark?"> (class toggled by inline script + JS)
  <body class="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased">
    <Header />                          ← fixed top bar
    <main class="flex flex-col lg:flex-row lg:items-start lg:justify-center gap-8 px-4 py-8 lg:px-8 lg:py-12 max-w-5xl mx-auto">
      <TimerSection />                  ← grows, centered
      <SessionList />                   ← sidebar on desktop, stacked below on mobile
    </main>
  </body>
</html>
```

---

## 4. Header

### Structure

```
<header class="sticky top-0 z-10 flex items-center justify-between px-4 py-3 lg:px-8
               bg-white dark:bg-neutral-900
               border-b border-neutral-200 dark:border-neutral-800
               shadow-sm">

  <!-- Wordmark (left) -->
  <span class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100
               select-none">
    Podomoro
  </span>

  <!-- Controls (right) -->
  <div class="flex items-center gap-3">

    <!-- Debug toggle pill -->
    <button
      aria-label="Toggle debug mode"
      aria-pressed="false"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium
             border border-neutral-300 dark:border-neutral-700
             text-neutral-600 dark:text-neutral-400
             bg-neutral-100 dark:bg-neutral-800
             hover:bg-neutral-200 dark:hover:bg-neutral-700
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
             focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
             transition-colors duration-150 cursor-pointer">
      Normal: 25m/5m
      <!-- When aria-pressed="true", label becomes "Debug: 5s" and pill gets accent bg -->
      <!-- aria-pressed="true" state adds: bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 -->
    </button>

    <!-- Dark mode toggle -->
    <button
      aria-label="Switch to dark mode"   <!-- updates to "Switch to light mode" when dark -->
      class="inline-flex items-center justify-center w-9 h-9 rounded-md
             text-neutral-600 dark:text-neutral-400
             hover:bg-neutral-100 dark:hover:bg-neutral-800
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
             focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
             transition-colors duration-150 cursor-pointer">
      <!-- Sun icon (shown in dark mode, clicking switches to light) -->
      <!-- Moon icon (shown in light mode, clicking switches to dark) -->
      <span class="sr-only">Toggle theme</span>
    </button>

  </div>
</header>
```

### Header States

| State | Visual |
|-------|--------|
| Default | As above |
| Debug pill inactive | `Normal: 25m/5m`, neutral pill |
| Debug pill active | `Debug: 5s`, `bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700` |
| Theme toggle hover | Icon button gets `bg-neutral-100 dark:hover:bg-neutral-800` |
| Theme toggle focused | `ring-2 ring-rose-500 dark:ring-rose-400 ring-offset-2` |

---

## 5. Timer Display

### Structure

```
<section class="flex flex-col items-center gap-6 w-full max-w-md mx-auto">

  <!-- Mode label (live region for screen readers) -->
  <p
    aria-live="polite"
    aria-atomic="true"
    class="text-sm font-semibold uppercase tracking-widest
           text-rose-600 dark:text-rose-400">
    <!-- Renders "Focus" or "Break" — color changes with mode -->
    <!-- Break mode: text-teal-600 dark:text-teal-400 -->
    Focus
  </p>

  <!-- Progress ring + timer digits -->
  <div class="relative flex items-center justify-center w-64 h-64 lg:w-72 lg:h-72">

    <!-- SVG ring (decorative, aria-hidden) -->
    <svg
      aria-hidden="true"
      class="absolute inset-0 w-full h-full -rotate-90"
      viewBox="0 0 120 120">
      <!-- Track circle -->
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke-width="6"
        class="stroke-neutral-200 dark:stroke-neutral-700" />
      <!-- Progress arc — stroke-dasharray and stroke-dashoffset driven by JS -->
      <circle
        cx="60" cy="60" r="54"
        fill="none"
        stroke-width="6"
        stroke-linecap="round"
        class="stroke-rose-600 dark:stroke-rose-400 transition-all duration-500"
        <!-- Break mode: stroke-teal-600 dark:stroke-teal-400 -->
        stroke-dasharray="339.29"
        stroke-dashoffset="0" />  <!-- 0 = full; 339.29 = empty; formula: 2πr = 339.29 -->
    </svg>

    <!-- Timer digits -->
    <span
      aria-label="25 minutes 0 seconds remaining"   <!-- updated by JS each second -->
      class="relative z-10 tabular-nums font-mono
             text-7xl lg:text-8xl font-bold
             text-neutral-900 dark:text-neutral-100
             tracking-tight leading-none select-none">
      25:00
    </span>

  </div>

</section>
```

### Ring geometry

- `r = 54`, so circumference `= 2 * π * 54 ≈ 339.29`
- `stroke-dashoffset` is calculated as: `339.29 * (1 - progress)` where progress is `0.0` (empty) to `1.0` (full)
- At start of a Focus session: `stroke-dashoffset = 0` (ring fully filled)
- As time elapses the offset increases toward `339.29`

### Timer States

| State | Ring | Digits | Mode label |
|-------|------|--------|------------|
| Idle | Full ring, accent color | Static `MM:SS` | "Focus" (or "Break") in accent color |
| Running | Animates down each second | Counting down | Same |
| Paused | Frozen at current arc | Frozen digits | Same, no change |
| Completed | Empty ring (offset = 339.29) | `00:00` | Flash "Done!" then resets — `text-emerald-600 dark:text-emerald-400` |

---

## 6. Controls

### Mode Switch (segmented control)

```
<div
  role="group"
  aria-label="Timer mode"
  class="flex rounded-lg border border-neutral-200 dark:border-neutral-800
         bg-neutral-100 dark:bg-neutral-800 p-1 gap-1">

  <!-- Focus segment (active) -->
  <button
    aria-pressed="true"
    class="flex-1 rounded-md px-4 py-2 text-sm font-medium
           bg-white dark:bg-neutral-700
           text-rose-600 dark:text-rose-400
           shadow-sm
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
           focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
           transition-colors duration-150">
    Focus (25m)
  </button>

  <!-- Break segment (inactive) -->
  <button
    aria-pressed="false"
    class="flex-1 rounded-md px-4 py-2 text-sm font-medium
           text-neutral-500 dark:text-neutral-400
           hover:text-neutral-700 dark:hover:text-neutral-300
           hover:bg-neutral-200 dark:hover:bg-neutral-700/60
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
           focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
           transition-colors duration-150">
    Break (5m)
  </button>

</div>
```

When Break is active, swap which segment gets the elevated white/dark-700 bg and the accent text. The Break active segment uses `text-teal-600 dark:text-teal-400` instead of rose.

### Primary Button (Start / Pause)

```
<button
  aria-label="Start timer"   <!-- changes to "Pause timer" when running -->
  data-testid="start-pause-button"
  class="inline-flex items-center justify-center gap-2
         w-full max-w-xs rounded-lg px-6 py-3 text-base font-semibold
         bg-rose-600 text-white
         hover:bg-rose-700
         active:bg-rose-800
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
         focus-visible:ring-rose-500
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-150
         dark:bg-rose-500 dark:hover:bg-rose-600 dark:active:bg-rose-700
         dark:focus-visible:ring-rose-400">
  <!-- Play icon + "Start" text | Pause icon + "Pause" text -->
  Start
</button>
```

Break mode primary button uses teal: `bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 focus-visible:ring-teal-500 dark:focus-visible:ring-teal-400`

### Secondary Button (Reset)

```
<button
  aria-label="Reset timer"
  data-testid="reset-button"
  class="inline-flex items-center justify-center gap-2
         w-full max-w-xs rounded-lg px-6 py-3 text-base font-medium
         bg-transparent text-neutral-500 dark:text-neutral-400
         border border-neutral-300 dark:border-neutral-700
         hover:bg-neutral-100 dark:hover:bg-neutral-800
         hover:text-neutral-700 dark:hover:text-neutral-300
         active:bg-neutral-200 dark:active:bg-neutral-700
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
         focus-visible:ring-rose-500 dark:focus-visible:ring-rose-400
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-150">
  Reset
</button>
```

### Button States Summary

| State | Start/Pause (Focus) | Reset |
|-------|--------------------|----|
| Default | `bg-rose-600 text-white` | `border-neutral-300 text-neutral-500` |
| Hover | `hover:bg-rose-700` | `hover:bg-neutral-100 hover:text-neutral-700` |
| Active (pressed) | `active:bg-rose-800` | `active:bg-neutral-200` |
| Focus-visible | `ring-2 ring-rose-500 ring-offset-2` | `ring-2 ring-rose-500 ring-offset-2` |
| Disabled | `opacity-50 cursor-not-allowed` | `opacity-50 cursor-not-allowed` |
| Loading | Spinner replaces icon, text hidden via `sr-only`, `aria-busy="true"` on button | N/A |

### Controls Layout

```
<div class="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
  <!-- Mode segmented control — full width -->
  <div ...>...</div>
  <!-- Primary button — full width -->
  <button ...>Start</button>
  <!-- Reset — full width -->
  <button ...>Reset</button>
</div>
```

---

## 7. Today's Sessions List

### Container

```
<aside
  aria-label="Today's sessions"
  class="w-full lg:w-72 lg:flex-shrink-0">

  <h2 class="text-sm font-semibold uppercase tracking-widest
             text-neutral-500 dark:text-neutral-400 mb-3">
    Today's Sessions
  </h2>

  <ul
    data-testid="session-list"
    class="flex flex-col gap-2">

    <!-- Session item (repeated) -->
    <li class="flex items-center justify-between
               rounded-lg border border-neutral-200 dark:border-neutral-800
               bg-white dark:bg-neutral-900
               px-4 py-3 text-sm shadow-sm">

      <!-- Left: mode badge + time -->
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-full px-2 py-0.5
                     text-xs font-medium
                     bg-rose-100 text-rose-700
                     dark:bg-rose-900/40 dark:text-rose-300">
          <!-- "Focus" badge — Break badge uses teal -->
          <!-- Break: bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 -->
          Focus
        </span>
        <time class="text-neutral-500 dark:text-neutral-400 tabular-nums">
          09:12
        </time>
      </div>

      <!-- Right: duration -->
      <span class="text-neutral-700 dark:text-neutral-300 tabular-nums font-medium">
        25m
      </span>

    </li>

  </ul>

</aside>
```

### Empty State

```
<li class="flex flex-col items-center justify-center
           rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700
           bg-transparent px-4 py-8 text-center">
  <p class="text-sm text-neutral-500 dark:text-neutral-400">
    No sessions yet today.
  </p>
  <p class="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
    Start one!
  </p>
</li>
```

### Session List States

| State | Visual |
|-------|--------|
| Empty | Dashed border card, muted two-line message |
| Populated | Vertical list of session items, newest at top |
| Focus session item | Rose badge |
| Break session item | Teal badge |
| Loading (initial fetch) | Three skeleton rows: `animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg h-12` |

---

## 8. Dark Mode: Flash-Prevention Inline Script

Place this as the **first child of `<head>`**, before any stylesheets. In Next.js 14 App Router this goes inside `app/layout.tsx` as a `<script>` tag with `dangerouslySetInnerHTML`.

```html
<script
  dangerouslySetInnerHTML={{
    __html: `
(function () {
  try {
    var stored = localStorage.getItem('podomoro:theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // No preference stored — respect OS preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (e) {}
})();
    `,
  }}
/>
```

**How the toggle works at runtime:**
1. Read current `<html>` class: if it contains `"dark"`, switch to light; otherwise switch to dark.
2. Write new value (`"light"` or `"dark"`) to `localStorage['podomoro:theme']`.
3. Add or remove `"dark"` class on `document.documentElement`.
4. Update the button's `aria-label` to match the next action ("Switch to dark mode" / "Switch to light mode").

The `<html>` element already has `suppressHydrationWarning` in the scaffold — this prevents React from complaining about the class mismatch introduced by the inline script.

---

## 9. Responsive Behavior

### Mobile (< 640px)

- Single-column layout, `flex-col`, `px-4`
- Timer ring: `w-64 h-64` (256px diameter)
- Timer digits: `text-7xl`
- Mode segmented control: full width, stacked above primary button
- Session list appears below the controls section, full-width
- Header debug pill: shows abbreviated label if needed (keep "Debug: 5s" / "Normal")

### Tablet (640px – 1023px)

- Same single-column layout as mobile
- Timer ring: `w-64 h-64`
- Timer digits: `text-7xl`
- Max-width constraint on controls: `max-w-sm mx-auto`
- Session list remains below timer

### Desktop (≥ 1024px)

- Two-column layout: `flex-row`, `items-start`, `gap-8`
- Left column (timer + controls): `flex-col items-center`, grows with `flex-1`
- Right column (session list): fixed width `w-72`, `flex-shrink-0`
- Timer ring: `w-72 h-72` (288px diameter)
- Timer digits: `text-8xl`
- Header padding increases: `px-8`
- Controls column max-width: `max-w-xs` centered within the left column

---

## 10. Accessibility Summary

| Requirement | Implementation |
|------------|----------------|
| Mode label announces changes | `aria-live="polite" aria-atomic="true"` on the `<p>` mode label |
| Timer digits announce remaining time | `aria-label="25 minutes 0 seconds remaining"` updated each second (or on pause/resume) |
| Dark mode toggle | `aria-label` describes the *next* action ("Switch to dark mode") |
| Debug toggle | `aria-label="Toggle debug mode"`, `aria-pressed` reflects current state |
| Mode segmented control | `role="group" aria-label="Timer mode"`, each button has `aria-pressed` |
| Start/Pause button | `aria-label` updates between "Start timer" and "Pause timer" |
| Loading state | `aria-busy="true"` on button while request is in flight |
| All interactive elements | `focus-visible:ring-2 focus-visible:ring-offset-2` with accent ring color |
| Session list | `<aside aria-label="Today's sessions">`, `<ul>` + `<li>` semantic markup |
| SVG ring | `aria-hidden="true"` — purely decorative |
| Color contrast | Rose-600 on white (#e11d48 / #fff) = 4.6:1 ✓ AA; Neutral-900 on neutral-50 = 19:1 ✓ AA |
| Focus order | Follows DOM order: header → mode switch → timer → start → reset → session list |

---

## 11. Typography

| Element | Classes |
|---------|---------|
| Wordmark | `text-lg font-semibold tracking-tight` |
| Mode label | `text-sm font-semibold uppercase tracking-widest` |
| Timer digits | `text-7xl lg:text-8xl font-bold tabular-nums font-mono tracking-tight leading-none` |
| Button text (primary) | `text-base font-semibold` |
| Button text (secondary) | `text-base font-medium` |
| Section heading ("Today's Sessions") | `text-sm font-semibold uppercase tracking-widest` |
| Session item badge | `text-xs font-medium` |
| Session item time / duration | `text-sm tabular-nums` |
| Body / general | Tailwind default sans stack (`font-sans`) |
| Empty state text | `text-sm` |

---

## 12. Motion / Animation (Nice-to-have)

- Timer ring `stroke-dashoffset` transition: `transition-all duration-500 ease-linear` — smooth arc shrink each second.
- Button press: `active:scale-[0.98] transition-transform duration-75` — subtle press feedback.
- Session item entry: `animate-in fade-in slide-in-from-right-2` if Tailwind animate plugin is added; otherwise omit.
- Respect `prefers-reduced-motion`: wrap transitions in a `@media (prefers-reduced-motion: no-preference)` or use the Tailwind `motion-safe:` variant.

---

## 13. Data-testids

The frontend-engineer must add these `data-testid` attributes:

| testid | Element |
|--------|---------|
| `header` | `<header>` |
| `debug-toggle` | Debug pill button |
| `theme-toggle` | Dark mode icon button |
| `mode-label` | Mode `<p>` with `aria-live` |
| `timer-ring` | Outer `<div>` wrapping SVG + digits |
| `timer-digits` | `<span>` showing `MM:SS` |
| `mode-switch` | `role="group"` segmented control div |
| `mode-focus` | Focus segment button |
| `mode-break` | Break segment button |
| `start-pause-button` | Primary CTA button |
| `reset-button` | Reset secondary button |
| `session-list` | `<ul>` inside `<aside>` |
| `session-item` | Each `<li>` (applied to all items) |
| `session-empty` | Empty state `<li>` |

---

## 14. Components to Create

No existing component primitives exist in `app/components/`. The frontend-engineer should create the following components under `app/components/`:

| File | Responsibility |
|------|---------------|
| `app/components/Header.tsx` | Wordmark, debug toggle, theme toggle |
| `app/components/TimerDisplay.tsx` | SVG ring + digits + mode label |
| `app/components/TimerControls.tsx` | Mode segmented control + Start/Pause + Reset |
| `app/components/SessionList.tsx` | Session list, empty state, loading skeleton |
| `app/components/ThemeProvider.tsx` | Reads localStorage on mount, exposes toggle context |

The inline flash-prevention `<script>` lives in `app/app/layout.tsx`, not in any component.
