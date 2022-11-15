import { getData, setData } from "../chrome_store.js";
import { setNebulaAPIKey } from "../nebula.js";

let backBtn = $("#back-btn");
let saveBtn = $("#save-btn");

async function saveSettingsClicked() {
    let gpa = $("#settings-gpa").val();
    let school = $("#settings-school").val();
    let nebulaApiKey = $("#settings-api-key").val();

    let missingGpa = false;
    let missingSchool = false;
    let missingApiKey = false;
    if (!gpa || gpa.length < 1) {
        missingGpa = true;
    }
    if (!school || school.length < 3) {
        missingSchool = true;
    }
    if (!nebulaApiKey || nebulaApiKey.length < 10) {
        missingApiKey = true;
    }

    $("#settings-missing-alert").remove();
    $("#settings-missing-api-key-alert").remove();
    $("#save-successful").remove();
    if (!missingGpa && !missingSchool && !missingApiKey) {
        await setData('student_gpa',gpa);
        await setData('student_school',school);
        await setData('nebulaApiKey',nebulaApiKey);
        setNebulaAPIKey(nebulaApiKey);
        $("#settings-card").append(
            `<div id="save-successful" class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Settings saved!</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`
        );
    } else {
        if (missingGpa || missingSchool) {
            let missingStr = (missingGpa && missingSchool) ? "Please input your GPA and School!" : ((missingGpa) ? "Please input your GPA!" : "Please input your School!");
            $("#settings-card").append(`
            <div id="settings-missing-alert" class="alert alert-warning alert-dismissible fade show" role="alert">
            ${missingStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
        }
        if (missingApiKey) {
            let missingStr = "Hmm.. Looks like you still need an API key."
            $("#settings-card").append(`
            <div id="settings-missing-api-key-alert" class="alert alert-warning alert-dismissible fade show" role="alert">
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