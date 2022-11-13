import { getData, setData } from "../chrome_store.js";

let backBtn = $("#back-btn");
let saveBtn = $("#save-btn");

async function saveSettingsClicked() {
    let gpa = $("#settings-gpa").val();
    let school = $("#settings-school").val();
    $("#save-successful").remove();
    if (gpa && school && gpa.length >= 1 && school.length >= 3) {
        await setData('student_gpa',gpa);
        await setData('student_school',school);
        $("#settings-card").append(
            `<div id="save-successful" class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Settings saved!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`
        );
    } else {
        let missingGpa = false;
        let missingSchool = false;
        if (!gpa || gpa.length < 1) {
            missingGpa = true;
        }
        if (!school || school.length < 3) {
            missingSchool = true;
        }
        $("#settings-missing-alert").remove();
        if (missingGpa || missingSchool) {
            let missingStr = (missingGpa && missingSchool) ? "Please input your GPA and School!" : ((missingGpa) ? "Please input your GPA!" : "Please input your School!");
            $("#settings-card").append(`
            <div id="settings-missing-alert" class="alert alert-warning alert-dismissible fade show" style="opacity:0.1" role="alert">
            ${missingStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
        }
    }     
    
}

function settingsBackBtnClick(backBtn, goTo) {
    if (!backBtn) { return false; }

    window.location = goTo;
}


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