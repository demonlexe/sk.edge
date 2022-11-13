import { getData } from "../chrome_store.js";
import { createGradeChart } from "../common/gradeChart.js";

const mockData = {
    professorId: "test",
    professor: "Jason Smith",
    rmp: 2.3,
    rmpTags: ["Tough Grader", "Smart", "Helpful", "Engaging"],
    grades: [5, 8, 4, 2, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    endDate: null,
    difficulty: 3.5,
    wouldTakeAgainPercent: 67,
	subjectPrefix: "CS",
	courseNumber: "2337"
};

const params = new URLSearchParams(document.location.search);
const professorId = params.get("professorId");
const data = await getData("professor_data");

// get data with professorId
const professorData = data.filter((elem) => elem.professorId == professorId)[0];
console.log(professorData);


// keeping if we want to add later
// $('#return-btn').on('click', () => {
//   window.location = "../courseTab/courseTab.html";
// });

updateProfessorData(professorData);

function updateProfessorData(data) {
    $("#prof-name").text(data.professor);
    $("#prof-rating-val").text(data.rmp);

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

    if (data.rmp < 2) {
        $("#prof-rating-val").css("color", "red");
    } else if (data.rmp < 4) {
        $("#prof-rating-val").css("color", "orange");
    } else if (data.rmp < 3) {
        $("#prof-rating-val").css("color", "green");
    } else {
        $("#prof-rating-val").css("color", "lime");
    }

    $("#prof-difficulty-val").text(data.difficulty);
    if (data.difficulty < 2) {
        $("#prof-difficulty-val").css("color", "lime");
    } else if (data.difficulty < 3) {
        $("#prof-difficulty-val").css("color", "green");
    } else if (data.difficulty < 4) {
        $("#prof-difficulty-val").css("color", "orange");
    } else {
        $("#prof-difficulty-val").css("color", "red");
    }

    $("#prof-would-take-again-val").text(data.wouldTakeAgainPercent.toFixed(1));
    if (data.wouldTakeAgainPercent > 80) {
        $("#prof-would-take-again-val").css("color", "lime");
    } else if (data.wouldTakeAgainPercent > 60) {
        $("#prof-would-take-again-val").css("color", "green");
    } else if (data.wouldTakeAgainPercent > 40) {
        $("#prof-would-take-again-val").css("color", "orange");
    } else {
        $("#prof-would-take-again-val").css("color", "red");
    }

    // append RMP tags if they exist
    if (data.rmpTags?.length > 0) {
        $(`<div id="prof-tag-container" class="col d-flex flex-wrap justify-content-center align-items-center p-0 my-4"></div>`).insertAfter(`#prof-rmp-row-2`);
        data.rmpTags.forEach((tag) => {
            $("#prof-tag-container").append(`
        <button type="button" class="btn btn-light text-wrap" 
          style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .7rem; margin:2px">
          ${tag}
        </button>
        `);
        });
    }

    if (!data.grades || !data.grades.length) {
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
    // get chart place
    const ctx = document.getElementById(`grades-canvas`).getContext("2d");
    createGradeChart(ctx, data.grades);
}
