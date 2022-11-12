let dev = false; //FIXME DON'T COMMIT AS TRUE
let devInfo = {
    student_gpa: 3.0,
    student_school: "UTD",
    user_setup_complete: true
}

function getData(key) {
    if (!key) { return null; }
    if (dev == true) {
        console.log(devInfo);
        return devInfo[key];
    }

    try {
        chrome.storage.sync.get(key, function(result) {
            return result[key];
        });
    }
    catch (err) {
        console.log("Error getting data: "+err);
        return null;
    }
}
function setData(key, value) {
    if (!key || !value) { return false; }
    if (dev == true) {
        devInfo[key] = value;
        console.log(devInfo);
        return true;
    }

    try {
        chrome.storage.sync.set({key: value}, function() {
            console.log(key,' is succesfully to ',value);
            return true;
        });
    }
    catch (err) {
        console.log("Error setting data: "+err);
        return false;
    }
}

export {getData, setData}