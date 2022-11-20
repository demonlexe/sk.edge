import { 
    requestProfessors,
    fetchNebulaCourse,
    fetchNebulaProfessor,
    fetchNebulaSections
 } from './fetch.js'

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
    REQUEST_PROFESSORS: "REQUEST_PROFESSORS",
    GET_NEBULA_PROFESSOR: "GET_NEBULA_PROFESSOR",
    GET_NEBULA_COURSE: "GET_NEBULA_COURSE",
    GET_NEBULA_SECTIONS: "GET_NEBULA_SECTIONS"
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
            requestProfessors(request).then(response => sendResponse(response));
            return true;
            break;
        case messageType.GET_NEBULA_PROFESSOR:
            fetchNebulaProfessor(request.professorName).then(response => sendResponse(response));
            return true;
            break;
        case messageType.GET_NEBULA_COURSE:
            fetchNebulaCourse(request.coursePrefix, request.courseNumber).then(response => sendResponse(response));
            return true;
            break;

        case messageType.GET_NEBULA_SECTIONS:
            fetchNebulaSections(request.courseReference, request.professorReference).then(response => sendResponse(response));
            return true;
            break;

        default:
            console.log("Unknown message type");
    }
});
