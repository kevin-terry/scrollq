# ScrollQ

Lightweight, dependency-free scroll animations using the Intersection Observer API. Simple, performant, and highly customizable.

## Features

- 🪶 **Lightweight** - 1.6KB JS + 1.5KB CSS minified
- ⚡ **Performant** - Native Intersection Observer API
- 🎨 **Flexible** - 10 animation variants with full customization
- ♿ **Accessible** - Respects `prefers-reduced-motion`

## Installation

```bash
npm install scrollq
```

## Quick Start

```html
<link rel="stylesheet" href="node_modules/scrollq/dist/scrollQ.min.css" />
<script type="module">
  import { initScrollQ } from "scrollq";
  initScrollQ();
</script>

<!-- Add animations -->
<div data-q="fade-up">Animates on scroll</div>
<div data-q="slide-left" data-q-delay="200">Delayed animation</div>
```

### Configuration

```javascript
initScrollQ({
  threshold: 0.5,      // When element is 50% visible
  rootMargin: "-50px", // Offset trigger area
  reverse: false,      // Enable reverse animations
});
```

### SPA Cleanup

```javascript
const cleanup = initScrollQ();
// Later, when unmounting:
cleanup();
```

## Animations

| Type | Description |
|------|-------------|
| `fade` | Simple fade in |
| `fade-up` | Fade in from below |
| `fade-down` | Fade in from above |
| `fade-left` | Fade in from right |
| `fade-right` | Fade in from left |
| `scale` | Fade + scale up |
| `slide-up` | Slide from below (no fade) |
| `slide-down` | Slide from above (no fade) |
| `slide-left` | Slide from right (no fade) |
| `slide-right` | Slide from left (no fade) |

## Customization

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-q` | - | Animation type (required) |
| `data-q-threshold` | `0.6` | Trigger when X% visible (0.0-1.0) |
| `data-q-offset` | `-40px` | Offset from bottom viewport (%, px, vh, rem) |
| `data-q-from` | `7rem` | Animation distance |
| `data-q-duration` | `0.6s` | Animation duration |
| `data-q-easing` | `ease-out` | Timing function |
| `data-q-delay` | - | Delay in milliseconds |
| `data-q-reverse` | `false` | Reverse on scroll up |

### CSS Variables

```css
:root {
  --q-duration: 0.8s;
  --q-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --q-from-y: 5rem;
  --q-from-x: 5rem;
}
```

## Examples

**Staggered list:**
```html
<ul>
  <li data-q="fade-up" data-q-delay="100">First</li>
  <li data-q="fade-up" data-q-delay="200">Second</li>
  <li data-q="fade-up" data-q-delay="300">Third</li>
</ul>
```

**Trigger at viewport middle:**
```html
<div data-q="fade-up" data-q-offset="-50%">Centered trigger</div>
```

**Reverse animations:**
```html
<div data-q="scale" data-q-reverse>Reverses when scrolling up</div>
```

**Custom animation:**
```html
<div data-q="fade-up" data-q-from="10rem" data-q-duration="1s" data-q-easing="ease-in-out">
  Smooth long-distance fade
</div>
```

## How It Works

ScrollQ uses the Intersection Observer API to watch elements. When visible, it adds the `q-active` class to trigger CSS transitions.

**Behavior:**
- Animations trigger when scrolling **down** and element enters from bottom
- With `data-q-reverse`, animations reverse when scrolling **up** 
- Elements already scrolled past are automatically activated on page load
- Respects `prefers-reduced-motion` for accessibility

## Browser Support

Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+

## Development

```bash
npm install
npm run build  # Builds dist files
```

**File sizes:** 1.6KB JS + 1.5KB CSS (minified)

## License

MIT License - feel free to use in personal and commercial projects.

## Credits

Created by Kevin Terry

Inspired by [AOS](https://github.com/michalsnik/aos) and the need for a super simple, modern scroll animation solution.
