const data = [
    {
        professor: "John Cole",
        rmp: 5,
        grades: [0, 22, 5, 3, 9, 4, 2, 5, 2, 1, 0, 2, 5, 0]
    },
    {
        professor: "Johnba Cole",
        rmp: 3,
        grades: [0, 22, 5, 3, 9, 4, 2, 5, 2, 1, 0, 2, 5, 0]
    },
];

const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W'];

data.forEach((elem, idx) => {
    // make a new professor card
    $("#prof-table").append(
        `<div class="card" id="prof-${idx}">
            <div class="card-header">
                ${elem.professor}
            </div>
            <div class="card-body">
            <div class="row">
                <div class="col-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-1 text-muted text-center">RMP</h6>
                            <h1 class="card-title text-center" id="rmp">${elem.rmp} / 5</h5>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <canvas id="grades-${idx}" class="w-100 h-100"></canvas>
                </div>
            </div>
        </div>`
    );
    // get chart place
    const ctx = document.getElementById(`grades-${idx}`).getContext('2d');

    // format data
    var adjustedLabels = []
    var adjustedGrades = []
    for (let i = 0; i < elem.grades.length; i++) {
        if (elem.grades[i] > 0) {
            adjustedLabels.push(grades[i]);
            adjustedGrades.push(elem.grades[i]);
        }
    }

    // print chart
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: adjustedLabels,
            datasets: [{
                data: adjustedGrades,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
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