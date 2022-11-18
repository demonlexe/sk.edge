import { unRegister } from "./assets/colleges.js";

/*
-------------------------------------------
--------------- RMP -----------------------
-------------------------------------------
*/

const HEADERS = {
    "Authorization": "Basic dGVzdDp0ZXN0",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    "Content-Type": "application/json"
}

const PROFESSOR_QUERY = {
    "query":"query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {legacyId school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent teacherRatingTags { tagCount tagName } ratingsDistribution { total r1 r2 r3 r4 r5 } }}}",
    "variables": {}
}

export function requestProfessors(request) {
    return new Promise((resolve, reject) => {
        console.log("Running request professors...")

        var professorUrls = [];
        
        var startTime = Date.now();

        // make a list of urls for promises
        for (let i = 0; i < request.profNames.length; i++) {
            professorUrls.push(`https://www.ratemyprofessors.com/search/teachers?query=${encodeURIComponent(request.profNames[i])}&sid=${btoa(`School-${request.schoolId}`)}`);
        }

        // fetch professor ids from each url
        Promise.all(professorUrls.map(u=>fetch(u))).then(responses =>
            Promise.all(responses.map(res => res.text()))
        ).then(texts => {
            var profIds = [];

            texts.forEach(text => {
                const regex = /"legacyId":(\d+).*?"firstName":"(\w+)","lastName":"(\w+)"/g;
                for (const match of text.matchAll(regex)) {
                    if (request.profNames.includes(match[2] + " " + match[3])) {
                        profIds.push(match[1]);
                    }
                }
            })

            var graphqlUrlProps = [];
            const graphqlUrl = "https://www.ratemyprofessors.com/graphql";

            // create fetch objects for each professor id
            profIds.forEach(professorID => {
                HEADERS["Referer"] = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${professorID}`
                PROFESSOR_QUERY["variables"]["id"] = btoa(`Teacher-${professorID}`)
                graphqlUrlProps.push({
                    method: "POST",
                    headers: HEADERS,
                    body: JSON.stringify(PROFESSOR_QUERY)
                })
            })

            // fetch professor info by id with graphQL
            Promise.all(graphqlUrlProps.map(u=>fetch(graphqlUrl, u))).then(responses =>
                Promise.all(responses.map(res => res.json()))
            ).then(ratings => {
                for (let i = 0; i < ratings.length; i++) {
                    if (ratings[i] != null && ratings[i].hasOwnProperty("data") && ratings[i]["data"].hasOwnProperty("node")) {
                        ratings[i] = ratings[i]["data"]["node"];
                    }
                }

                console.log(Date.now() - startTime);
                resolve(ratings);
            })
        }
        ).catch(error => {
            console.log(error)
            reject(error);
        });
    })
}

/*
-------------------------------------------
--------------- NEBULA --------------------
-------------------------------------------
*/
let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";

export function fetchNebulaProfessor(professorName) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };
    const getDataPromise = new Promise((resolve, reject) => {
        try {
            const nameSplit = professorName.split(" ");
            const firstName = nameSplit[0];
            const lastName = nameSplit[nameSplit.length - 1];
            fetch(
                `https://api.utdnebula.com/professor?first_name=${firstName}&last_name=${lastName}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log(err);
                    reject(null);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(null);
        }
    });

    return getDataPromise;
}

export function fetchNebulaCourse(coursePrefix, courseNumber) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(
                `https://api.utdnebula.com/course?course_number=${courseNumber}&subject_prefix=${coursePrefix}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log("Nebula error is: ",err);
                    reject(err);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(err);
        }
    });

    return getDataPromise;
}

// will be used in the future
export function fetchNebulaSections(courseReference, professorReference) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(
                `https://api.utdnebula.com/section?course_reference=${courseReference}&professors=${professorReference}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log("Nebula error is: ",err);
                    reject(err);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(err);
        }
    });

    return getDataPromise;
}

export function fetchNebulaSection(section_id) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(`https://api.utdnebula.com/section/${section_id}`, {
                method: "GET",
                headers: headers,
            })
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log(err);
                    reject(null);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(null);
        }
    });

    return getDataPromise;
}