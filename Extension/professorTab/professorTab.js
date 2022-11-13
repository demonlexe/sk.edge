const data = {
  professorId: "test",
  professor: "Jason Smith",
  rmp: 4.5,
  grades: [5, 8, 4, 2, 0, 1, 0, 0, 0],
  endDate: null,
}

const params = new URLSearchParams(document.location.search);
const professorId = params.get("professorId");

const gradesQuery = "jason+smith+cs+2337"; //FIXME with data
$("#utd-grades-link").on('click', funct => {
    console.log("Clicked");
    window.open(`https://utdgrades.com/results?search=${gradesQuery}`,'_blank');
});