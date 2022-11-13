import { getLocalStorage, setLocalStorage } from "../localStorage.js";
import { createGradeChart } from "../common/gradeChart.js";
import { getProfessorGradeList } from "../nebula.js";

const params = new URLSearchParams(document.location.search);
const subjectPrefix = params.get("subjectPrefix");
const courseNumber = params.get("courseNumber");
const professors = params.get("professors").split(",");
console.log(subjectPrefix, courseNumber, professors);

function getData() {
    return new Promise(async (resolve) => {
        // check if course has been cached 
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
                            <h2 class="card-title text-center">${elem.rmp} / 5</h2>
                        </div>
                    </div>
                </div>
                <div id="grades-container-${idx}" class="col">
                </div>
            </div>
        </div>`
    );

    $(`#rmp-${idx}`).click(() => {
        window.open(`https://www.ratemyprofessors.com/professor?tid=${elem.id}`,'_blank');
    });

    $(`#prof-details-button-${idx}`).on("click", () => {
        console.log("clicked");
        window.location = "../professorTab/professorTab.html?professorId=" + elem.professorId;
    });

    // if no grade data
    if (!elem.grades || !elem.grades.length) {
        $(`#grades-container-${idx}`).append(
            `<div class="card-footer text-muted">
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
    createGradeChart(ctx, elem.grades);
});

// const ctx = document.getElementById('myChart').getContext('2d');
// const myChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: ['A+', 'A', 'B', 'C', 'D', 'F'],
//         datasets: [{
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         },
//         responsive: false,
//         plugins: {
//             legend: {
//                 display: false
//             }
//         }
//     }
// });