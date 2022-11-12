
function setupClicked() {
    let gpa = $("#input-gpa").val();
    let school = $("#input-school").val();
    if (gpa.length >= 1 && school.length >= 3) {
        let setupPg = $("#setup-page").detach();
         $("#dashboard-page").removeClass("hiddenElement");
        chrome.storage.sync.set({student_gpa: gpa}, function() {
            console.log('student_gpa is set to ' + gpa);
        });
        chrome.storage.sync.set({student_school: school}, function() {
            console.log('student_school is set to ' + school);
        });
        chrome.storage.sync.set({user_setup_complete: true}, function() {
            console.log('user_setup_complete is set to true');
        });
    } else {
        if (gpa.length < 1) {
            $("#input-gpa").addClass("highlightedElement");
        }
        if (school.length < 3) {
            $("#input-school").addClass("highlightedElement");
        }
    }   
}

function checkLength(elem, num) {
    if (elem && elem.val().length >= num) {
        elem.removeClass("highlightedElement");
    }
}

chrome.storage.sync.get('user_setup_complete', function(result) {
    if (result.user_setup_complete) {
        // Then user has already completed setup and we have their data.
        let setupPg = $("#setup-page").detach();
        $("#dashboard-page").removeClass("hiddenElement");
    }
});

$("#send-button").on("click", setupClicked);
let gpaInput = $("#input-gpa");
let schoolInput = $("#input-school");
gpaInput.on("keyup", funct => {checkLength(gpaInput, 1)});
schoolInput.on("keyup", funct => {checkLength(schoolInput, 3)});
gpaInput.on("focusout", funct => {checkLength(gpaInput, 1)});
schoolInput.on("focusout", funct => {checkLength(schoolInput, 3)});
