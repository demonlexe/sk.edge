
const params = new URLSearchParams(document.location.search);
const professorId = params.get("professorId");

const profName = "jason+smith"; //FIXME with data
$("#utd-grades-link").on('click', funct => {
    console.log("Clicked");
    window.open(`https://utdgrades.com/results?search=${profName}`,'_blank');
});