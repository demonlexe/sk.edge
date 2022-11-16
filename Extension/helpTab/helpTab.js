
let alexisBtn = $("#alexis-kaufman");
let adamBtn = $("#adam-szumski");
let bradBtn = $("#bradley-johnson");
let backBtn = $("#back-btn");

backBtn.on("click", () => {
    window.location = "../dashboardTab/dashboardTab.html";
});

alexisBtn.on("click", () => { 
    window.open("https://www.linkedin.com/in/alexiskau/","_blank")
    window.close();
});

adamBtn.on("click", () => { 
    window.open("https://www.linkedin.com/in/adam-szumski/","_blank")
    window.close();
});

bradBtn.on("click", () => { 
    window.open("https://www.linkedin.com/in/bradwj/","_blank")
    window.close();
});