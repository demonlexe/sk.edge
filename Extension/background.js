chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if (
        /^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/courses\/.+$/.test(
            details.url
        )
    ) {
        chrome.scripting.executeScript({
            target: {
                tabId: details.tabId,
            },
            files: ["./content-script/index.js"],
        });
    } else {
        // reset the extension popup
        chrome.action.setPopup({
            popup: "index.html",
        });
        chrome.action.setIcon({path: './assets/gray.png'});
        chrome.action.setBadgeText({text: ""});
    }
});

const messageType = {
    SHOW_COURSE_TAB: "SHOW_COURSE_TAB",
    SHOW_PROFESSOR_TAB: "SHOW_PROFESSOR_TAB",
    REQUEST_PROFESSORS: "REQUEST_PROFESSORS"
};

// listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    switch (request.type) {
        case messageType.SHOW_COURSE_TAB:
            const { subjectPrefix, courseNumber, professors } = request.payload;
            chrome.action.setPopup({
                popup: `./courseTab/courseTab.html?subjectPrefix=${subjectPrefix}&courseNumber=${courseNumber}&professors=${professors.join(",")}`,
            });
            chrome.action.setIcon({path: './assets/hello_extensions.png'});
            chrome.action.setBadgeText({text: "!"});
            chrome.action.setBadgeBackgroundColor({color: 'green'});
            break;
        case messageType.SHOW_PROFESSOR_TAB:
            // TODO
            break;
        case messageType.REQUEST_PROFESSORS:
            // TODO: make this its own function or something... 
            console.log("Running request professors...")

            var urls = [];
            
            var startTime = Date.now();

            // make a list of urls for promises
            for (let i = 0; i < request.profName.length; i++) {
                urls.push(`https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(request.profName[i])}&sid=${btoa(`School-${request.schoolId}`)}`);
            }

            // fetch professor ids from each url
            Promise.all(urls.map(u=>fetch(u))).then(responses =>
                Promise.all(responses.map(res => res.text()))
            ).then(texts => {
                var profIds = [];

                texts.forEach(text => {
                    const regex = /"legacyId":(\d+)/;
                    const match = text.match(regex);
                    if (match != null) {
                        profIds.push(match[1]);
                    }
                })

                var urlProperties = [];
                const url = "https://www.ratemyprofessors.com/graphql";

                // create fetch objects for each professor id
                profIds.forEach(professorID => {
                    headers["Referer"] = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorID}`
                    professorquery["variables"]["id"] = btoa(`Teacher-${professorID}`)
                    urlProperties.push({
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(professorquery)
                    })
                })

                // fetch professor info by id with graphQL
                Promise.all(urlProperties.map(u=>fetch(url, u))).then(responses =>
                    Promise.all(responses.map(res => res.json()))
                ).then(ratings => {
                    for (let i = 0; i < ratings.length; i++) {
                        if (ratings[i] != null && ratings[i].hasOwnProperty("data") && ratings[i]["data"].hasOwnProperty("node")) {
                            ratings[i] = ratings[i]["data"]["node"];
                        }
                    }

                    console.log(Date.now() - startTime);
                    sendResponse(ratings);

                })
            }
            ).catch(error => console.log(error))
            return true; // deleting this breaks the code
            break;
        default:
            console.log("Unknown message type");
    }
});

/*
-------------------------------------------
--------------- SCRAPING ------------------
-------------------------------------------
*/

const headers = {
    "Authorization": "Basic dGVzdDp0ZXN0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "Content-Type": "application/json"
}

const professorquery = {
    "query":"query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {id school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent}}}",
    "variables": {}
}
