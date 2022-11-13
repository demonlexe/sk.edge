//ADAM WORK HERE
// Write some logic to decide which html page to actually open
import { getData, setData } from "./chrome_store.js";

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
            const { coursePrefix, courseNumber, professors } = request.payload;
            break;
        case messageType.SHOW_PROFESSOR_TAB:
            // TODO
            break;
        default:
            console.log("Unknown message type");
    }
  }
);

const isComplete = await getData('user_setup_complete');
console.log("The value of isComplete is " + isComplete);
if (isComplete != null && isComplete == true) {
    // Then user has already completed setup and we have their data.
    window.location = "./dashboardTab/dashboardTab.html";
}
else {
    window.location = './setupTab/setupTab.html';
}



