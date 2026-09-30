# Carbon Rogue Solver

Ballistic solver for a Fierce Carbon Rogue, 7mm PRC, 20" carbon barrel, 1:8 twist,
Leupold VX-6HD 3-18x50 CDS-ZL2 (¼ MOA clicks, 20 MOA/rev, 38 MOA dial travel).

Give it a range from the rangefinder and it returns **the yardage to set the CDS dial to** —
not clicks — corrected for the conditions you're actually standing in.

Installable to an iPhone home screen. Works with no signal.

---

## What it does

- Point-mass G1 trajectory solved on the spot, not a lookup table
- Back-solves the engraved CDS curve, so the number it gives you is a dial number
- Flags which revolution you're on and when you hit the 38 MOA dial stop
- Powder temperature sensitivity, humid-air density, station vs. sea-level pressure
- Terminal velocity floor warning (below it the bullet may not expand)
- Wind hold in clicks and MOA
- Multiple loads, each with its own velocity, BC, zero and CDS cut

## Weather

Live conditions come from [Open-Meteo](https://open-meteo.com) — free, no API key, no account.

- **Weather here now** — reads GPS, pulls conditions for that exact spot, loads them in
- **Saved places** — check a spot you aren't standing in; search fills altitude from terrain data
- Sea-level pressure is converted to true station pressure using the altitude for that place
- Wind is a 10 m model wind for the grid square. It is a starting number, never the call.

Weather is the only thing that needs a connection. Everything else works offline.

## Offline

A service worker caches the app on first load. After that it opens and solves with the
phone in airplane mode, in a coulee, with no bars. Conditions can be typed in by hand.

---

## Deploying to GitHub Pages

1. Create a new **public** repository (Pages needs public on a free account).
2. Upload every file in this folder, keeping the `icons/` folder intact.
3. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save.**
4. Wait about a minute. The URL appears at the top of that same page.

`.nojekyll` is included so GitHub serves the files as-is rather than running Jekyll over them.

### Installing on iPhone

Open the URL in **Safari** (this does not work in Chrome on iOS), tap **Share**,
then **Add to Home Screen**. It launches fullscreen with no browser bars.

Allow location "While Using" the first time you tap Weather here now.

### Updating it later

Edit the file, commit, and Pages redeploys in about a minute.

**Bump `CACHE` in `sw.js` every time you change `index.html`** — `rogue-solver-v1` to
`v2`, and so on. Phones hold the old cached copy until that string changes. A "New version
ready" bar appears in the app once the new worker installs.

---

## Files

| File | What it is |
|---|---|
| `index.html` | The whole app — solver, UI, weather. No build step, no dependencies. |
| `sw.js` | Service worker. Caches the shell; never caches weather. |
| `manifest.webmanifest` | Name, icons, standalone display. |
| `icons/` | 192, 512, maskable and Apple touch icons. |
| `.nojekyll` | Stops GitHub Pages running Jekyll. |

## Load data

The default load is 160 gr Barnes LRX over 65.40 gr N560, 2945 fps, G1 BC 0.608,
1.90" scope height, 100 yd zero, CDS cut for 22 °F at 2100 ft.

Edit velocity and BC in the app as you true them against real impacts — that is what
the fields are there for. **The BC has not been trued at distance yet.**

## Licence

Personal project. Open-Meteo is free for non-commercial use.
