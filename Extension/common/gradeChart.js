const letterGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', 'W'];

export function createGradeChart(ctx, grades) {
  var adjustedLabels = []
  var adjustedGrades = []
  for (let i = 0; i < grades.length; i++) {
    if (grades[i] > 0) {
      adjustedLabels.push(letterGrades[i]);
      adjustedGrades.push(grades[i]);
    }
  }

  // print chart
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: adjustedLabels,
      datasets: [{
        data: adjustedGrades,
        backgroundColor: [
          'rgba(54, 255, 0, 0.7)',
          'rgba(109, 239, 0, 0.7)',
          'rgba(140, 223, 0, 0.7)',
          'rgba(162, 207, 0, 0.7)',
          'rgba(179, 190, 0, 0.7)',
          'rgba(192, 173, 0, 0.7)',
          'rgba(203, 155, 0, 0.7)',
          'rgba(211, 136, 0, 0.7)',
          'rgba(216, 117, 0, 0.7)',
          'rgba(219, 97, 0, 0.7)',
          'rgba(219, 74, 0, 0.7)',
          'rgba(217, 49, 0, 0.7)',
          'rgba(213, 2, 2, 0.7)',
          'rgba(200, 200, 200, 0.7)',
        ],
        borderColor: [
          'rgba(54, 255, 0, 1)',
          'rgba(109, 239, 0, 1)',
          'rgba(140, 223, 0, 1)',
          'rgba(162, 207, 0, 1)',
          'rgba(179, 190, 0, 1)',
          'rgba(192, 173, 0, 1)',
          'rgba(203, 155, 0, 1)',
          'rgba(211, 136, 0, 1)',
          'rgba(216, 117, 0, 1)',
          'rgba(219, 97, 0, 1)',
          'rgba(219, 74, 0, 1)',
          'rgba(217, 49, 0, 1)',
          'rgba(213, 2, 2, 1)',
          'rgba(200, 200, 200, 1)',
        ],
        borderWidth: 2
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
}