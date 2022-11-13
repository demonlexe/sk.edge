
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

import { getData, setData } from "./chrome_store.js";

async function setupClicked() {
    let gpa = $("#input-gpa").val();
    let school = $("#input-school").val();
    if (gpa && school && gpa.length >= 1 && school.length >= 3) {
        window.location="./dashboardTab/dashboardTab.html";
        await setData('student_gpa',gpa);
        await setData('student_school',school);
        await setData('user_setup_complete',true);
    } else {
        if (!gpa || gpa.length < 1) {
            $("#input-gpa").addClass("highlightedElement");
        }
        if (!school || school.length < 3) {
            $("#input-school").addClass("highlightedElement");
        }
    }   
}

function checkLength(elem, num) {
    if (elem && elem.val().length >= num) {
        elem.removeClass("highlightedElement");
    }
}

const isComplete = await getData('user_setup_complete');
console.log("The value of isComplete is " + isComplete);
if (isComplete != null && isComplete == true) {
    // Then user has already completed setup and we have their data.
    window.location = "./dashboardTab/dashboardTab.html";
}
let sendBtn = $("#send-button");

let gpaInput = $("#input-gpa");
let schoolInput = $("#input-school");

sendBtn.on("click", setupClicked);

gpaInput.on("keyup", funct => {checkLength(gpaInput, 1)});
schoolInput.on("keyup", funct => {checkLength(schoolInput, 3)});
gpaInput.on("focusout", funct => {checkLength(gpaInput, 1)});
schoolInput.on("focusout", funct => {checkLength(schoolInput, 3)});
