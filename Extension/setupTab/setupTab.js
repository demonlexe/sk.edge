import { getData, setData } from "../chrome_store.js";

async function setupClicked() {
    let gpa = $("#input-gpa").val();
    let school = $("#input-school").val();
    if (gpa && school && gpa.length >= 1 && school.length >= 3) {
        window.location="../dashboardTab/dashboardTab.html";
        await setData('student_gpa',gpa);
        await setData('student_school',school);
        await setData('user_setup_complete',true);
    } else {
        let missingGpa = false;
        let missingSchool = false;
        if (!gpa || gpa.length < 1) {
            missingGpa = true;
        }
        if (!school || school.length < 3) {
            missingSchool = true;
        }
        $("#setup-missing-alert").remove();
        if (missingGpa || missingSchool) {
            let missingStr = (missingGpa && missingSchool) ? "Please input your GPA and School!" : ((missingGpa) ? "Please input your GPA!" : "Please input your School!");
            $("#setup-card").append(`
            <div id="setup-missing-alert" class="alert alert-warning alert-dismissible fade show" role="alert">
            ${missingStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
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
    window.location = "../dashboardTab/dashboardTab.html";
}
let sendBtn = $("#send-button");

let gpaInput = $("#input-gpa");
let schoolInput = $("#input-school");

sendBtn.on("click", setupClicked);

gpaInput.on("keyup", funct => {checkLength(gpaInput, 1)});
schoolInput.on("keyup", funct => {checkLength(schoolInput, 3)});
gpaInput.on("focusout", funct => {checkLength(gpaInput, 1)});
schoolInput.on("focusout", funct => {checkLength(schoolInput, 3)});
