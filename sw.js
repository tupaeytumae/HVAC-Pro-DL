const CACHE_NAME = "hvac-pro-dl-v12";
const APP_SHELL = [
  "./",
  "./index.html",
  "./pt_data.js",
  "./engine/calculations.js",
  "./engine/evidence.js",
  "./engine/diagnosis.js",
  "./diagnostics/undercharge.js",
  "./diagnostics/charge.js",
  "./diagnostics/restriction.js",
  "./diagnostics/airflow.js",
  "./diagnostics/overfeed.js",
  "./diagnostics/low_deltaT.js",
  "./diagnostics/high_approach.js",
  "./diagnostics/balanced.js",
  "./profiles/index.js",
  "./profiles/unknown.js",
  "./profiles/capillary.js",
  "./profiles/txv.js",
  "./profiles/eev.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => Promise.all(
      APP_SHELL.map(url =>
        fetch(new Request(url, { cache: "reload" }))
          .then(response => {
            if (!response.ok) {
              throw new Error(`No se pudo almacenar ${url}`);
            }
            return cache.put(url, response);
          })
      )
    ))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if(response.ok){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
