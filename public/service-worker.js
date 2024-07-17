const Static_Cache_Name = 'Static-Page-Cache-v1';
const Dynamic_Cache_Name = "Dynamic-Page-Cache";
const Server = "https://chaos-schedule-application.onrender.com";
const urlsToCache = [
    `/`,
    '/Task_panel/Task_css/Task.css',
    "/Task_panel/Task_css/Last_Page.css",
    "/Task_panel/Task_css/Log_In_Page.css",
    "/Task_panel/Task_css/Page_1.css",
    "/Task_panel/Task_css/Page_2.css",
    "/Task_panel/Task_css/Page_3.css",
    "/Task_panel/Task_css/Page_All.css",

    "/Task_panel/manifest.json",
    "/Task_panel/audios/civil-defense-siren-128262.mp3",
    "/Task_panel/icons/icon-192x192.png",
    "/Task_panel/icons/icon-512x512.png",

    '/Task_panel/Task_functions/Task.js',
    "/Task_panel/Task_functions/Function_Tools.js",
    "/Task_panel/Task_functions/Page_All.js",
    "/Task_panel/Task_functions/Page_1.js",
    "/Task_panel/Task_functions/Page_2.js"
];

self.addEventListener("install", event =>
{
    event.waitUntil((async () =>
    {
        try
        {
            let cache = await caches.open(Static_Cache_Name);
            await cache.addAll(urlsToCache);
            console.log("Cache Saving Done");
        }
        catch(error)
        {
            console.error("Failed to open cache: ", error);
        }
    })()
    )
});

self.addEventListener('activate', event =>
{
    const cacheWhitelist = [Static_Cache_Name, Dynamic_Cache_Name];
    event.waitUntil((async () =>
    {
        let Cache_Names = await caches.keys();
        return Promise.all(Cache_Names.map(Cache_Name =>
        {
            if(cacheWhitelist.indexOf(Cache_Name) === -1) return caches.delete(Cache_Name);
        }))
    })()
    )
})

self.addEventListener("fetch", event =>
{
    event.respondWith((async () =>
    {
        if(event.request.method === "PUT")
        {
            try
            {
                if(event.request.clone().url === `${Server}/Save`|| event.request.clone().url === `${Server}/create_an_account`)
                {
                    let Cache = await caches.open(Dynamic_Cache_Name);  
                    let response = new Response(JSON.stringify(await event.request.clone().json()), {
                        status: 200,
                        statusText: "OK",
                        type: "basic",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    await Cache.put(event.request.clone().url, response.clone());
                    response = await fetch(event.request.clone());
                    return response;
                }

                if(event.request.clone().url === `${Server}/login`)
                {
                    let response = await fetch(event.request.clone());
                    let Cache = await caches.open(Dynamic_Cache_Name);   
                    await Cache.put(event.request.clone().url, response.clone());
                    return response;
                }
            }
            catch(error)
            {
                if(event.request.clone().url === `${Server}/Save` || event.request.clone().url === `${Server}/create_an_account` || event.request.clone().url === `${Server}/login`)
                {
                    let response = new Response("You're offline", {
                        status: 200,
                        statusText: "OK",
                        type: "basic",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    return response;
                }
            }  
        }

        let Static_Cache = await caches.open(Static_Cache_Name);
        let response = await Static_Cache.match(event.request);
        if(response) return response;

        let Dynamic_Cache = await caches.open(Dynamic_Cache_Name);
        response = await Dynamic_Cache.match(event.request);
        if(response) return response;

        response = await fetch(event.request);
        return response;
    })()
    );
})