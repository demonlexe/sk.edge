
function setupClicked() {
    let gpa = $("#input-gpa").val();
    let school = $("#input-school").val();
    if (gpa.length >= 1 && school.length >= 1) {
        console.log(gpa, school);
    let setupPg = $("#setup-page").detach();
    $("#dashboard-page").removeClass("hiddenElement");
    }
}

$("#send-button").on("click", setupClicked);

