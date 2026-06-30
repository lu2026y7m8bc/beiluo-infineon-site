# BeiLuo Infineon Distributor Site

A high-performance, SEO/GEO optimized static website for BeiLuo, an Infineon distributor. Built with vanilla HTML, CSS, and JavaScript with Node.js build tooling.

## Technology Stack

- **Frontend**: HTML + CSS + Vanilla JavaScript
- **Build Tool**: Node.js (zero runtime dependencies)
- **Testing**: Node.js built-in `node:test` module

## Project Structure

```
src/
  ├── assets/          # Static assets
  │   ├── css/        # Stylesheets
  │   ├── js/         # JavaScript modules
  │   └── svg/        # SVG graphics
  │       ├── icons/       # Icon assets
  │       ├── logo/        # Logo variants
  │       ├── backgrounds/ # Background graphics
  │       ├── illustrations/ # Illustration assets
  │       └── badges/      # Badge graphics
  ├── data/           # Data files (JSON, configuration)
  ├── lib/            # Utility libraries
  ├── templates/      # HTML templates
  │   └── partials/   # Reusable template partials
  └── build.js        # Build script

tests/               # Test files
dist/               # Build output (generated)
```

## Getting Started

### Install Dependencies

No external dependencies required. This project uses only Node.js built-in modules.

### Build the Site

```bash
npm run build
```

This runs the build script located at `src/build.js` and generates the static site in the `dist/` directory.

> **Note**: `src/build.js` is created in the build phase (plan T1.7); `npm run build` becomes runnable from that task onward.

### Run Tests

```bash
npm test
```

This executes all test files using Node.js built-in test runner.

## About BeiLuo

BeiLuo is a trusted Infineon distributor offering comprehensive semiconductor solutions and technical support.

## License

Proprietary
