import { getData, setData } from "../chrome_store.js";
import { saveOptionsOnClicked } from "../common/userOptions.js";

let backBtn = $("#back-btn");
let saveBtn = $("#save-btn");

function settingsBackBtnClick(backBtn, goTo) {
    if (!backBtn) { return false; }

    window.location = goTo;
}

backBtn.on("click", funct => {settingsBackBtnClick(backBtn, "../dashboardTab/dashboardTab.html")});
saveBtn.on("click", funct => {
    saveBtn.attr('disabled',true);
    saveOptionsOnClicked("settings", saveBtn);
});

let gpa = await getData('student_gpa');
let school = await getData('student_school');
let nebulaApiKey = await getData('nebulaApiKey');

let gpaElem = $("#settings-gpa");
let schoolElem = $("#settings-school");
let apiKeyElem = $("#settings-api-key");

if (gpaElem && schoolElem && apiKeyElem) 
{
    if (gpa) {
        gpaElem.val(gpa);
    }
    if (school) {
        schoolElem.val(school);
    }
    if (nebulaApiKey) {
        apiKeyElem.val(nebulaApiKey);
    }
}