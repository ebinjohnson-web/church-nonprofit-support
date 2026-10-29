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
- On desktop, the homepage respects system reduced-motion preferences. At mobile widths (760px and below), the slideshow and ambient animation run regardless of the system preference, as requested. The manual pause control works at every width. Other pages retain their earlier motion treatment. Content remains readable without JavaScript.

## Pages

- `index.html` — Home page
- `about.html` — About page
- `services.html` — Services page
- `contact.html` — Contact page

The inner pages share `studio-pages.css` and `studio-pages.js`: editorial layouts, white logo assets, animated bulb/collage details, native FAQ disclosure, and the same mobile motion preference as the homepage. About retains the supplied project-management background and shows current live-project previews. Services links carry a `service` query parameter to Contact. Contact posts inquiries to Web3Forms using its public client access key and hCaptcha. `contact-form.js` validates required fields, prevents duplicate submissions, reports success only after API acceptance, preserves inputs on errors, and times out after 30 seconds. The form provides an email fallback and disclosure of third-party processing. No inquiry fields are saved in browser storage. Enable hCaptcha in the Web3Forms form settings. The homepage and inner pages share only the manual motion preference in session storage.

`npm run check` checks the JavaScript and all four HTML documents for duplicate document sections or IDs, a single H1, active navigation, valid schema, and working local links and anchors.

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

The homepage opens with a skippable outlined-type introduction, followed by a project-led hero. `docs/launch-intro.css` and `docs/launch-intro.js` animate cream “Good works” to the left, gold “Better Websites” to the right, and the existing white logo up from below. The cover lifts after about 4.35 seconds. The locally hosted Bebas Neue font includes its OFL license in `docs/assets/fonts/`. Skip intro and Escape release the page immediately. Direct hash links and `?capture=1` bypass the scene. Desktop system reduced motion bypasses it; mobile runs it regardless of that setting. Timed recovery prevents the overlay or inert page regions from getting stuck.

Oversized hero typography overlaps a rounded showcase that crossfades between MM Photographi, Common Ground, and Anchor Church every 6.5 seconds. Each slide links to its real destination; Common Ground is labelled as a concept. The slideshow pauses on desktop hover/focus, page hiding, or its pause control. Touch interactions do not leave the slideshow stuck in a hover/focus pause. Inactive slide links are removed from keyboard and accessibility navigation.

`docs/studio-motion.css` and `docs/studio-motion.js` contain the homepage design: gradual image movement, a moving service ribbon, word reveals, staggered project galleries, and the bulb as a small personal signature. The homepage retains one H1. Floating global pause/play controls have been removed. Desktop honors system reduced motion; mobile animation runs regardless of the system setting. `?capture=1` pauses motion for screenshots.

The homepage uses `EJwhitelogo.png`, a white export of the existing transparent logo, so its contrast does not depend on CSS filters. Arrows request text presentation; the large contact-panel arrow is an SVG background. The mobile showcase has an explicit height and a matching photograph background as a rendering fallback. The bulb badge is anchored inside the showcase, and project cards size to their content.

`docs/experience.css` contains the entry scene, expanded palette, animated typography, curtain transitions, orbiting artwork, and moving strips. No animation library or external runtime dependency is needed.

## Black theme and vintage lighting

`docs/black-theme.css` is the final shared theme layer: black backgrounds, charcoal cards, warm-white text, and tungsten accents. Each page uses a real vintage bulb photograph by Brett Sayles, with a fixed photographic glass/socket layer and a separate filament-only exposure layer on a 6.4-second dim-to-bright cycle. No halo or optical bloom is added. Attribution and source are recorded in docs/assets/images/PHOTO-CREDIT.md. The existing Pause motion control also pauses the bulb.

The homepage is intentionally concise: a short hero, two live projects, five concept previews, and a contact link. Detailed service and background information stays on the inner pages.

The Common Ground not-for-profit concept appears first in Website concepts. Its source is in https://github.com/ebinjohnson-web/common-ground-nonprofit-demo and its live demo is https://ebinjohnson-web.github.io/common-ground-nonprofit-demo/. The portfolio preview is a locally hosted screenshot with photography attribution in docs/assets/images/PHOTO-CREDIT.md.
