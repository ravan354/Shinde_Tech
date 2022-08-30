'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "1d201bf2af486594ebdaa4408be2b50d",
"assets/assets/icon/icon.png": "b9f0c9ee0479bb1c6a1224487e91c71e",
"assets/assets/images/background.png": "5618ba35fc2b7c678a8370f7dfed1890",
"assets/assets/images/logo.png": "b1615165a78b4484c4332f43d7ff71cb",
"assets/assets/images/samsung_galaxy_a/samsung_galaxy_a52.png": "11c284df4605f222181ccedf77aa1b15",
"assets/assets/images/samsung_galaxy_a/samsung_galaxy_a_1.png": "2bc93b166f68b95618719c93c3061a45",
"assets/assets/images/samsung_galaxy_a/samsung_galaxy_a_2.png": "c2b8e0f9d485e24726ee3f2c9a810539",
"assets/assets/images/samsung_galaxy_m/samsung_galaxy_m.png": "5479c763708bf39df12ed9a5ae589cc9",
"assets/assets/images/samsung_galaxy_m/samsung_galaxy_m1.png": "c39efbe31b77d58b97360bbc0ebf47f4",
"assets/assets/images/samsung_galaxy_m/samsung_galaxy_m2.png": "dc17f7aba3968623ea4138ec1541ea87",
"assets/assets/images/samsung_galaxy_s/samsung-galaxy-s-tab.png": "649e4a8263cfa522cb91febc9dcec253",
"assets/assets/images/samsung_galaxy_s/samsung-galaxy-s.png": "ae05ffecf107e0e3fbd2ed989e111fa6",
"assets/assets/images/samsung_galaxy_s/samsung_tab.png": "9d793ae89e97d6dc92b817b3d54c8107",
"assets/assets/images/samsung_galaxy_z/samsung-galaxy-z-flip-3.png": "ed84f0b6d5db9a8b0c94c040c9525f3f",
"assets/assets/images/samsung_galaxy_z/samsung-galaxy-z-fold-2-1.png": "66712f234c11f28febc55c58411df653",
"assets/assets/images/samsung_galaxy_z/samsung-galaxy-z-fold-2.png": "446e0c597e63c1de94e925fa21cafbca",
"assets/assets/images/samsung_logo.png": "bfc3dd2a5790893ded0d0991100a1869",
"assets/FontManifest.json": "3bac2883729d088595692597fac1cbac",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/fonts%255Cchanticleerroman%255CChanticleerRomanNF-Bold.ttf": "ff407913e45fbc80879b5be84b7d7ac5",
"assets/fonts%255Cchanticleerroman%255CChanticleerRomanNF.ttf": "d6b286670f1c0639a12c8f6985e12bca",
"assets/fonts%255Csirin-stencil%255CSirinStencil-Regular.ttf": "0325c0f079b9355f3028871c6924510d",
"assets/NOTICES": "fb387c910895bb8b76515d894fa33f60",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "2ad5fabd6a36a6deff087b8edfd0c1f8",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"favicon.png": "b9f0c9ee0479bb1c6a1224487e91c71e",
"flutter.js": "8ae00b472ec3937a5bee52055d6bc8b4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "c178aa96a74802d7b4b352df3ed98645",
"/": "c178aa96a74802d7b4b352df3ed98645",
"main.dart.js": "cb8d58bd11350983a41167eb97d1a0ed",
"manifest.json": "4a1718f63f2cd22efce7209858b93f3e",
"version.json": "f566d0092354d9dbb7e808b3587b2ff0"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
