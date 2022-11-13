
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
	if (/^.*:\/\/utdallas\.collegescheduler\.com\/terms\/.*\/courses\/.+$/.test(details.url)) {
		chrome.scripting.executeScript({
			target: {
				tabId: details.tabId,
			},
			files: ["./content-script/index.js"]
		});
	}
	else {
		// reset the extension popup
		chrome.action.setPopup({
			popup: "index.html",
		})
	}
});

const messageType = {
	SHOW_COURSE_TAB: 'SHOW_COURSE_TAB',
	SHOW_PROFESSOR_TAB: 'SHOW_PROFESSOR_TAB',
}

// listen for messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    switch (request.type) {
        case messageType.SHOW_COURSE_TAB:
            const { subjectPrefix, courseNumber, professors } = request.payload;
			chrome.action.setPopup({
				popup: `./courseTab/courseTab.html?subjectPrefix=${subjectPrefix}&courseNumber=${courseNumber}&professors=${professors.join(",")}`,
			});
            break;
        case messageType.SHOW_PROFESSOR_TAB:
            // TODO
            break;
        default:
            console.log("Unknown message type");
    }
  }
);
