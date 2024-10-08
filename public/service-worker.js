const Static_Cache_Name = 'Static-Page-Cache-v1';
const Dynamic_Cache_Name = "Dynamic-Page-Cache";
const Server = "https://chaos-schedule-server.onrender.com";

const urlsToCache = [
    `/`,
    '/Task_panel/Task_css/Task.css',
    "/Task_panel/Task_css/Log_In_Page.css",
    "/Task_panel/Task_css/Page_All.css",
    "/Task_panel/Task_css/Page_1.css",
    "/Task_panel/Task_css/Page_2.css",
    "/Task_panel/Task_css/Page_3.css",
    "/Task_panel/Task_css/Page_4.css",
    "/Task_panel/Task_css/Last_Page.css",

    "/Task_panel/manifest.json",
    "/Task_panel/icons/icon-192x192.png",
    "/Task_panel/icons/icon-512x512.png",
    "/Task_panel/icons/New_Task.png",
    "/Task_panel/icons/Task.png",
    "/Task_panel/icons/Statistics.png",
    "/Task_panel/icons/Meditation.png",
    "/Task_panel/icons/Qr_Code.png",
    "/Task_panel/icons/Lock.png",
    "/Task_panel/icons/Unlock.png",

    '/Task_panel/Task_functions/Task.js',
    "/Task_panel/Task_functions/Account_Manager.js",
    "/Task_panel/Task_functions/Function_Tools.js",
    "/Task_panel/Task_functions/Page_All.js",
    "/Task_panel/Task_functions/Page_1.js",
    "/Task_panel/Task_functions/Page_2.js",
    "/Task_panel/Task_functions/Page_3.js",
    "/Task_panel/Task_functions/Page_4.js",
    "/Task_panel/Task_functions/Last_Page.js"
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
        if(event.request.clone().method === "PUT")
        {
            try
            {
                if( event.request.clone().url === `${Server}/Save` || 
                    event.request.clone().url === `${Server}/create_an_account`)
                {
                    let res = await fetch(event.request.clone());
                    if(res.clone().status === 503)
                    {
                        throw new Error("Service Suspended");
                    }
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
                    return res;
                }

                if(event.request.clone().url === `${Server}/login`)
                {
                    let response = await fetch(event.request.clone());
                    if(response.clone().status === 503)
                    {
                        throw new Error("Service Suspended");
                    }
                    let Cache = await caches.open(Dynamic_Cache_Name);   
                    await Cache.put(event.request.clone().url, response.clone());
                    return response;
                }
            }
            catch(error)
            {
                if( event.request.clone().url === `${Server}/Save` || 
                    event.request.clone().url === `${Server}/create_an_account` || 
                    event.request.clone().url === `${Server}/login`)
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
        let response = await Static_Cache.match(event.request.clone());
        if(response) return response;

        let Dynamic_Cache = await caches.open(Dynamic_Cache_Name);
        response = await Dynamic_Cache.match(event.request.clone());
        if(response) return response;

        try
        {
            response = await fetch(event.request.clone());
            if(event.request.url === `${Server}/Task_panel/audios/Alarm.mp3`)
            {
                let Cache = await caches.open(Dynamic_Cache_Name);
                let res = new Response(await response.clone().arrayBuffer(),{
                    status: 200,
                    statusText: "OK",
                    type: "basic",
                    headers: {"Content-Type": "audio/mpeg"}
                })
                await Cache.put(event.request.clone().url, res.clone());
            }
            return response;
        }
        catch(error)
        {
            console.error(error);
            if(event.request.clone().url === `${Server}/Task_panel/audios/Alarm.mp3`)
            { 
                let Cache =  await caches.open(Dynamic_Cache_Name);
                let response = await Cache.match(event.request.clone());
                return response;
            }
        }
    })()
    );
})