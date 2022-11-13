import { getData, setData } from "../chrome_store.js";

async function settingsClicked() {
    window.location = "../settingsTab/settingsTab.html";
}

let settingsBtn = $("#settings-btn");
settingsBtn.on("click", settingsClicked);
let exitBtn = $("#exit-dash-btn");
exitBtn.on("click", () => { 
    window.close();
});