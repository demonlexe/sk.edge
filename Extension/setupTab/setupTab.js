import { getData, setData } from "../chrome_store.js";
import { saveOptionsOnClicked } from "../common/userOptions.js";

const isComplete = await getData('user_setup_complete');
if (isComplete != null && isComplete == true) {
    // Then user has already completed setup and we have their data. Should now have reached this page, so redirect.
    window.location = "../dashboardTab/dashboardTab.html";
}

let sendBtn = $("#send-button");

sendBtn.on("click", funct => {
    sendBtn.attr('disabled',true);
    saveOptionsOnClicked("setup", sendBtn);
});