
const params = new URLSearchParams(document.location.search);
const professorId = params.get("professorId");

const gradesQuery = "jason+smith+cs+2337"; //FIXME with data
$("#utd-grades-link").on('click', funct => {
    console.log("Clicked");
    window.open(`https://utdgrades.com/results?search=${gradesQuery}`,'_blank');
});