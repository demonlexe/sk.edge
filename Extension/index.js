
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
let setupPg = $("#setup-page");
let settingsPg = $("#settings-page");
let dashPg = $("#dashboard-page");

async function saveSettingsClicked() {
    let gpa = $("#settings-gpa").val();
    let school = $("#settings-school").val();
    if (gpa && school && gpa.length >= 1 && school.length >= 3) {
        await setData('student_gpa',gpa);
        await setData('student_school',school);
    } else {
        if (!gpa || gpa.length < 1) {
            $("#input-gpa").addClass("highlightedElement");
        }
        if (!school || school.length < 3) {
            $("#input-school").addClass("highlightedElement");
        }
    } 
}

function settingsBackBtnClick(backBtn, goTo) {
    if (!backBtn) { return false; }

    settingsPg = backBtn.closest(".mainPg");

    $("body").prepend(goTo);
    goTo.removeClass("hiddenElement");
    settingsPg.detach();
}

async function settingsClicked() {
    dashPg = dashPg.detach();
    settingsPg.removeClass("hiddenElement");
    $("body").prepend(settingsPg);

    let gpa = await getData('student_gpa');
    console.log("settingsClicked(): gpa is ",gpa)
    let school = await getData('student_school');
    let gpaElem = $("#settings-gpa");
    let schoolElem = $("#settings-school");
    if (gpaElem && schoolElem)
    {
        if (gpa) {
            gpaElem.val(gpa);
        }
        if (school) {
            schoolElem.val(school);
        }
    }
}

async function setupClicked() {
    let gpa = $("#input-gpa").val();
    let school = $("#input-school").val();
    if (gpa && school && gpa.length >= 1 && school.length >= 3) {
        setupPg = setupPg.detach();
        dashPg.removeClass("hiddenElement");
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
    setupPg = setupPg.detach();
    $("#dashboard-page").removeClass("hiddenElement");
}

let sendBtn = $("#send-button");
let settingsBtn = $("#settings-btn");
let backBtn = $("#back-btn");
let saveBtn = $("#save-btn");
let gpaInput = $("#input-gpa");
let schoolInput = $("#input-school");

backBtn.on("click", funct => {settingsBackBtnClick(backBtn, dashPg)});
sendBtn.on("click", setupClicked);
settingsBtn.on("click", settingsClicked);
saveBtn.on("click", saveSettingsClicked);

gpaInput.on("keyup", funct => {checkLength(gpaInput, 1)});
schoolInput.on("keyup", funct => {checkLength(schoolInput, 3)});
gpaInput.on("focusout", funct => {checkLength(gpaInput, 1)});
schoolInput.on("focusout", funct => {checkLength(schoolInput, 3)});
