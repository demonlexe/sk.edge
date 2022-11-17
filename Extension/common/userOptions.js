import { getData, setData } from "../chrome_store.js";
import { setNebulaAPIKey, testNebulaAPIKey } from "../nebula.js";

function prettifyString (inName) {
    let newName = "";
    console.log("inName: " + inName);
    if (inName.length >= 2) {
        newName = (inName.substring(0,1)).toUpperCase();
        newName += (inName.substring(1,inName.length)).toLowerCase();
    }
    return newName;
}

export async function saveOptionsOnClicked(menuName, btnClicked) {
    let gpa = $(`#${menuName}-gpa`).val();
    let school = $(`#${menuName}-school`).val();
    let nebulaApiKey = $(`#${menuName}-api-key`).val();

    $(`#${menuName}-missing-alert`).remove();
    $(`#${menuName}-missing-api-key-alert`).remove();
    $("#save-successful").remove();

    let missingGpa = false;
    let invalidGpa = false;
    let missingSchool = false;
    let missingApiKey = false;
    let nebulaTestSucceeded = false;

    if (!gpa || gpa.length < 1) {
        missingGpa = true;
    }
    else if (isNaN(gpa) || gpa > 4 || gpa < 0 ) {
        invalidGpa = true;
    }

    if (!school || school.length < 3) {
        missingSchool = true;
    }

    if (!nebulaApiKey || nebulaApiKey.length < 10) {
        missingApiKey = true;
    }
    else {
        // Then we are not missing the ApiKey, so let's test it.
        $(`#${menuName}-card`).append(`
        <div id="spinner-div" class="center-block">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`);
        nebulaTestSucceeded = await testNebulaAPIKey(nebulaApiKey);
    }

    if (!missingGpa && !missingSchool && !missingApiKey && !invalidGpa && nebulaTestSucceeded) {
        await setData('student_gpa',gpa);
        await setData('student_school',school);
        await setData('nebulaApiKey',nebulaApiKey);
        setNebulaAPIKey(nebulaApiKey);

        $(`#spinner-div`).remove();

        switch (menuName) {
            case 'setup':
            {
                $(`#${menuName}-card`).append(
                    `<div id="save-successful" class="alert alert-success fade show" role="alert">
                    <strong>Welcome!</strong> Redirecting...
                  </div>`
                );
                await setData('user_setup_complete',true);
                setTimeout(() => {
                    window.location="../dashboardTab/dashboardTab.html";
                }, 3000);
                break;
            }
            case 'settings':
            {
                $(`#${menuName}-card`).append(
                    `<div id="save-successful" class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>${prettifyString(menuName)} saved!</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>`
                );
                break;
            }
        }
        // If we reach this line
        btnClicked.attr("disabled",false);
    } else {
        $(`#spinner-div`).remove();
        if (missingGpa || invalidGpa || missingSchool) {
            let missingStr = (missingGpa && missingSchool) ? "Please input your GPA and School!" : 
            ((missingGpa) ? "Please input your GPA!" : 
            (invalidGpa) ? "Please input a <strong>valid</strong> GPA! [0.0 - 4.0]" : 
            "Please input your School!");

            $(`#${menuName}-card`).append(`
            <div id="${menuName}-missing-alert" class="alert alert-warning alert-dismissible fade show" role="alert">
            ${missingStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
        }
        if (missingApiKey) {
            let missingStr = "Hmm.. Looks like you still need an API key."
            $(`#${menuName}-card`).append(`
            <div id="${menuName}-missing-api-key-alert" class="alert alert-warning alert-dismissible fade show" role="alert">
            ${missingStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
        }
        else if (!nebulaTestSucceeded) {
            let missingStr = "Your API key is invalid. Please try again."
            $(`#${menuName}-card`).append(`
            <div id="${menuName}-missing-api-key-alert" class="alert alert-danger alert-dismissible fade show" role="alert">
            ${missingStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `);
        }
        btnClicked.attr("disabled",false);
    }     
    
}