import { getData, setData } from "../chrome_store.js";

let checkBox = $("#acknowledgement-box");
let okBtn = $("#acknowledge-btn");

checkBox.on("change", () => {
    let isChecked = checkBox.is(':checked');
    if (isChecked) {
        okBtn.removeClass('disabled');
        okBtn.removeClass('btn-outline-secondary');
        okBtn.addClass('btn-outline-primary');
    }
    else {
        okBtn.removeClass('btn-outline-primary');
        okBtn.addClass('disabled');
        okBtn.addClass('btn-outline-secondary');
    }
})

okBtn.on('click', async () => {
    $("#acknowledgement-box-container").detach();
    okBtn.detach();
    $(`#acknowledgement-card`).append(
        `<div id="save-successful" class="alert alert-success fade show" role="alert">
        <strong>Welcome!</strong> Redirecting...
        <div id="spinner-div" class="hang-right" style="margin:0px">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
      </div>`
    );
    await setData('user_setup_complete',true);
    setTimeout(() => {
        window.location="../dashboardTab/dashboardTab.html";
    }, 3000);
})