//ADAM WORK HERE
// Write some logic to decide which html page to actually open
import { getData, setData } from "../chrome_store.js";

const isComplete = await getData('user_setup_complete');
console.log("The value of isComplete is " + isComplete);
if (isComplete != null && isComplete == true) {
    // Then user has already completed setup and we have their data.
    window.location = "./dashboardTab/dashboardTab.html";
}
else {
    window.location = './setupTab/setupTab.html';
}
