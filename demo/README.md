# ScrollQ Demo

Interactive demo showcasing all ScrollQ animation features.

## Running the Demo

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/demo/`

## What's Included

The demo showcases:

- All 10 animation variants (fade-up, slide-left, scale, etc.)
- Staggered animations with delays
- Custom settings (duration, easing, offset, threshold)
- Reverse animations that play on scroll in/out
- Global reverse configuration

## Note

The demo references files from `../dist/` - make sure you've run `npm run build` to generate the distribution files.
