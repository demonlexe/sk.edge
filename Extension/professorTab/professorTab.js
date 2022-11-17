import { createGradeChart } from "../common/gradeChart.js";
import { getLocalStorage } from "../localStorage.js";

const mockData = {
    professorId: "test",
    professor: "Jason Smith",
    rmp: 2.3,
    teacherRatingTags: [
        {
            "tagCount": 26,
            "tagName": "Tough grader"
        },
        {
            "tagCount": 3,
            "tagName": "Get ready to read"
        },
        {
            "tagCount": 3,
            "tagName": "Participation matters"
        },
        {
            "tagCount": 10,
            "tagName": "Skip class? You won't pass."
        },
        {
            "tagCount": 2,
            "tagName": "Tests are tough"
        },
        {
            "tagCount": 1,
            "tagName": "Tests? Not many"
        },
        {
            "tagCount": 1,
            "tagName": "Inspirational"
        },
        {
            "tagCount": 6,
            "tagName": "Lots of homework"
        }
    ],
    grades: [{
        section: "007",
        academicSession: "Spring 2021",
        distribution: [5, 8, 4, 2, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    }, {
        section: "008",
        academicSession: "Fall 2021",
        distribution: [7, 5, 7, 2, 3, 1, 0, 2, 0, 0, 1, 0, 0],
    }, {
        section: "009",
        academicSession: "Spring 2022",
        distribution: [8, 6, 7, 4, 0, 3, 2, 0, 0, 0, 1, 1, 0],
    }],
    difficulty: 3.5,
    wouldTakeAgainPercent: 67,
	subjectPrefix: "CS",
	courseNumber: "2337"
};

const MAX_TAGS_TO_DISPLAY = 6;

const params = new URLSearchParams(document.location.search);
const professorId = params.get("professorId");
const rmpId = params.get("rmpId");
const professor = params.get("professor");

const data = await getLocalStorage("professor_data");

// get data with professorId
console.log("data from localStorage is ",data);
const professorData = data.filter((elem) => (elem.professorId == professorId || elem.id == rmpId || elem.professor == professor))[0];
console.log(professorData);

$('#return-btn').on('click', async () => {
    const lastCourseFetched = await getLocalStorage("last_course_fetched");
    const professors = await getLocalStorage("professors");
    window.location = `../courseTab/courseTab.html?subjectPrefix=${lastCourseFetched.subjectPrefix}&courseNumber=${lastCourseFetched.courseNumber}&professors=${professors}`;
});

let currentGraphIndex = 0;
let currentChart = null;

updateProfessorData(professorData);

function updateProfessorData(data) {
    if (!data) {
        console.error("professTab.js: updateProfessorData: professorData passed is undefined.")
        return;
    }
    $("#prof-name").text(data.professor);
    $("#prof-rating-val").text(data.rmp ? data.rmp : "_");

	const gradesQuery = `${data.professor.replace(" ", "+")}+${data.subjectPrefix}+${data.courseNumber}`;
	$("#utd-grades-link").on('click', funct => {
		window.open(`https://utdgrades.com/results?search=${gradesQuery}`,'_blank');
    });
    
    $("#rmp-link").on('click', funct => {
        if (data.id)
        {
            window.open(`https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${data.id}`,'_blank');
        }
    });

    $('#reddit-link').on('click', funct => {
        window.open(`https://www.reddit.com/search/?q=${gradesQuery}`,'_blank');
    });

    $('#coursebook-link').on('click', funct => {
        window.open(`https://coursebook.utdallas.edu/`, '_blank');
    });

    if (data.rmp == "_" || data.rmp == "N/A" || !data.rmp) {
        $("#prof-rating-val").css("color", "black");
        $("#prof-rating-val").css("font-style", "italic");
    }
    else if (data.rmp < 2) {
        $("#prof-rating-val").css("color", "red");
    } else if (data.rmp < 3) {
        $("#prof-rating-val").css("color", "orange");
    } else if (data.rmp < 4) {
        $("#prof-rating-val").css("color", "green");
    } else {
        $("#prof-rating-val").css("color", "lime");
    }
    
    let profDifficulty = data.difficulty && !isNaN(data.difficulty) && data.difficulty >= 1 ? data.difficulty : "_";
    $("#prof-difficulty-val").text(profDifficulty);
    if (profDifficulty == "_") {
        $("#prof-difficulty-val").css("color", "black");
        $("#prof-difficulty-val").css("font-style", "italic");
    }
    else if (profDifficulty < 2) {
        $("#prof-difficulty-val").css("color", "lime");
    } else if (profDifficulty < 3) {
        $("#prof-difficulty-val").css("color", "green");
    } else if (profDifficulty < 4) {
        $("#prof-difficulty-val").css("color", "orange");
    } else {
        $("#prof-difficulty-val").css("color", "red");
    }

    // console.log("Percent is ",data.wouldTakeAgainPercent);
    let wouldTakePercent = data.wouldTakeAgainPercent && !isNaN(data.wouldTakeAgainPercent) && data.wouldTakeAgainPercent >= 0 ? data.wouldTakeAgainPercent.toFixed(1) : "_";
    $("#prof-would-take-again-val").text(wouldTakePercent);
    if (wouldTakePercent == "_") {
        $("#prof-would-take-again-val").css("color", "black");
        $("#prof-would-take-again-val").css("font-style", "italic");
    }
    else if (data.wouldTakeAgainPercent > 80) {
        $("#prof-would-take-again-val").css("color", "lime");
    } else if (data.wouldTakeAgainPercent > 60) {
        $("#prof-would-take-again-val").css("color", "green");
    } else if (data.wouldTakeAgainPercent > 40) {
        $("#prof-would-take-again-val").css("color", "orange");
    } else {
        $("#prof-would-take-again-val").css("color", "red");
    }

    // display RMP tags if they exist
    if (data.teacherRatingTags?.length > 0) {
        const orderedTags = data.teacherRatingTags.sort((a, b) => b.tagCount - a.tagCount);
        // loop through ordered tags 
        for (let i = 0; i < orderedTags.length && i < MAX_TAGS_TO_DISPLAY; i++) {
            $("#prof-tag-container").append(`
                <button type="button" class="btn btn-light text-wrap" 
                style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .7rem; margin:2px">
                    ${orderedTags[i].tagName.toUpperCase()}
                </button>
            `);
        };
    }

    if (!data.grades || data.grades.length === 0) {
        $(`#grades-container`).append(
            `<div class="card-footer text-muted">
            No grade data available
        </div>`
        );
        return;
    }

    // append grade chart
    $(`#grades-container`).append(
        `<canvas id="grades-canvas" class="w-100 h-100"></canvas>`
    );
    
    const gradeObject = data.grades[0];
    // get chart place
    const ctx = document.getElementById(`grades-canvas`).getContext("2d");
    currentChart = createGradeChart(ctx, gradeObject.distribution);
    
    $('#grades-container').append(` 
        <div id="grades-arrows" class="d-flex justify-content-around">
            <button id="btn-get-prev-chart" class="btn btn btn-outline-dark btn-sm inline-with-padding">&lt;</button>
            <h5 id="grade-section" class="text-muted">${data.subjectPrefix} ${data.courseNumber}.${gradeObject.section} (${gradeObject.academicSession})</h5>
            <button id="btn-get-next-chart" class="btn btn btn-outline-dark btn-sm inline-with-padding">&gt;</button>
        </div>`);

    $('#btn-get-prev-chart').on('click', () => {
        renderNextGradeChart(-1, data);
    });

    $('#btn-get-next-chart').on('click', () => {
        renderNextGradeChart(1, data);
    });
}

function renderNextGradeChart(delta, data) {
    currentGraphIndex += delta;
    const gradeObject = data.grades[Math.abs(currentGraphIndex % data.grades.length)];
    currentChart?.destroy();
    const ctx = document.getElementById(`grades-canvas`).getContext("2d");
    currentChart = createGradeChart(ctx, gradeObject.distribution);
    $('#grade-section').text(`${data.subjectPrefix} ${data.courseNumber}.${gradeObject.section} (${gradeObject.academicSession})`); 
}