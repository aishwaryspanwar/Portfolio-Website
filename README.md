# Aishwary Panwar — Portfolio

Personal portfolio built with React, Vite, Tailwind CSS, Framer Motion and GSAP.

## Development

```sh
npm install
npm run dev      # start the dev server
npm run lint     # check the code
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

## Structure

- `src/App.jsx` — routes; each page is wrapped in `PageShell` (loading curtain, top bar, nav)
- `src/pages/` — Home, Work, Contact, NotFound
- `src/components/` — shared pieces (nav, curtain, cursor trail, carousel, theme toggle)
- `src/data/projects.js` — projects shown on the Work page; edit this to add or change projects
- `src/index.css` — fonts and light/dark theme colors

## Deployment

The site is a single-page app, so the host must serve `index.html` for every route.
`vercel.json` (Vercel) and `public/_redirects` (Netlify) already do this.
