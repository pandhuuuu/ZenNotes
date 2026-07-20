---
name: ZenNotes
colors:
  surface: '#0f1417'
  surface-dim: '#0f1417'
  surface-bright: '#353a3d'
  surface-container-lowest: '#0a0f12'
  surface-container-low: '#171c1f'
  surface-container: '#1b2023'
  surface-container-high: '#262b2e'
  surface-container-highest: '#313539'
  on-surface: '#dfe3e7'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#dfe3e7'
  inverse-on-surface: '#2c3134'
  outline: '#909097'
  outline-variant: '#46464c'
  surface-tint: '#c0c6de'
  primary: '#c0c6de'
  on-primary: '#2a3043'
  primary-container: '#020617'
  on-primary-container: '#72778d'
  inverse-primary: '#585e73'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#4de082'
  on-tertiary: '#003919'
  tertiary-container: '#000902'
  on-tertiary-container: '#008a46'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1fb'
  primary-fixed-dim: '#c0c6de'
  on-primary-fixed: '#151b2d'
  on-primary-fixed-variant: '#40465a'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#6dfe9c'
  tertiary-fixed-dim: '#4de082'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#0f1417'
  on-background: '#dfe3e7'
  surface-variant: '#313539'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.8'
    letterSpacing: '0'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 800px
  gutter: 32px
  margin-mobile: 24px
  margin-desktop: 64px
---

## Brand & Style

This design system is built on the philosophy of **Digital Silence**. It targets individuals seeking a distraction-free environment for deep thought and reflection. The visual narrative is defined by **Minimalism** and **Atmospheric Dark Mode**, prioritizing content over container.

The interface should feel "airlight"—as if the text is floating in a void. We achieve this by eliminating unnecessary structural lines, borders, and heavy decorative elements. The emotional response is one of calm, focus, and clarity. The aesthetic leans into a modern "Technical Zen" look, blending the precision of developer tools with the elegance of high-end editorial design.

## Colors

The palette is monochromatic and deep, designed to minimize eye strain and maximize focus.

- **Background (Primary):** Slate-950 (`#020617`). This is the foundation of the entire UI.
- **Primary Text:** Slate-100 (`#f1f5f9`). High contrast for legibility but soft enough to avoid "glow" fatigue.
- **Secondary Text:** Slate-400 (`#94a3b8`). Used for metadata, labels, and less important information.
- **Accent/Status:** Green-400 (`#4ade80`). Reserved strictly for functional feedback like cloud synchronization status or "Save" confirmations.

Avoid using pure black (`#000000`) or pure white (`#ffffff`) to maintain a sophisticated, soft-matte appearance.

## Typography

The typography strategy employs a "Functional Contrast" pairing. We use **Geist** for structural elements (navigation, headers) to provide a modern, clean sans-serif feel, and **JetBrains Mono** for the actual journaling experience. The monospaced nature of the body text evokes the intentionality of a typewriter while maintaining modern readability.

Line height for body text is intentionally generous (1.8x) to create a rhythmic, breathable reading experience. Headlines use tighter tracking and leading to feel grounded and architectural.

## Layout & Spacing

The layout follows a **Fixed-Width Centered** model for the primary writing area to mimic the proportions of a physical page. 

- **The Writing Column:** Max-width of 800px, centered horizontally. This prevents line lengths from becoming too long for comfortable reading.
- **Safe Margins:** On desktop, use a minimum of 64px outer margins. On mobile, drop to 24px.
- **The "No-Border" Rule:** Spacing is the only divider. Do not use horizontal rules or vertical lines to separate the sidebar from the content; use significant whitespace (64px+) instead.
- **Rhythm:** Use an 8px base grid. All padding and margins must be multiples of 8.

## Elevation & Depth

This design system rejects traditional shadows. Hierarchy is achieved through **Tonal Layers** and **Negative Space**.

- **Level 0 (Surface):** Slate-950. The base for all content.
- **Level 1 (Subtle Overlay):** Slate-900 (applied with 0.5 opacity). Used only for transient elements like context menus or dropdowns.
- **Depth via Blur:** When a modal or menu appears, the content behind it receives a heavy backdrop-blur (20px) rather than a dark overlay, maintaining the "ethereal" feel of the dark mode.
- **No Borders:** Elements should never have a 1px border. If a boundary is required, use a subtle 1px "ghost outline" using Slate-800 at 50% opacity.

## Shapes

The shape language is **Soft (Level 1)**. While the design is minimalist, sharp 0px corners feel too aggressive for a wellness/journaling app. 

- Use `0.25rem` (4px) for small interactive elements like buttons or checkboxes.
- Use `0.5rem` (8px) for larger container-like elements like menus or popovers.
- The goal is to make the interface feel precise and engineered, yet approachable.

## Components

### Buttons & Interaction
Buttons are purely text-based or use a subtle Slate-900 background. The "Primary" action is signaled by Slate-100 text. Hover states should trigger a subtle shift in text opacity (from 1.0 to 0.7) rather than a background color change.

### The Cursor (Custom Component)
In the writing area, the cursor should be a thin block or a Slate-400 vertical line that pulses slowly (2s duration) rather than flashes, reinforcing the "Zen" atmosphere.

### Input Fields
Input fields have no background and no bottom border. They are identified by their label and a placeholder in Slate-500. Upon focus, the text simply turns to Slate-100.

### Lists
Note lists are "borderless." Each list item is separated by 16px of vertical space. Metadata (date/tags) is tucked under the title in `label-sm` (Slate-400).

### Status Indicators
The "Sync" status is a small 6px circle. It is Slate-800 when idle and Green-400 when active/success. No text label is necessary unless the user hovers over the icon.

### Cards
Avoid traditional cards. Group content using headers and white space. If a "card" is required for a dashboard view, use a slight tonal shift to Slate-900 with no border or shadow.