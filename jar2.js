
const SUPABASE_URL =
    "https://vaqmavrjvjktqijlpxst.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_1VBFWiNkHPz5XmLHP_v8KA_iJHKwrCg";

/* New
const SUPABASE_URL =
    "https://tbmdgenwifujtzklnvja.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_IWX9pWnPlLK0Gej8Jy2Nzw_XMuR6u_q";
*/
    
/* =========================
   SUPABASE
========================= */

const db =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================
   IMAGE and MUSIC CACHE
========================= */

const IMAGE_CACHE_NAME =
    "postit-image-cache-v1";

const MUSIC_CACHE_NAME =
    "postit-music-cache-v1";


const imageCachePromises =
    new Map();

const musicCachePromises =
    new Map();


/* =========================
   IMAGE CACHE
========================= */

async function isNoteImageCached(
    imagePath
) {

    if (!imagePath) {

        return false;

    }

    try {

        const cache =
            await caches.open(
                IMAGE_CACHE_NAME
            );

        const response =
            await cache.match(
                imagePath
            );

        return !!response;

    } catch (error) {

        console.error(
            "JAR 2 IMAGE CACHE CHECK ERROR:",
            error
        );

        return false;

    }

}


async function cacheNoteImage(
    imagePath
) {

    if (!imagePath) {

        return null;

    }


    if (
        await isNoteImageCached(
            imagePath
        )
    ) {

        return imagePath;

    }


    if (
        imageCachePromises.has(
            imagePath
        )
    ) {

        return imageCachePromises.get(
            imagePath
        );

    }


    const cachePromise =
        (async () => {

            if (
                !db ||
                !navigator.onLine
            ) {

                return null;

            }


            try {

                const {
                    data,
                    error
                } =
                    await db.storage
                        .from("postit-images")
                        .createSignedUrl(
                            imagePath,
                            60 * 60
                        );


                if (
                    error ||
                    !data ||
                    !data.signedUrl
                ) {

                    console.error(
                        "JAR 2 IMAGE SIGNED URL ERROR:",
                        error
                    );

                    return null;

                }


                const response =
                    await fetch(
                        data.signedUrl
                    );


                if (
                    !response.ok
                ) {

                    console.error(
                        "JAR 2 IMAGE DOWNLOAD ERROR:",
                        response.status
                    );

                    return null;

                }


                const cache =
                    await caches.open(
                        IMAGE_CACHE_NAME
                    );


                await cache.put(
                    imagePath,
                    response.clone()
                );


                console.log(
                    "JAR 2 IMAGE CACHED:",
                    imagePath
                );


                return imagePath;

            } catch (error) {

                console.error(
                    "JAR 2 IMAGE CACHE ERROR:",
                    imagePath,
                    error
                );

                return null;

            } finally {

                imageCachePromises.delete(
                    imagePath
                );

            }

        })();


    imageCachePromises.set(
        imagePath,
        cachePromise
    );


    return cachePromise;

}


async function getCachedNoteImage(
    imagePath
) {

    if (!imagePath) {

        return null;

    }


    try {

        const cache =
            await caches.open(
                IMAGE_CACHE_NAME
            );


        const response =
            await cache.match(
                imagePath
            );


        if (!response) {

            return null;

        }


        return URL.createObjectURL(
            await response.blob()
        );

    } catch (error) {

        console.error(
            "JAR 2 CACHED IMAGE ERROR:",
            error
        );

        return null;

    }

}


/* =========================
   MUSIC CACHE
========================= */

async function isNoteMusicCached(
    musicPath
) {

    if (!musicPath) {

        return false;

    }


    try {

        const cache =
            await caches.open(
                MUSIC_CACHE_NAME
            );


        const response =
            await cache.match(
                musicPath
            );


        return !!response;

    } catch (error) {

        console.error(
            "JAR 2 MUSIC CACHE CHECK ERROR:",
            error
        );

        return false;

    }

}


async function cacheNoteMusic(
    musicPath
) {

    if (!musicPath) {

        return null;

    }


    if (
        await isNoteMusicCached(
            musicPath
        )
    ) {

        return musicPath;

    }


    if (
        musicCachePromises.has(
            musicPath
        )
    ) {

        return musicCachePromises.get(
            musicPath
        );

    }


    const cachePromise =
        (async () => {

            if (
                !db ||
                !navigator.onLine
            ) {

                return null;

            }


            try {

                const {
                    data,
                    error
                } =
                    await db.storage
                        .from("postit-music")
                        .createSignedUrl(
                            musicPath,
                            60 * 60
                        );


                if (
                    error ||
                    !data ||
                    !data.signedUrl
                ) {

                    console.error(
                        "JAR 2 MUSIC SIGNED URL ERROR:",
                        error
                    );

                    return null;

                }


                const response =
                    await fetch(
                        data.signedUrl
                    );


                if (
                    !response.ok
                ) {

                    console.error(
                        "JAR 2 MUSIC DOWNLOAD ERROR:",
                        response.status
                    );

                    return null;

                }


                const cache =
                    await caches.open(
                        MUSIC_CACHE_NAME
                    );


                await cache.put(
                    musicPath,
                    response.clone()
                );


                console.log(
                    "JAR 2 MUSIC CACHED:",
                    musicPath
                );


                return musicPath;

            } catch (error) {

                console.error(
                    "JAR 2 MUSIC CACHE ERROR:",
                    musicPath,
                    error
                );

                return null;

            } finally {

                musicCachePromises.delete(
                    musicPath
                );

            }

        })();


    musicCachePromises.set(
        musicPath,
        cachePromise
    );


    return cachePromise;

}


async function getCachedNoteMusic(
    musicPath
) {

    if (!musicPath) {

        return null;

    }


    try {

        const cache =
            await caches.open(
                MUSIC_CACHE_NAME
            );


        const response =
            await cache.match(
                musicPath
            );


        if (!response) {

            return null;

        }


        return URL.createObjectURL(
            await response.blob()
        );

    } catch (error) {

        console.error(
            "JAR 2 CACHED MUSIC ERROR:",
            error
        );

        return null;

    }

}


/* =========================
   CACHE ALL JAR 2 MEDIA
========================= */

async function cacheAllJar2Images() {

    if (
        !navigator.onLine ||
        !allJar2Notes ||
        allJar2Notes.length === 0
    ) {

        return;

    }


    const imagePaths =
        [
            ...new Set(
                allJar2Notes
                    .filter(
                        note =>
                            note.image_url
                    )
                    .map(
                        note =>
                            note.image_url
                    )
            )
        ];


    if (
        imagePaths.length === 0
    ) {

        return;

    }


    console.log(
        `JAR 2: Background caching ${imagePaths.length} images...`
    );


    const results =
        await Promise.allSettled(
            imagePaths.map(
                imagePath =>
                    cacheNoteImage(
                        imagePath
                    )
            )
        );


    const successful =
        results.filter(
            result =>
                result.status === "fulfilled" &&
                result.value
        ).length;


    console.log(
        `JAR 2: Background image caching finished. ${successful}/${imagePaths.length} available.`
    );

}


async function cacheAllJar2Music() {

    if (
        !navigator.onLine ||
        !allJar2Notes ||
        allJar2Notes.length === 0
    ) {

        return;

    }


    const musicPaths =
        [
            ...new Set(
                allJar2Notes
                    .filter(
                        note =>
                            note.music_url
                    )
                    .map(
                        note =>
                            note.music_url
                    )
            )
        ];


    if (
        musicPaths.length === 0
    ) {

        return;

    }


    console.log(
        `JAR 2: Background caching ${musicPaths.length} music file(s)...`
    );


    const results =
        await Promise.allSettled(
            musicPaths.map(
                musicPath =>
                    cacheNoteMusic(
                        musicPath
                    )
            )
        );


    const successful =
        results.filter(
            result =>
                result.status === "fulfilled" &&
                result.value
        ).length;


    console.log(
        `JAR 2: Background music caching finished. ${successful}/${musicPaths.length} available.`
    );

}

/*
   DEVELOPER SETTINGS
*/

/*
   Set to true  = Reset Jar button works.
   Set to false = Reset Jar button is visible but disabled.
*/

const JAR2_RESET_ENABLED = false;


/* =========================
   GAME DATA
========================= */

let allJar2Notes = [];

let availableJar2Notes = [];

let collectedJar2Notes = [];

let jar2Categories = [];

let availableDailyDraws = 0;

let currentUser = null;


/*
   Prevent multiple simultaneous draws.
*/

let isJar2Drawing = false;


/*
   1.5-second cooldown between Jar 2 draws.
*/

let jar2DrawCooldown = false;

const JAR2_DRAW_COOLDOWN =
    1500;

const JAR2_START_DATE =
    "2026-08-26";


/* =========================
   LAST OPENED JAR
========================= */

const LAST_OPENED_JAR_KEY =
    "postit_last_opened_jar";


function setLastOpenedJar(
    jar
) {

    localStorage.setItem(
        LAST_OPENED_JAR_KEY,
        jar
    );

}


function getLastOpenedJar() {

    return localStorage.getItem(
        LAST_OPENED_JAR_KEY
    );

}


/*
   This page is Jar 2,
   so record that Jar 2 is
   currently the active jar.
*/

setLastOpenedJar(
    "jar2"
);


/* =========================
   LOCAL CACHE
========================= */

const JAR2_NOTES_CACHE_KEY =
    "jar2_notes_cache";

const JAR2_CATEGORIES_CACHE_KEY =
    "jar2_categories_cache";


function getJar2CollectionCacheKey() {

    if (!currentUser) {

        return null;

    }


    return (
        "jar2_collection_cache_" +
        currentUser.id
    );

}


function getJar2PendingCollectionsKey() {

    if (!currentUser) {

        return null;

    }


    return (
        "jar2_pending_collections_" +
        currentUser.id
    );

}


function getJar2PendingResetKey() {

    if (!currentUser) {

        return null;

    }


    return (
        "jar2_pending_reset_" +
        currentUser.id
    );

}


/* =========================
   CACHE HELPERS
========================= */

function saveCache(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error(
            "JAR 2 CACHE SAVE ERROR:",
            error
        );

    }

}


function loadCache(
    key,
    fallback
) {

    try {

        const stored =
            localStorage.getItem(
                key
            );


        if (!stored) {

            return fallback;

        }


        return JSON.parse(
            stored
        );

    } catch (error) {

        console.error(
            "JAR 2 CACHE LOAD ERROR:",
            error
        );

        return fallback;

    }

}


/* =========================
   JAR 2 PENDING ACTIONS
========================= */

function getPendingJar2Collections() {

    const key =
        getJar2PendingCollectionsKey();


    if (!key) {

        return [];

    }


    return loadCache(
        key,
        []
    );

}


function savePendingJar2Collections(
    collections
) {

    const key =
        getJar2PendingCollectionsKey();


    if (!key) {

        return;

    }


    saveCache(
        key,
        collections
    );

}


function isJar2ResetPending() {

    const key =
        getJar2PendingResetKey();


    if (!key) {

        return false;

    }


    return loadCache(
        key,
        false
    ) === true;

}


function setJar2ResetPending(
    value
) {

    const key =
        getJar2PendingResetKey();


    if (!key) {

        return;

    }


    saveCache(
        key,
        value
    );

}


/* =========================
   ELEMENTS
========================= */

const remainingElement =
    document.getElementById(
        "jar2Remaining"
    );


const collectedElement =
    document.getElementById(
        "jar2Collected"
    );


const jarElement =
    document.getElementById(
        "jar2"
    );


const jarNotesElement =
    document.getElementById(
        "jar2Notes"
    );


const statusElement =
    document.getElementById(
        "jar2Status"
    );


const modal =
    document.getElementById(
        "jar2NoteModal"
    );


const bigNote =
    document.getElementById(
        "jar2BigNote"
    );


const noteCategory =
    document.getElementById(
        "jar2NoteCategory"
    );


const noteText =
    document.getElementById(
        "jar2NoteText"
    );


const noteDate =
    document.getElementById(
        "jar2NoteDate"
    );


const collectionButton =
    document.getElementById(
        "jar2CollectionButton"
    );


const resetButton =
    document.getElementById(
        "jar2ResetButton"
    );

/*
   Developer-controlled reset button.
*/

if (resetButton) {

    resetButton.disabled =
        !JAR2_RESET_ENABLED;

}


const jar2Button =
    document.getElementById(
        "jar2Button"
    );


/* =========================
   OG JAR PHOTO
========================= */

const ogButton =
    document.getElementById(
        "ogButton"
    );


const ogOverlay =
    document.getElementById(
        "ogOverlay"
    );


const ogImage =
    document.getElementById(
        "ogImage"
    );


const OG_JAR_IMAGE =
    "OG_JAR.jpeg";


async function cacheOGJarImage() {

    if (
        !navigator.onLine ||
        !db
    ) {

        return false;

    }


    try {

        const {
            data,
            error
        } =
            await db.storage
                .from("postit-images")
                .createSignedUrl(
                    OG_JAR_IMAGE,
                    60 * 60
                );


        if (
            error ||
            !data ||
            !data.signedUrl
        ) {

            console.error(
                "OG JAR CACHE SIGNED URL ERROR:",
                error
            );

            return false;

        }


        const response =
            await fetch(
                data.signedUrl
            );


        if (
            !response.ok
        ) {

            console.error(
                "OG JAR CACHE DOWNLOAD ERROR:",
                response.status
            );

            return false;

        }


        const cache =
            await caches.open(
                IMAGE_CACHE_NAME
            );


        await cache.put(
            OG_JAR_IMAGE,
            response.clone()
        );


        console.log(
            "OG JAR IMAGE CACHED."
        );


        return true;

    } catch (error) {

        console.error(
            "OG JAR IMAGE CACHE ERROR:",
            error
        );

        return false;

    }

}


async function getCachedOGJarImage() {

    try {

        const cache =
            await caches.open(
                IMAGE_CACHE_NAME
            );


        const response =
            await cache.match(
                OG_JAR_IMAGE
            );


        if (!response) {

            return null;

        }


        return URL.createObjectURL(
            await response.blob()
        );

    } catch (error) {

        console.error(
            "OG JAR CACHED IMAGE ERROR:",
            error
        );

        return null;

    }

}


async function showOGJar() {

    let imageUrl =
        await getCachedOGJarImage();


    if (
        !imageUrl &&
        navigator.onLine
    ) {

        await cacheOGJarImage();


        imageUrl =
            await getCachedOGJarImage();

    }


    if (imageUrl) {

        ogImage.src =
            imageUrl;


        ogImage.onload =
            () => {

                ogOverlay.classList.add(
                    "visible"
                );

            };


        return;

    }


    console.error(
        "OG JAR IMAGE IS NOT AVAILABLE."
    );

}


if (ogButton) {

    ogButton.addEventListener(
        "click",
        showOGJar
    );

}


if (ogOverlay) {

    ogOverlay.addEventListener(
        "click",
        () => {

            ogOverlay.classList.remove(
                "visible"
            );


            ogImage.src =
                "";

        }
    );

}


/* =========================
   AUTHENTICATION
========================= */

async function loadCurrentUser() {

    const {
        data,
        error
    } = await db.auth.getSession();


    if (error) {

        console.error(
            "JAR 2 AUTH ERROR:",
            error
        );

        return false;

    }


    if (
        !data ||
        !data.session ||
        !data.session.user
    ) {

        window.location.href =
            "login.html";

        return false;

    }


    currentUser =
        data.session.user;


    return true;

}


/* =========================
   DAILY DRAW SYSTEM
========================= */

function getTodayDate() {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    return today;

}


function getJar2AvailableDraws(
    totalCollected
) {

    const startDate =
        new Date(
            JAR2_START_DATE +
            "T00:00:00"
        );


    const today =
        getTodayDate();


    if (
        today < startDate
    ) {

        return 0;

    }


    const millisecondsPerDay =
        1000 *
        60 *
        60 *
        24;


    const elapsedDays =
        Math.floor(
            (
                today.getTime() -
                startDate.getTime()
            ) /
            millisecondsPerDay
        );


    const earnedDraws =
        elapsedDays + 1;


    const availableDraws =
        earnedDraws -
        totalCollected;


    return Math.max(
        0,
        availableDraws
    );

}


/* =========================
   APPLY COLLECTION STATE
========================= */

function applyJar2CollectionState(
    collectionData
) {

    const collections =
        Array.isArray(
            collectionData
        )
            ? collectionData
            : [];


    const collectedIds =
        collections.map(
            item =>
                item.note_id
        );


    availableJar2Notes =
        allJar2Notes.filter(
            note =>
                !collectedIds.includes(
                    note.id
                )
        );


    collectedJar2Notes =
        allJar2Notes
            .filter(
                note =>
                    collectedIds.includes(
                        note.id
                    )
            )
            .map(
                note => {

                    const collection =
                        collections.find(
                            item =>
                                item.note_id ===
                                note.id
                        );


                    return {

                        ...note,

                        drawn_at:
                            collection
                                ? collection.drawn_at
                                : null

                    };

                }
            );


    availableDailyDraws =
        getJar2AvailableDraws(
            collectedJar2Notes.length
        );

}


/* =========================
   SAVE JAR 2 LOCAL GAME
========================= */

function saveJar2LocalGame() {

    saveCache(
        JAR2_NOTES_CACHE_KEY,
        allJar2Notes
    );


    saveCache(
        JAR2_CATEGORIES_CACHE_KEY,
        jar2Categories
    );


    const collectionKey =
        getJar2CollectionCacheKey();


    if (collectionKey) {

        saveCache(
            collectionKey,
            collectedJar2Notes.map(
                note => ({

                    note_id:
                        note.id,

                    drawn_at:
                        note.drawn_at ||
                        null

                })
            )
        );

    }

}


/* =========================
   LOAD JAR 2 LOCAL GAME
========================= */

function loadJar2LocalGame() {

    allJar2Notes =
        loadCache(
            JAR2_NOTES_CACHE_KEY,
            []
        );


    jar2Categories =
        loadCache(
            JAR2_CATEGORIES_CACHE_KEY,
            []
        );


    const collectionKey =
        getJar2CollectionCacheKey();


    const cachedCollection =
        collectionKey
            ? loadCache(
                collectionKey,
                []
            )
            : [];


    if (
        allJar2Notes.length === 0 ||
        jar2Categories.length === 0
    ) {

        return false;

    }


    /*
       Reconstruct the complete local game
       state from the cached collection.
    */

    applyJar2CollectionState(
        cachedCollection
    );


    return true;

}


/* =========================
   SYNC PENDING JAR 2 CHANGES
========================= */

async function syncPendingJar2Changes() {

    /*
       ========================================
       RESET
       ========================================
    */

    if (
        isJar2ResetPending()
    ) {

        console.log(
            "JAR 2: Pending reset found. Synchronizing..."
        );


        const {
            error
        } = await db
            .from("jar2_collections")
            .delete()
            .eq(
                "user_id",
                currentUser.id
            );


        if (error) {

            console.error(
                "PENDING JAR 2 RESET ERROR:",
                error
            );

            throw error;

        }


        setJar2ResetPending(
            false
        );


        savePendingJar2Collections(
            []
        );


        console.log(
            "JAR 2: Pending reset synchronized."
        );

    }


    /*
       ========================================
       PENDING COLLECTIONS
       ========================================
    */

    let pending =
        getPendingJar2Collections();


    if (
        pending.length === 0
    ) {

        return;

    }


    console.log(
        `JAR 2: Synchronizing ${pending.length} pending draw(s)...`
    );


    while (
        pending.length > 0
    ) {

        const item =
            pending[0];


        try {

            const {
                error
            } = await db
                .from("jar2_collections")
                .insert({

                    note_id:
                        item.note_id,

                    user_id:
                        currentUser.id,

                    drawn_at:
                        item.drawn_at

                });


            if (error) {

                console.error(
                    "PENDING JAR 2 COLLECTION ERROR:",
                    error
                );

                throw error;

            }


            pending.shift();


            savePendingJar2Collections(
                pending
            );


            console.log(
                "JAR 2: Pending draw synchronized:",
                item.note_id
            );

        } catch (error) {

            console.error(
                "JAR 2: Pending synchronization stopped.",
                error
            );

            throw error;

        }

    }


    console.log(
        "JAR 2: All pending changes synchronized."
    );

}


/* =========================
   LOAD NOTES
========================= */

async function loadJar2() {

    statusElement.textContent =
        "Loading jar...";


    /*
       ========================================
       FIRST: LOAD LOCAL CACHE
       ========================================
    */

    const hasLocalData =
        loadJar2LocalGame();


    if (hasLocalData) {

        updateInterface();


        statusElement.textContent =
            getJar2StatusMessage();

    }


    /*
       ========================================
       OFFLINE
       ========================================
    */

    if (
        !navigator.onLine
    ) {

        if (!hasLocalData) {

            statusElement.textContent =
                "Connect to the internet once to load the Special Jar.";

        }


        return;

    }


    /*
       ========================================
       ONLINE: LOAD FROM SUPABASE
       ========================================
    */

    try {

        /*
           Load all active notes.
        */

        const {
            data: notes,
            error: notesError
        } = await db
            .from("jar2_notes")
            .select(`
                *,
                jar2_categories!jar2_notes_category_fkey (
                    name,
                    color
                )
            `)
            .eq(
                "active",
                true
            )
            .order(
                "id"
            );


        if (notesError) {

            throw notesError;

        }


        console.log(
            "JAR 2 NOTES FROM SUPABASE:",
            notes
        );


        console.log(
            "JAR 2 NOTES COUNT FROM SUPABASE:",
            notes
                ? notes.length
                : 0
        );


        /*
           Load categories.
        */

        const {
            data: categoryData,
            error: categoryError
        } = await db
            .from("jar2_categories")
            .select(
                "id, name, color"
            )
            .order(
                "id"
            );


        if (categoryError) {

            throw categoryError;

        }


        jar2Categories =
            categoryData || [];


        allJar2Notes =
            notes || [];


        console.log(
            "JAR 2 ALL NOTES AFTER ASSIGNMENT:",
            allJar2Notes.length
        );


        /*
           ========================================
           APPLY CURRENT LOCAL STATE FIRST
           ========================================
        */

        const collectionKey =
            getJar2CollectionCacheKey();


        const localCollection =
            collectionKey
                ? loadCache(
                    collectionKey,
                    []
                )
                : [];


        applyJar2CollectionState(
            localCollection
        );


        saveJar2LocalGame();


        updateInterface();


        statusElement.textContent =
            getJar2StatusMessage();


        /*
           ========================================
           BACKGROUND MEDIA CACHING
           ========================================
        */

        if (navigator.onLine) {

            cacheAllJar2Images()
                .catch(
                    error =>
                        console.error(
                            "JAR 2 BACKGROUND IMAGE CACHE ERROR:",
                            error
                        )
                );


            cacheAllJar2Music()
                .catch(
                    error =>
                        console.error(
                            "JAR 2 BACKGROUND MUSIC CACHE ERROR:",
                            error
                        )
                );


            cacheOGJarImage()
                .catch(
                    error =>
                        console.error(
                            "JAR 2 BACKGROUND OG JAR CACHE ERROR:",
                            error
                        )
                );

        }


        /*
           ========================================
           SYNCHRONIZE PENDING CHANGES
           ========================================
        */

        await syncPendingJar2Changes();


        /*
           ========================================
           GET DEFINITIVE SUPABASE COLLECTION
           ========================================
        */

        const {
            data: syncedCollections,
            error: syncedCollectionsError
        } = await db
            .from("jar2_collections")
            .select(
                "note_id, drawn_at"
            )
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "drawn_at",
                {
                    ascending: true
                }
            );


        if (syncedCollectionsError) {

            throw syncedCollectionsError;

        }


        /*
           Apply the definitive server collection.
        */

        applyJar2CollectionState(
            syncedCollections || []
        );


        console.log(
            "JAR 2 COLLECTED COUNT:",
            collectedJar2Notes.length
        );


        console.log(
            "JAR 2 AVAILABLE COUNT:",
            availableJar2Notes.length
        );


        console.log(
            "JAR 2 TOTAL COUNT:",
            allJar2Notes.length
        );


        /*
           Save the synchronized state locally.
        */

        saveJar2LocalGame();


        /*
           Update the interface one final time.
        */

        updateInterface();


        statusElement.textContent =
            getJar2StatusMessage();


    } catch (error) {

        console.error(
            "JAR 2 LOAD ERROR:",
            error
        );


        /*
           If cached data exists, keep using it.
        */

        if (hasLocalData) {

            updateInterface();


            statusElement.textContent =
                "Could not sync. Your local game is still available.";

        } else {

            statusElement.textContent =
                "Could not load the Special Jar.";

        }

    }

}


/* =========================
   STATUS MESSAGE
========================= */

function getJar2StatusMessage() {

    if (
        availableJar2Notes.length === 0
    ) {

        return (
            "You've collected every Post-it!"
        );

    }


    if (
        availableDailyDraws === 0
    ) {

        return (
            "No Post-it available today. Come back tomorrow!"
        );

    }


    return (
        availableDailyDraws === 1
            ? "You have 1 Post-it to draw."
            : `You have ${availableDailyDraws} Post-its to draw.`
    );

}


/* =========================
   UPDATE INTERFACE
========================= */

function updateInterface() {

    if (remainingElement) {

        remainingElement.textContent =
            availableJar2Notes.length;

    }


    if (collectedElement) {

        collectedElement.textContent =
            collectedJar2Notes.length;

    }


    renderJar();

}


/* =========================
   GET CATEGORY COLOR
========================= */

function getJar2CategoryColor(
    categoryName
) {

    const category =
        jar2Categories.find(
            item =>
                item.name ===
                categoryName
        );


    if (!category) {

        console.warn(
            "No Jar 2 category color found for:",
            categoryName
        );

        return "white";

    }


    return category.color;

}


/* =========================
   RENDER JAR
========================= */

function renderJar() {

    if (!jarNotesElement) {

        return;

    }


    jarNotesElement.innerHTML =
        "";


    if (
        availableJar2Notes.length === 0
    ) {

        return;

    }


    const MAX_NOTES =
        Math.min(
            availableJar2Notes.length,
            70
        );


    const previewNotes = [];


    while (
        previewNotes.length <
        MAX_NOTES
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                availableJar2Notes.length
            );


        previewNotes.push(
            availableJar2Notes[
                randomIndex
            ]
        );

    }


    previewNotes.forEach(
        source => {

            const note =
                document.createElement(
                    "div"
                );


            const categoryColor =
                getJar2CategoryColor(
                    source.category
                );


            note.className =
                "mini-note " +
                convertColor(
                    categoryColor
                );


            note.style.left =
                `${random(2, 92)}%`;


            note.style.top =
                `${random(2, 92)}%`;


            note.style.setProperty(
                "--rotation",
                `${random(-20, 20)}deg`
            );


            jarNotesElement.appendChild(
                note
            );

        }
    );

}


/* =========================
   DRAW NOTE
========================= */

async function drawNote() {

    if (!isPinSessionActive()) {
    window.location.href = "pin.html";
    return;
    }

    /*
       Prevent a second draw from starting
       while the first draw is still running.
    */

    if (isJar2Drawing) {

        return;

    }


    if (jar2DrawCooldown) {

        return;

    }


    if (
        availableJar2Notes.length === 0
    ) {

        statusElement.textContent =
            "You've collected every Post-it!";

        return;

    }


    if (
        availableDailyDraws <= 0
    ) {

        statusElement.textContent =
            "No Post-it available today. Come back tomorrow!";

        return;

    }


    isJar2Drawing =
        true;


    if (jarElement) {

        jarElement.classList.add(
            "shaking"
        );

    }


    statusElement.textContent =
        "Mixing the Post-its...";


    try {

        await wait(
            700
        );


        if (jarElement) {

            jarElement.classList.remove(
                "shaking"
            );


            jarElement.classList.add(
                "lid-open"
            );

        }


        await wait(
            500
        );


        /*
           Select random note.
        */

        const randomIndex =
            Math.floor(
                Math.random() *
                availableJar2Notes.length
            );


        const note =
            availableJar2Notes[
                randomIndex
            ];


        /*
           Exact draw timestamp.
        */

        const drawnAt =
            new Date().toISOString();


        /*
           UPDATE LOCAL STATE FIRST.
        */

        availableJar2Notes.splice(
            randomIndex,
            1
        );


        availableDailyDraws--;


        collectedJar2Notes.push({

            ...note,

            drawn_at:
                drawnAt

        });

                /*
        Start 3-second draw cooldown.
        */

        jar2DrawCooldown = true;

        setTimeout(
            () => {

                jar2DrawCooldown = false;

            },
            JAR2_DRAW_COOLDOWN
        );


        /*
           Save immediately.
        */

        saveJar2LocalGame();


        /*
           Try Supabase immediately when online.
        */

        if (
            db &&
            navigator.onLine
        ) {

            try {

                const {
                    error
                } = await db
                    .from("jar2_collections")
                    .insert({

                        note_id:
                            note.id,

                        user_id:
                            currentUser.id,

                        drawn_at:
                            drawnAt

                    });


                if (error) {

                    console.error(
                        "JAR 2 ONLINE COLLECTION ERROR:",
                        error
                    );


                    const pending =
                        getPendingJar2Collections();


                    pending.push({

                        note_id:
                            note.id,

                        drawn_at:
                            drawnAt

                    });


                    savePendingJar2Collections(
                        pending
                    );

                }

            } catch (error) {

                console.error(
                    "JAR 2 ONLINE COLLECTION ERROR:",
                    error
                );


                const pending =
                    getPendingJar2Collections();


                pending.push({

                    note_id:
                        note.id,

                    drawn_at:
                        drawnAt

                });


                savePendingJar2Collections(
                    pending
                );

            }

        } else {

            const pending =
                getPendingJar2Collections();


            pending.push({

                note_id:
                    note.id,

                drawn_at:
                    drawnAt

            });


            savePendingJar2Collections(
                pending
            );

        }


        updateInterface();


        await wait(
            300
        );


        await showNote({

            ...note,

            drawn_at:
                drawnAt

        });

    } finally {

        isJar2Drawing =
            false;

    }

}

/* =========================
   MOBILE NOTE TEXT FIT
========================= */

function fitMobileNoteText(
    noteElement,
    textElement
) {

    if (
        !noteElement ||
        !textElement
    ) {

        return;

    }


    noteElement.classList.remove(
        "note-long",
        "note-very-long"
    );


    const textLength =
        textElement.textContent
            .trim()
            .length;


    if (
        textLength > 450
    ) {

        noteElement.classList.add(
            "note-very-long"
        );

    } else if (
        textLength > 250
    ) {

        noteElement.classList.add(
            "note-long"
        );

    }

}


/* =========================
   SHOW NOTE
========================= */

async function showNote(
    note
) {

    noteCategory.textContent =
        note.category || "";


    noteText.innerHTML =
        "";


    /*
       TEXT
    */

        if (
            note.text
        ) {

            const textElement =
                document.createElement(
                    "div"
                );


            textElement.innerHTML =
                note.text;


            noteText.appendChild(
                textElement
            );


            fitMobileNoteText(
                bigNote,
                textElement
            );

        }


    /*
       IMAGE
    */

    if (
        note.image_url
    ) {

        let imageUrl =
            await getCachedNoteImage(
                note.image_url
            );


        if (
            !imageUrl &&
            navigator.onLine
        ) {

            await cacheNoteImage(
                note.image_url
            );


            imageUrl =
                await getCachedNoteImage(
                    note.image_url
                );

        }


        if (imageUrl) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                imageUrl;


            image.className =
                "note-image";


            image.alt =
                "Post-it image";


            noteText.appendChild(
                image
            );

        } else if (
            !navigator.onLine
        ) {

            const imageMessage =
                document.createElement(
                    "div"
                );


            imageMessage.textContent =
                "Image unavailable offline.";


            noteText.appendChild(
                imageMessage
            );

        }

    }


    /*
       MUSIC
    */

    if (
        note.music_url
    ) {

        let musicUrl =
            await getCachedNoteMusic(
                note.music_url
            );


        if (
            !musicUrl &&
            navigator.onLine
        ) {

            await cacheNoteMusic(
                note.music_url
            );


            musicUrl =
                await getCachedNoteMusic(
                    note.music_url
                );

        }


        if (musicUrl) {

            const audio =
                document.createElement(
                    "audio"
                );


            audio.src =
                musicUrl;


            audio.controls =
                true;


            audio.autoplay =
                true;


            audio.preload =
                "metadata";


            audio.className =
                "note-music";


            noteText.appendChild(
                audio
            );


            audio.play().catch(
                error => {

                    console.log(
                        "JAR 2 MUSIC AUTOPLAY BLOCKED:",
                        error
                    );

                }
            );

        } else if (
            !navigator.onLine
        ) {

            const musicMessage =
                document.createElement(
                    "div"
                );


            musicMessage.textContent =
                "Music unavailable offline.";


            noteText.appendChild(
                musicMessage
            );

        }

    }


    /*
       DRAW DATE
    */

    if (
        note.drawn_at
    ) {

        noteDate.textContent =
            formatDrawDate(
                note.drawn_at
            );

    } else {

        noteDate.textContent =
            "";

    }


    /*
       APPLY STICKY NOTE COLOUR
    */

    const categoryColor =
        getJar2CategoryColor(
            note.category
        );


    bigNote.className =
        `big-note ${convertColor(
            categoryColor
        )}`;


    modal.classList.add(
        "visible"
    );

}


/* =========================
   FORMAT DRAW DATE
========================= */

function formatDrawDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================
   CLOSE NOTE
========================= */

if (bigNote) {

    bigNote.addEventListener(
        "click",
        () => {

            const audio =
                bigNote.querySelector(
                    ".note-music"
                );


            if (audio) {

                audio.pause();

                audio.currentTime =
                    0;

                audio.remove();

            }


            modal.classList.remove(
                "visible"
            );


            if (jarElement) {

                jarElement.classList.remove(
                    "lid-open"
                );

            }


            statusElement.textContent =
                getJar2StatusMessage();

        }
    );

}


/* =========================
   JAR CLICK
========================= */

if (jarElement) {

    jarElement.addEventListener(
        "click",
        () => {

            if (
                availableJar2Notes.length > 0 &&
                availableDailyDraws > 0 &&
                !isJar2Drawing
            ) {

                drawNote();

            }

        }
    );

}


/* =========================
   SWITCH JARS
========================= */

if (jar2Button) {

    jar2Button.addEventListener(
        "click",
        () => {

            /*
               We are leaving Jar 2
               and opening Jar 1.
            */

            setLastOpenedJar(
                "jar1"
            );


            window.location.href =
                "index.html";

        }
    );

}


/* =========================
   COLLECTION
========================= */

if (collectionButton) {

    collectionButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "jar2collection.html";

        }
    );

}


/* =========================
   RESET
========================= */

if (resetButton) {

    resetButton.addEventListener(
        "click",
        async () => {

            if (!JAR2_RESET_ENABLED) {

                return;

            }


            const confirmed =
                window.confirm(
                    "Are you sure you want to reset the Special Jar?\n\nAll collected Post-its will be returned to the jar."
                );


            if (!confirmed) {

                return;

            }


            resetButton.disabled =
                true;


            resetButton.textContent =
                "Resetting...";


            statusElement.textContent =
                "Resetting jar...";


            /*
               Prevent drawing during reset.
            */

            isJar2Drawing =
                true;


            /*
               RESET LOCAL STATE FIRST.
            */

            availableJar2Notes =
                [...allJar2Notes];


            collectedJar2Notes =
                [];


            availableDailyDraws =
                getJar2AvailableDraws(
                    0
                );


            saveJar2LocalGame();


            /*
               Reset supersedes all pending draws.
            */

            savePendingJar2Collections(
                []
            );


            setJar2ResetPending(
                true
            );


            updateInterface();


            let resetSynced =
                false;


            if (
                db &&
                navigator.onLine
            ) {

                try {

                    const {
                        error
                    } = await db
                        .from("jar2_collections")
                        .delete()
                        .eq(
                            "user_id",
                            currentUser.id
                        );


                    if (error) {

                        console.error(
                            "JAR 2 RESET ONLINE ERROR:",
                            error
                        );

                    } else {

                        setJar2ResetPending(
                            false
                        );


                        resetSynced =
                            true;

                    }

                } catch (error) {

                    console.error(
                        "JAR 2 RESET ONLINE ERROR:",
                        error
                    );

                }

            }


            isJar2Drawing =
                false;


            resetButton.disabled =
                false;


            resetButton.textContent =
                "Reset Jar";


            if (
                resetSynced
            ) {

                statusElement.textContent =
                    "Jar has been reset! Tap the jar to draw a Post-it.";

            } else if (
                navigator.onLine
            ) {

                statusElement.textContent =
                    "Jar reset locally. It will synchronize when possible.";

            } else {

                statusElement.textContent =
                    "Jar reset locally. It will synchronize when you reconnect.";

            }

        }
    );

}


/* =========================
   ONLINE / OFFLINE
========================= */

window.addEventListener(
    "online",
    async () => {

        console.log(
            "Jar 2: Internet connection restored."
        );


        statusElement.textContent =
            "Connection restored. Syncing...";


        try {

            await loadJar2();


            statusElement.textContent =
                getJar2StatusMessage();


        } catch (error) {

            console.error(
                "JAR 2 ONLINE SYNC ERROR:",
                error
            );


            statusElement.textContent =
                "Could not sync. Your local game is still available.";

        }

    }
);


window.addEventListener(
    "offline",
    () => {

        console.log(
            "Jar 2: Offline mode."
        );


        statusElement.textContent =
            "Offline mode — your Jar 2 collection is saved locally.";

    }
);


/* =========================
   COLOUR
========================= */

function convertColor(
    color
) {

    if (!color) {

        return "white";

    }


    return color
        .toLowerCase()
        .replaceAll(
            "_",
            "-"
        )
        .replaceAll(
            " ",
            "-"
        );

}


/* =========================
   RANDOM
========================= */

function random(
    min,
    max
) {

    return Math.random() *
        (max - min) +
        min;

}


/* =========================
   WAIT
========================= */

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================
   PIN SESSION
========================= */

const PIN_SESSION_KEY =
    "postit_pin_last_activity";


const PIN_TIMEOUT =
    5 * 60 * 1000;


/* =========================
   PIN SESSION CHECK
========================= */

function isPinSessionActive() {

    const lastActivity =
        Number(
            localStorage.getItem(
                PIN_SESSION_KEY
            )
        );


    if (!lastActivity) {

        return false;

    }


    return (
        Date.now() -
        lastActivity <
        PIN_TIMEOUT
    );

}


function updatePinActivity() {

    if (
        !isPinSessionActive()
    ) {

        return;

    }


    localStorage.setItem(
        PIN_SESSION_KEY,
        Date.now().toString()
    );

}


/* =========================
   PIN ACTIVITY
========================= */

document.addEventListener(
    "click",
    updatePinActivity
);


document.addEventListener(
    "touchstart",
    updatePinActivity
);


document.addEventListener(
    "keydown",
    updatePinActivity
);


/* =========================
   START
========================= */

async function startJar2() {

    const loggedIn =
        await loadCurrentUser();


    if (!loggedIn) {

        return;

    }


    /*
       Require an active PIN session.
    */

    if (
        !isPinSessionActive()
    ) {

        sessionStorage.setItem(
            "pin_return_url",
            "jar2.html"
        );


        window.location.href =
            "pin.html";


        return;

    }


    /*
       PIN session is active.

       Activity-based timeout means the
       15-minute period is refreshed by
       user interaction.
    */

    updatePinActivity();


    await loadJar2();

}


startJar2();
