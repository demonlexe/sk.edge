import { getData, setData } from "../chrome_store.js";

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

    window.location = goTo;
}

let backBtn = $("#back-btn");
let saveBtn = $("#save-btn");

backBtn.on("click", funct => {settingsBackBtnClick(backBtn, "../dashboardTab/dashboardTab.html")});
saveBtn.on("click", saveSettingsClicked);

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