# ScrollQ

Lightweight, dependency-free scroll animations using the Intersection Observer API. Simple, performant, and highly customizable.

## Features

- 🪶 **Lightweight** - No dependencies, 1.6KB JS + 1.5KB CSS minified (~1.2KB total gzipped)
- ⚡ **Performant** - Uses native Intersection Observer API
- 🎨 **Flexible** - 10 animation variants with full customization
- 🎯 **Smart** - Auto-detects animation direction for offsets
- 📱 **Responsive** - Works on all modern browsers
- ♿ **Accessible** - Respects `prefers-reduced-motion`

## Quick Start

### 1. Include the files

**Via npm:**

```bash
npm install scrollq
```

**Usage (production - minified):**

```html
<link rel="stylesheet" href="node_modules/scrollq/dist/scrollQ.min.css" />
<script type="module">
  import { initScrollQ } from "scrollq";
  initScrollQ();
</script>
```

**Development (unminified):**

```html
<link rel="stylesheet" href="node_modules/scrollq/dist/scrollQ.css" />
<script type="module">
  import { initScrollQ } from "scrollq";
  initScrollQ();
</script>
```

**Configuration:**

```html
<script type="module">
  import { initScrollQ } from "scrollq";

  // With global config
  initScrollQ({
    threshold: 0.5, // Default threshold for all elements
    rootMargin: "-50px", // Default rootMargin for all elements
    reverse: false, // Default reverse behavior for all elements
    selector: "[data-q]", // Custom selector (optional)
  });
</script>
```

### 2. Add animations

```html
<div data-q="fade-up">This fades in from below as you scroll</div>
```

### 3. Cleanup (for SPAs)

```html
<script type="module">
  import { initScrollQ, destroyScrollQ } from "./scrollQ.js";

  // Initialize
  const cleanup = initScrollQ();

  // Clean up when component unmounts or page changes
  cleanup(); // or destroyScrollQ();
</script>
```

## Available Animations

### Fade Variants (opacity + movement)

- `fade` - Simple fade in
- `fade-up` - Fade in from below
- `fade-down` - Fade in from above
- `fade-left` - Fade in from right
- `fade-right` - Fade in from left
- `scale` - Fade + scale up from 90%

### Slide Variants (movement only, no fade)

- `slide-up` - Slide in from below
- `slide-down` - Slide in from above
- `slide-left` - Slide in from right
- `slide-right` - Slide in from left

## Customization

### Per-Element Options

```html
<div
  data-q="fade-up"
  data-q-threshold="0.3"
  data-q-offset="-100px"
  data-q-from="5rem"
  data-q-duration="1s"
  data-q-easing="ease-in-out"
  data-q-delay="200"
  data-q-reverse="true">
  Fully customized animation
</div>
```

#### Attributes

| Attribute          | Default    | Description                                                      |
| ------------------ | ---------- | ---------------------------------------------------------------- |
| `data-q`           | -          | Animation type (required)                                        |
| `data-q-threshold` | `0.6`      | Trigger when X% visible (0.0-1.0)                                |
| `data-q-offset`    | `-40px`    | Offset from bottom of viewport (supports %, px, vh, rem)         |
| `data-q-from`      | `7rem`     | Animation distance (any CSS unit)                                |
| `data-q-duration`  | `0.6s`     | Animation duration                                               |
| `data-q-easing`    | `ease-out` | Timing function                                                  |
| `data-q-delay`     | -          | Delay in milliseconds                                            |
| `data-q-reverse`   | `false`    | Reverse animation when scrolling up (only deactivates on scroll) |

### Global Defaults

Customize defaults via CSS variables:

```css
:root {
  --q-duration: 0.8s;
  --q-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --q-from-y: 5rem;
  --q-from-x: 5rem;
}
```

## Examples

### Trigger at Middle of Viewport

```html
<!-- Negative offset shrinks the trigger area -->
<div data-q="fade-up" data-q-offset="-50%">Triggers at middle of viewport</div>
```

### Staggered List

```html
<ul>
  <li data-q="fade-up" data-q-delay="100">First</li>
  <li data-q="fade-up" data-q-delay="200">Second</li>
  <li data-q="fade-up" data-q-delay="300">Third</li>
</ul>
```

### Trigger Earlier

```html
<!-- Trigger 200px before entering viewport -->
<div data-q="slide-up" data-q-offset="-200px">Early animation</div>
```

### Custom Distance with Percentage

```html
<div data-q="fade-up" data-q-from="50%">Slides from 50% of its own height</div>
```

### Reversing Animations

```html
<!-- Reverse when scrolling up past the element -->
<div data-q="scale" data-q-reverse>Scales up on scroll down, reverses on scroll up</div>

<!-- You can also use explicit true/false -->
<div data-q="scale" data-q-reverse="true">Same behavior</div>

<!-- Override global reverse setting on specific elements -->
<div data-q="fade-up" data-q-reverse="false">Won't reverse even if global reverse is true</div>
```

**How Reverse Works:**

- Elements animate when entering from the **bottom** (scrolling down)
- Elements reverse when **scrolling up** and no longer intersecting
- Elements **won't animate** when reaching the top of the viewport
- This creates smooth, predictable behavior without animation flickering

### Global Reverse Mode

Make all animations reversible by default:

```javascript
// All animations will now reverse on scroll out
initScrollQ({ reverse: true });
```

```html
<!-- This will reverse (uses global setting) -->
<div data-q="fade-up">Reverses on scroll</div>

<!-- Override to disable reverse on specific element -->
<div data-q="fade-up" data-q-reverse="false">Only animates once</div>
```

## Browser Support

Works in all modern browsers that support Intersection Observer:

- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

For older browsers, consider using the [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill).

## How It Works

ScrollQ uses the Intersection Observer API to watch elements as they enter the viewport. When an element becomes visible (based on your threshold setting), it adds the `q-active` class, triggering CSS transitions.

**Scroll Direction Behavior:**

- **Animations trigger when scrolling DOWN** - Elements animate when they enter from the bottom of the viewport
- **Reverse animations when scrolling UP** - With `data-q-reverse` enabled, animations reverse only when scrolling upward
- **Elements at the top don't re-trigger** - Once scrolled past, elements at the top won't animate again unless you scroll back down

**Smart Features:**

- **Auto-detects axes**: `data-q-from` automatically applies to Y-axis for up/down animations, X-axis for left/right
- **Flexible offsets**: `data-q-offset` applies to bottom edge of viewport, supports %, px, vh, rem
- **Performance**: Shares observers for elements with same settings, automatically unobserves after animation (unless `reverse` is enabled)
- **Accessibility**: Respects `prefers-reduced-motion` - animations are disabled for users who prefer reduced motion
- **Memory safe**: Provides cleanup methods for single-page applications

## Tips

### Bottom of Page Elements

For elements near the bottom of the page, use a lower threshold or positive offset:

```html
<footer data-q="fade-up" data-q-threshold="0.2">Triggers when only 20% visible</footer>
```

### Large Animation Distances

When using large `data-q-from` values (like `50%`), you may need to adjust the threshold:

```html
<div data-q="slide-up" data-q-from="50%" data-q-threshold="0.3">Works better with lower threshold</div>
```

### Respecting User Preferences

The CSS automatically respects `prefers-reduced-motion` - users who prefer reduced motion will see content immediately without animations:

```css
@media (prefers-reduced-motion: reduce) {
  [data-q] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

### Single Page Applications

For SPAs, clean up observers when components unmount:

```javascript
import { initScrollQ } from "./scrollQ.js";

// Initialize and store cleanup function
const cleanup = initScrollQ();

// Later, when component unmounts
cleanup();

// Or use destroyScrollQ() to clean up all instances
import { destroyScrollQ } from "./scrollQ.js";
destroyScrollQ();
```

## Development

### Project Structure

```
scrollq/
├── src/
│   ├── scrollQ.js          # Source JavaScript
│   └── scrollQ.css         # Source CSS
├── dist/
│   ├── scrollQ.js          # Built (copied) JS
│   ├── scrollQ.css         # Built (copied) CSS
│   ├── scrollQ.min.js      # Minified JS
│   └── scrollQ.min.css     # Minified CSS
├── demo/
│   └── index.html          # Demo page (not published)
└── package.json
```

### Building

The build process copies source files to `dist/` and creates minified versions using [Terser](https://terser.org/) for JavaScript and [Lightning CSS](https://lightningcss.dev/) for CSS.

```bash
# Install dependencies
npm install

# Build all files (copy + minify)
npm run build

# Or build individually
npm run build:js      # Copy src/scrollQ.js → dist/scrollQ.js
npm run build:css     # Copy src/scrollQ.css → dist/scrollQ.css
npm run minify:js     # Create dist/scrollQ.min.js
npm run minify:css    # Create dist/scrollQ.min.css
```

The `prepublishOnly` script automatically runs the full build before publishing to npm.

### File Sizes

| File                 | Size      |
| -------------------- | --------- |
| src/scrollQ.js       | 6.0KB     |
| dist/scrollQ.min.js  | **1.6KB** |
| src/scrollQ.css      | 3.7KB     |
| dist/scrollQ.min.css | **1.5KB** |
| **Total (minified)** | **3.1KB** |

## License

MIT License - feel free to use in personal and commercial projects.

## Credits

Created by Kevin Terry

Inspired by [AOS](https://github.com/michalsnik/aos) and the need for a super simple, modern scroll animation solution.
