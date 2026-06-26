# 🚀 Next-Gen AI Platform - Premium SaaS Landing Page

> **Live Demo:** [Add live project link here]

A high-performance, premium SaaS landing page for an advanced AI-driven data automation platform. Built with React, TypeScript, and Vite with a focus on architectural integrity, motion choreography, and SEO optimization.

---

## 📋 Project Overview

This is a speedrun competition submission building a responsive, high-converting landing page featuring:

- **Hero Section** - Premium storytelling and value proposition
- **Feature Showcase** - Bento grid on desktop / Accordion on mobile with state persistence
- **Dynamic Pricing Matrix** - Multi-currency pricing (INR ₹, USD $, EUR €) with billing cycle toggle
- **Social Proof** - Trust indicators and testimonials
- **Responsive Design** - Seamless adaptation across mobile, tablet, and desktop

---

## ✨ Core Features

### Feature 1: Matrix-Driven Pricing & Multi-Currency Switcher

- Dynamic pricing calculation using multi-dimensional configuration matrix
- Support for 3 currencies: INR (₹), USD ($), EUR (€)
- Monthly and Annual billing cycles with 20% annual discount
- **Zero Global Re-renders**: State updates isolated to price text nodes only
- Hardware-accelerated transitions (150-200ms ease-out)

### Feature 2: Bento-to-Accordion with Context Lock

- Desktop: Modern Bento grid layout for feature showcase
- Mobile: Responsive Accordion with touch optimization
- **Smart Context Transfer**: Active index automatically transfers on viewport resize
- **State Persistence**: Maintains user interaction context across breakpoint transitions
- **Performance-Optimized**: Pure CSS animations, no external animation libraries

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Router**: TanStack Router
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Custom-built (no external libraries like Shadcn, Radix, Framer Motion)
- **Server**: Express.js (optional backend)
- **Deployment**: Ready for Vercel, Netlify, or any static host

---

## 📦 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── pricing/            # Pricing matrix component
│   ├── features/           # Bento/Accordion component
│   └── hero/               # Hero section
├── routes/                 # Route definitions (TanStack Router)
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and helpers
├── styles.css              # Global styles
├── router.tsx              # Router configuration
└── start.ts                # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18+
- **Package Manager**: npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/frontend-vibe.git
cd frontend-vibe

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running Locally

#### Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173` (or the next available port).

#### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

#### Preview Production Build

```bash
npm run preview
```

Runs the production build locally for testing before deployment.

---

## 🔧 Available Scripts

| Command              | Purpose                                  |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run build`      | Build optimized production bundle        |
| `npm run preview`    | Preview production build locally         |
| `npm run lint`       | Run ESLint code quality checks           |
| `npm run type-check` | Run TypeScript type checking             |

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All layouts have been tested for seamless adaptation and zero horizontal clipping.

---

## 🎨 Design System

### Color Palette

- Primary colors defined in Tailwind config
- Accessibility-compliant contrast ratios
- SEO-friendly semantic HTML structure

### Typography

- Configured fonts as per design specification
- Responsive font scaling
- Optimized for readability across devices

### Motion Guidelines

- Micro-interactions: 150-200ms (ease-out)
- Structural layout reflows: 300-400ms (ease-in-out)
- Hardware-accelerated CSS animations
- Initial load orchestration: < 500ms

---

## 🔍 SEO & Performance

- ✅ Semantic HTML structure (`<main>`, `<header>`, `<section>`, `<nav>`)
- ✅ Open Graph (OG) tags for social sharing
- ✅ Meta descriptions and keywords
- ✅ Accessible image attributes (alt text)
- ✅ Crawlable text nodes
- ✅ Optimized Time to Interactive (TTI)
- ✅ No layout thrashing or unnecessary re-renders

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

Update `vite.config.ts` with your repo name and build:

```bash
npm run build
```

---

## 📋 Constraints & Guardrails

✅ **Passed Constraints:**

- ✓ No external animation libraries (pure CSS/WAAPI)
- ✓ No global re-renders on currency/billing changes
- ✓ Responsive Bento-to-Accordion with context lock
- ✓ Dynamic multi-currency pricing matrix
- ✓ Sub-500ms initial load orchestration
- ✓ Semantic HTML & SEO optimization
- ✓ All assets integrated (SVGs, fonts, colors)

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
# Check for TypeScript errors
npm run type-check

# Run ESLint
npm run lint
```

---

## 📄 License

This project is part of a competition submission. All rights reserved.

---

## 👨‍💻 Author

**Frontend Developer**: [Your Name]  
**Competition**: Next-Gen AI Platform Speed Run  
**Date**: June 26, 2026

---

## 📞 Support

For issues or questions about the project structure, refer to the competition guidelines or contact the development team.

---

**Competition Phase**: Phase 1  
**Submission Requirements**: ✓ GitHub Repo | ✓ Live Deployment | ✓ Demo Video
