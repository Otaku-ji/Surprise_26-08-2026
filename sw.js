const CACHE_NAME = "postit-game-v13";


const APP_FILES = [
    "./",
    "./index.html",
    "./install.html",
    "./collection.html",
    "./style.css",
    "./app.js",
    "./collection.js",
    "./jar2.html",
    "./jar2.js",
    "./jar2collection.html",
    "./jar2collection.js",
    "./pin.html",
    "./pin.js",
    "./setup-pin.html",
    "./setup-pin.js",
    "./install.html",
    "./install-pin.html",
    "./install-pin.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/OG_icon-128.png"
];


/* =========================
   INSTALL
========================= */

self.addEventListener(
    "install",
    event => {

        console.log(
            "Service Worker: installing v13..."
        );


        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    cache =>
                        cache.addAll(
                            APP_FILES
                        )
                )

        );


        /*
           Activate the new service worker
           immediately instead of waiting for
           all old pages/tabs to close.
        */

        self.skipWaiting();

    }
);


/* =========================
   ACTIVATE
========================= */

self.addEventListener(
    "activate",
    event => {

        console.log(
            "Service Worker: activated v13."
        );


        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    cacheName =>

                                        /*
                                           Only delete old
                                           application caches.

                                           IMPORTANT:
                                           Keep image and music
                                           caches because they are
                                           used for offline mode.
                                        */

                                        cacheName.startsWith(
                                            "postit-game-"
                                        ) &&
                                        cacheName !==
                                            CACHE_NAME
                                )
                                .map(
                                    cacheName => {

                                        console.log(
                                            "Deleting old application cache:",
                                            cacheName
                                        );


                                        return caches.delete(
                                            cacheName
                                        );

                                    }
                                )

                        );

                    }
                )
                .then(
                    () => {

                        /*
                           Take control of all existing
                           pages immediately.
                        */

                        return self.clients.claim();

                    }
                )

        );

    }
);


/* =========================
   FETCH
========================= */

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        const url =
            new URL(
                event.request.url
            );


        /*
           Never intercept Supabase requests.

           Supabase handles its own network
           communication and authentication.
        */

        if (
            url.hostname.endsWith(
                "supabase.co"
            )
        ) {

            return;

        }


        /*
           Determine whether this is an
           application file.

           These are the files where we most
           strongly want the newest version
           when the device is online.
        */

        const isAppFile =
            url.pathname.endsWith(
                ".html"
            ) ||
            url.pathname.endsWith(
                ".js"
            ) ||
            url.pathname.endsWith(
                ".css"
            );


        /*
           APPLICATION FILES
           
           NETWORK FIRST + NO BROWSER CACHE

           This is the important fix.

           When online, the browser must ask
           GitHub Pages for the current file
           instead of being allowed to return
           an older HTTP-cached version.

           If the network request fails,
           the service-worker cache is used.
        */

        if (
            isAppFile
        ) {

            event.respondWith(

                fetch(
                    new Request(
                        event.request,
                        {
                            cache: "no-store"
                        }
                    )
                )
                    .then(
                        response => {

                            /*
                               Only cache successful
                               normal responses.
                            */

                            if (
                                response &&
                                response.status ===
                                    200 &&
                                response.type ===
                                    "basic"
                            ) {

                                const responseClone =
                                    response.clone();


                                caches
                                    .open(
                                        CACHE_NAME
                                    )
                                    .then(
                                        cache => {

                                            cache.put(
                                                event.request,
                                                responseClone
                                            );

                                        }
                                    )
                                    .catch(
                                        error => {

                                            console.error(
                                                "Service Worker: cache update failed:",
                                                error
                                            );

                                        }
                                    );

                            }


                            return response;

                        }
                    )
                    .catch(
                        () => {

                            console.log(
                                "Service Worker: network unavailable, using cached app file:",
                                event.request.url
                            );


                            return caches.match(
                                event.request
                            );

                        }
                    )

            );


            return;

        }


        /*
           OTHER FILES
           
           NETWORK FIRST

           Images, icons, manifest, etc. still
           use the normal network-first strategy.

           Your separate postit-image-cache-v1
           and postit-music-cache-v1 caches
           are NOT touched by this service worker.
        */

        event.respondWith(

            fetch(
                event.request
            )
                .then(
                    response => {

                        /*
                           Only cache successful
                           normal responses.
                        */

                        if (
                            response &&
                            response.status ===
                                200 &&
                            response.type ===
                                "basic"
                        ) {

                            const responseClone =
                                response.clone();


                            caches
                                .open(
                                    CACHE_NAME
                                )
                                .then(
                                    cache => {

                                        cache.put(
                                            event.request,
                                            responseClone
                                        );

                                    }
                                )
                                .catch(
                                    error => {

                                        console.error(
                                            "Service Worker: cache update failed:",
                                            error
                                        );

                                    }
                                );

                        }


                        return response;

                    }
                )
                .catch(
                    () => {

                        /*
                           No internet.

                           Use the application cache.
                        */

                        return caches.match(
                            event.request
                        );

                    }
                )

        );

    }
);