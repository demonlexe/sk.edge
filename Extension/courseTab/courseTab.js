import { getLocalStorage, setLocalStorage } from "../localStorage.js";
import { createGradeChart } from "../common/gradeChart.js";
import { getProfessorGradeList } from "../nebula.js";

const params = new URLSearchParams(document.location.search);
const subjectPrefix = params.get("subjectPrefix");
const courseNumber = params.get("courseNumber");
const professors = params.get("professors").split(",");
console.log(subjectPrefix, courseNumber, professors);

async function settingsClicked() {
    window.location = `../settingsTab/settingsTab.html?callingPage=courseTab&subjectPrefix=${subjectPrefix}&courseNumber=${courseNumber}&professors=${professors.join(",")}`;
}

function compareRmpScore(modifier, considerHasGradeDistribution) {
    let professorElements = $("#prof-table").children();
    
    // Sort professors.
    professorElements.sort(function(a,b) {
        let rmpScoreA = $(a).find('[id*="rmp-score"]').text();
        let rmpScoreB = $(b).find('[id*="rmp-score"]').text();
        // console.log("A is " + rmpScoreA," B is " + rmpScoreB);

        if (isNaN(rmpScoreA) && isNaN(rmpScoreB)) {
            if (considerHasGradeDistribution) //Then we want to know if one has grades and the other doesn't.
            {
                let canvasElemA = $(a).find('[id*="no-grade-data"]').text();
                let canvasElemB = $(b).find('[id*="no-grade-data"]').text();
                if (canvasElemA && !canvasElemB){
                    // Then elemA has no data, and B does
                    return 1;
                }
                else if (canvasElemB && !canvasElemA) {
                    // Then elemB has data, and elemA does not
                    return -1;
                }
                
            }
            return 0; //N/A is equal
        }
        else if (isNaN(rmpScoreB)) {
            return -1;
        }
        else if (isNaN(rmpScoreA)) {
            return 1;
        }

        if (modifier == "rmp-ascend") {
            return (rmpScoreB - rmpScoreA);
        }
        else if (modifier == "rmp-descend") {
            return (rmpScoreA - rmpScoreB);
        }
        return 0;
    })

    for (const prof of professorElements) {
        // Detach from current order, insert at end
        $(prof).detach();
        $("#prof-table").append($(prof));
    }
}

async function reorderGrid(sortby) {
    switch (sortby) {
        case "rmp-ascend":
        {
            compareRmpScore(sortby, true);
            break;
        }
        case "rmp-descend":
        {
            compareRmpScore(sortby, true);
            break;
        }
    }
}

let settingsBtn = $("#settings-btn");
let sortByBtn = $("#sort-by-selection");
sortByBtn.on("change", () => {
    reorderGrid(sortByBtn.val());
});
settingsBtn.on("click", settingsClicked);

function getData() {
    return new Promise(async (resolve, reject) => {
        // check if course has been cached 
        try {
            const lastCourseFetched = await getLocalStorage("last_course_fetched");
            await setLocalStorage("professors", professors);
            if (subjectPrefix == lastCourseFetched?.subjectPrefix && courseNumber == lastCourseFetched?.courseNumber) {
                console.log("Using cached professor data");
                const data = await getLocalStorage("professor_data");
                resolve(data);
            }
            else {
                console.log("Fetching professor data");
                const parsedProfessors = []
                professors.forEach(elem => {
                    const arr = elem.split(' ');
                    parsedProfessors.push(arr[0] + " " + arr[arr.length - 1]);
                });

                const data = await getProfessorGradeList(subjectPrefix, courseNumber, parsedProfessors);
                await setLocalStorage("professor_data", data);
                await setLocalStorage("last_course_fetched", { subjectPrefix, courseNumber });
                await setLocalStorage("professors", professors);
                resolve(data);
            }
        }
        catch (err) {
            console.log("Fetch failed: " + err.message);
            $("body").append(
                `<div id="fetch-failed-alert" class="alert alert-danger fade show" role="alert">
                    <strong>${err.message}.</strong>
                    This is likely due to an incorrect API Key; please contact the developers.
                </div>`
            );
            let mySpinner = $("#spinner-div").detach();
            reject(err);
        }
    });
}

const data = await getData();

//Detach the spinner when the data has been obtained.
let mySpinner = $("#spinner-div").detach();
// $(`#prof-table`).append(`<div class="p-2 bg-light border" id="course">${subjectPrefix + courseNumber}</div>`);


data.forEach((elem, idx) => {

    // make a new professor card
    $("#prof-table").append(
        `<div class="card" id="prof-${idx}">
            <div class="card-header d-flex justify-content-between align-items-center">
                <span><b>${elem.professor}</b></span>
                <button id="prof-details-button-${idx}"class="btn btn-light" type="button">See detailed info</button>
            </div>
            <div class="card-body">
            <div class="row">
                <div class="col-4">
                
                    <div class="card h-100 btn btn-light" id="rmp-${idx}" style="cursor: pointer;">
                        <div class="card-body px-0 d-flex flex-column justify-content-center">
                            <h6 class="card-subtitle mb-1 text-muted text-center">RMP SCORE</h6>
                            <h2 class="card-title text-center"><span id="rmp-score-${idx}"></span> / 5</h2>
                        </div>
                    </div>
                </div>
                <div id="grades-container-${idx}" class="col">
                </div>
            </div>
        </div>`
    );

    let rmpVal = !isNaN(elem.rmp) && elem.rmp >= 1 ? elem.rmp : "N/A";
    $(`#rmp-score-${idx}`).text(rmpVal);
    if (rmpVal == "_" || rmpVal == "N/A") {
        $(`#rmp-score-${idx}`).css("color", "black");
        $(`#rmp-score-${idx}`).css("font-style", "italic");
    }
    else if (rmpVal < 2) {
        $(`#rmp-score-${idx}`).css("color", "red");
    } else if (rmpVal < 3) {
        $(`#rmp-score-${idx}`).css("color", "orange");
    } else if (rmpVal < 4) {
        $(`#rmp-score-${idx}`).css("color", "green");
    } else {
        $(`#rmp-score-${idx}`).css("color", "lime");
    }

    $(`#rmp-${idx}`).click(() => {
        window.open(`https://www.ratemyprofessors.com/professor?tid=${elem.id}`,'_blank');
    });

    $(`#prof-details-button-${idx}`).on("click", () => {
        // console.log("clicked");
        window.location = "../professorTab/professorTab.html?professor="+elem.professor+"&rmpId="+elem.id+"&professorId=" + elem.professorId;
    });

    // if no grade data
    if (!elem.grades || !elem.grades.length) {
        $(`#grades-container-${idx}`).append(
            `<div id="no-grade-data-${idx}" class="card-footer text-muted">
                No grade data available
            </div>`
        );
        return;
    }

    $(`#grades-container-${idx}`).append(
        `<canvas id="grades-${idx}" class="w-100 h-100"></canvas>`
    );
    // get chart place
    const ctx = document.getElementById(`grades-${idx}`).getContext('2d');
    createGradeChart(ctx, elem.grades[0].distribution);
});

// Force sorting to be rmp-ascend
sortByBtn.val('rmp-ascend').trigger('change');