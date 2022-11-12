
function setupClicked() {
    let gpa = $("#input-gpa").val();
    let school = $("#input-school").val();
    if (gpa.length >= 1 && school.length >= 3) {
        console.log(gpa, school);
        let setupPg = $("#setup-page").detach();
    $("#dashboard-page").removeClass("hiddenElement");
        //FIXME; store this somewhere
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

$("#send-button").on("click", setupClicked);
let gpaInput = $("#input-gpa");
let schoolInput = $("#input-school");
gpaInput.on("keyup", funct => {checkLength(gpaInput, 1)});
schoolInput.on("keyup", funct => {checkLength(schoolInput, 3)});
gpaInput.on("focusout", funct => {checkLength(gpaInput, 1)});
schoolInput.on("focusout", funct => {checkLength(schoolInput, 3)});
