# אתר לחשמלאי מוסמך – Premium RTL Landing Page

A fast, static, Hebrew/RTL single-page site for a certified electrician in Israel, built to generate **phone calls and WhatsApp leads**. No build step, no framework – just `index.html`, one CSS file and one JS file.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Deploy anywhere that serves static files (GitHub Pages, Netlify, Cloudflare Pages, Vercel).

## Before going live – replace every placeholder

No business details were invented. Everything in square brackets is a placeholder:

| Placeholder | Where |
|---|---|
| `[שם העסק]` | business name – header, footer, title, JSON-LD |
| `[אזור השירות]`, `[עיר 1]`…`[עיר 6]` | service area & cities – hero, area section, FAQ, title/meta, JSON-LD `areaServed` |
| `[מספר רישיון]`, `[סוג הרישיון]` | electrician licence number/type |
| `[שעות פעילות]`, `[שעות זמינות לחירום]` | opening / emergency hours (also `openingHours` in JSON-LD) |
| `[רחוב ומספר]`, `[עיר]`, `[מחוז]` | address (footer + JSON-LD) |
| `[הדומיין-שלכם]` | canonical, OG URL, robots.txt, sitemap.xml |
| `+972-5X-XXX-XXXX` | `telephone` in the JSON-LD block |
| Testimonials section | only real customer reviews (e.g. from Google) – or remove the section |
| Map placeholder | replace `.map-placeholder` with the business's Google Maps embed (`loading="lazy"`) |

Find them all with:

```bash
grep -n "\[" index.html robots.txt sitemap.xml | grep -v "^.*<!--"
```

### Phone & WhatsApp

Edit `CONFIG` at the top of `assets/js/main.js` – every call/WhatsApp link and displayed number updates from there. Also update the static `tel:`/`wa.me` hrefs in `index.html` (search `9725XXXXXXXX`) so links work without JavaScript.

## Lead generation features

- Call + WhatsApp CTAs in the hero, header, every service card, emergency band and contact section.
- Sticky bottom call/WhatsApp bar on mobile; floating WhatsApp button on desktop.
- Each WhatsApp link is pre-filled with a message matching the service.
- Contact form composes a WhatsApp message (no backend, nothing stored).
- Every CTA pushes a `lead_click` event (and the form a `lead_form_submit` event) to `window.dataLayer` – connect GTM / GA4 to track conversions.

## Local SEO

- `lang="he" dir="rtl"`, Hebrew title/meta with service area keywords.
- JSON-LD `Electrician` (LocalBusiness) with `areaServed`, services catalogue and NAP fields, plus `FAQPage`.
- Dedicated service-area section with per-city text.
- `robots.txt`, `sitemap.xml`, canonical, Open Graph.
- Next steps: Google Business Profile with identical NAP, and optionally a separate page per city/service.

## Visuals

The four photos were generated with **Higgsfield** (`z_image`) and are currently loaded from Higgsfield's CDN. For best performance, download them locally and convert to WebP:

```bash
./scripts/localize-images.sh
```

If a remote image fails to load, the layout falls back gracefully to the dark gradient design. Images are labelled "תמונות להמחשה" (illustrative); replace them with real photos of your work when available.

## Motion & accessibility

Subtle 3D tilt, glare, magnetic buttons and hero parallax run only on devices with a fine pointer; scroll reveals use `IntersectionObserver`. Everything respects `prefers-reduced-motion`. Includes a skip link, focus styles, ARIA labels and keyboard-closable menu.
