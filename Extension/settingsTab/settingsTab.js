import { getData, setData } from "../chrome_store.js";
import { saveOptionsOnClicked } from "../common/userOptions.js";

let backBtn = $("#back-btn");
let saveBtn = $("#save-btn");

const params = new URLSearchParams(document.location.search);
const prevPage = params.get("callingPage");

function settingsBackBtnClick(backBtn, goTo) {
    if (!backBtn) { return false; }

    window.location = goTo;
}

backBtn.on("click", funct => {
    let pageLink;
    switch (prevPage)
    {
        case "courseTab":
            {
                const subjectPrefix = params.get("subjectPrefix");
                const courseNumber = params.get("courseNumber");
                const professors = params.get("professors");
                pageLink = `../courseTab/courseTab.html?subjectPrefix=${subjectPrefix}&courseNumber=${courseNumber}&professors=${professors}`
                break;
            }
        default:
            {
                pageLink = "../dashboardTab/dashboardTab.html"
                break;
            }
    }
    settingsBackBtnClick(backBtn, pageLink);
});
saveBtn.on("click", funct => {
    saveBtn.attr('disabled',true);
    saveOptionsOnClicked("settings", saveBtn);
});

let gpa = await getData('student_gpa');
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