# Ebin Johnson Website

This repository contains the source code for **ebinjohnson.ca**.

## Overview

This website presents Ebin Johnson's services focused on:

- Website support
- Communications support
- Operations support

The primary audience is:

- Churches
- Nonprofits
- Community organizations

There is also selective support for local businesses where there is a strong fit.

## Local preview

Requires Node.js 18 or newer. No dependency installation or build step is needed.

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. Run `npm run check` to check JavaScript syntax.
GitHub Pages still serves the `docs/` folder directly.

## Colour and motion refresh

- `docs/refresh.css` adds the shared cobalt, coral, lime, and cream theme.
- The current homepage overrides these early styles with `studio-motion.css`, using existing project screenshots, a project showreel, and scroll reveals.
- The homepage's fixed pause control stops its ambient animation and remembers the choice for the browser session.
- The homepage respects system reduced-motion preferences. Other pages retain their earlier motion treatment. Content remains readable without JavaScript.

## Pages

- `index.html` — Home page
- `about.html` — About page
- `services.html` — Services page
- `contact.html` — Contact page

## Assets

- `styles.css` — Main stylesheet
- `script.js` — Mobile navigation and reveal behavior
- `site.webmanifest` — Web app manifest
- `robots.txt` — Search engine crawl instructions
- `sitemap.xml` — Sitemap for search engines
- `assets/images/` — Logo and image assets

## Tech Stack

This is a simple static website built with:

- HTML
- CSS
- JavaScript

## Deployment

The site is deployed with GitHub Pages and connected to the custom domain:

- `https://ebinjohnson.ca`

## Notes

- Append `?capture=1` to the URL for screenshot-safe capture mode.
- Example: `https://ebinjohnson.ca/?capture=1`

## Contact

For inquiries related to the website or services:

- `ebin@ebinjohnson.ca`

## Animated studio homepage

The homepage opens directly on a project-led hero. Oversized typography overlaps a rounded showcase that crossfades between MM Photographi, Common Ground, and Anchor Church every 6.5 seconds. Each slide links to its real destination; Common Ground is labelled as a concept. The slideshow pauses on hover, keyboard focus, page hiding, or the pause control. Inactive slide links are removed from keyboard and accessibility navigation.

`docs/studio-motion.css` and `docs/studio-motion.js` contain the original homepage design: gradual image movement, a moving service ribbon, word reveals, staggered project galleries, and the bulb as a small personal signature. The warm black-and-gold palette, logo, project links, and other pages remain. The full-screen intro has been removed from the homepage, leaving one H1. A fixed pause/play control respects system reduced-motion preferences and remembers the visitor's choice during the session. `?capture=1` pauses motion for screenshots.

`docs/experience.css` contains the entry scene, expanded palette, animated typography, curtain transitions, orbiting artwork, and moving strips. No animation library or external runtime dependency is needed.

## Black theme and vintage lighting

`docs/black-theme.css` is the final shared theme layer: black backgrounds, charcoal cards, warm-white text, and tungsten accents. Each page uses a real vintage bulb photograph by Brett Sayles, with a fixed photographic glass/socket layer and a separate filament-only exposure layer on a 6.4-second dim-to-bright cycle. No halo or optical bloom is added. Attribution and source are recorded in docs/assets/images/PHOTO-CREDIT.md. The existing Pause motion control also pauses the bulb.

The homepage is intentionally concise: a short hero, two live projects, five concept previews, and a contact link. Detailed service and background information stays on the inner pages.

The Common Ground not-for-profit concept appears first in Website concepts. Its source is in https://github.com/ebinjohnson-web/common-ground-nonprofit-demo and its live demo is https://ebinjohnson-web.github.io/common-ground-nonprofit-demo/. The portfolio preview is a locally hosted screenshot with photography attribution in docs/assets/images/PHOTO-CREDIT.md.
