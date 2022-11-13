import { createGradeChart } from "../common/gradeChart.js";

const data = {
  professorId: "test",
  professor: "Jason Smith",
  rmp: 2.3,
  rmpTags: ["Tough Grader", "Smart", "Helpful", "Engaging"],
  grades: [5, 8, 4, 2, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  endDate: null,
}

// const params = new URLSearchParams(document.location.search);
// const professorId = params.get("professorId");

// const gradesQuery = "jason+smith+cs+2337"; //FIXME with data
// $("#utd-grades-link").on('click', funct => {
//     console.log("Clicked");
//     window.open(`https://utdgrades.com/results?search=${gradesQuery}`,'_blank');
// });


$('#prof-name').text(data.professor);
$('#prof-rating-val').text(data.rmp);

$('#prof-rating-val').css('color', 'lime');
if (data.rmp < 4) {
  $('#prof-rating-val').css('color', 'green');
}
if (data.rmp < 3) {
    $('#prof-rating-val').css('color', 'orange');
}
if (data.rmp < 2) {
    $('#prof-rating-val').css('color', 'red');
}

// append RMP tags if they exist
if (data.rmpTags.length > 0) {
  $(`#prof-rmp-row`).append(
    `<div id="prof-tag-container" class="col d-flex flex-wrap justify-content-center align-items-center p-0 my-4"></div>`
  );
  data.rmpTags.forEach(tag => {
    $('#prof-tag-container').append(`
      <button type="button" class="btn btn-light text-wrap" 
        style="--bs-btn-padding-y: .3rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .7rem; margin:2px">
        ${tag}
      </button>
      `
    )
  });
}

// append grade chart
$(`#grades-container`).append(
    `<canvas id="grades-canvas" class="w-100 h-100"></canvas>`
);
// get chart place
const ctx = document.getElementById(`grades-canvas`).getContext('2d');
createGradeChart(ctx, data.grades);
