/* Carbon Rogue Solver - offline service worker.
   Bump CACHE on every deploy so phones pick the new build up. */
const CACHE = "rogue-solver-v3";
const SHELL = [
  "./",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./maskable-512.png",
  "./apple-touch-icon.png"
];

// Cache each file on its own. addAll() is all-or-nothing: one file 404s mid-deploy
// and the entire shell goes uncached, silently, and you find out with no signal.
function fill(c) {
  return Promise.all(SHELL.map(function (url) {
    return c.match(url).then(function (hit) {
      return hit ? null : c.add(url).catch(function () { return null; });
    });
  }));
}

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(fill)
      .then(function () { return self.skipWaiting(); })
      .catch(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      // Second pass: anything install missed gets picked up here, so a bad
      // deploy heals itself on the next load instead of staying broken.
      .then(function () { return caches.open(CACHE).then(fill); })
      .then(function () { return self.clients.claim(); })
      .catch(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Weather and geocoding live on another origin and must never be cached:
  // a stale pressure reading is worse than no reading. Let the network handle it.
  if (url.origin !== self.location.origin) return;

  // App shell: serve from cache at once, refresh it in the background.
  e.respondWith(
    caches.match(req).then(function (hit) {
      const live = fetch(req).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return null; });

      if (hit) return hit;
      return live.then(function (res) {
        if (res) return res;
        if (req.mode === "navigate") return caches.match("./");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
