import { getData } from "./chrome_store.js";
import { unRegister } from "./assets/colleges.js";

const allRmpTags = [
    "BEWARE OF POP QUIZZES",
    "CARING",
    "ACCESSIBLE OUTSIDE CLASS",
    "GET READY TO READ",
    "TOUGH  GRADER",
    "INSPIRATIONAL",
    "PARTICIPATION MATTERS",
    "LECTURE HEAVY",
    "GROUP PROJECTS",
];

function intersect_arrays(a, b) {
    var sorted_a = a.concat().sort();
    var sorted_b = b.concat().sort();
    var common = [];
    var a_i = 0;
    var b_i = 0;

    while (a_i < a.length && b_i < b.length) {
        if (sorted_a[a_i] === sorted_b[b_i]) {
            common.push(sorted_a[a_i]);
            a_i++;
            b_i++;
        } else if (sorted_a[a_i] < sorted_b[b_i]) {
            a_i++;
        } else {
            b_i++;
        }
    }
    return common;
}

let NEBULA_API_KEY = "EM~eW}G<}4qx41fp{H=I]OZ5MF6T:1x{<GF:~v<";

// Important for allowing user to change their API key, live
// export function setNebulaAPIKey(key)
// {
//     console.log("Changing NEBULA_API_KEY to ",key);
//     NEBULA_API_KEY = key;
// }

// export function testNebulaAPIKey(key) {
//     const headers = {
//         "x-api-key": key,
//         Accept: "application/json",
//     };

//     const getDataPromise = new Promise((resolve) => {
//         try {
//             fetch(
//                 `https://api.utdnebula.com/course?course_number=2418&subject_prefix=MATH`,
//                 {
//                     method: "GET",
//                     headers: headers,
//                 }
//             )
//                 .then(function (res) {
//                     resolve(true);
//                 })
//                 .catch(function (err) {
//                     console.log("Nebula error is: ",err);
//                     resolve(false);
//                 });
//         } catch (err) {
//             console.log("Error getting data: " + err);
//             resolve(false);
//         }
//     });

//     return getDataPromise;
// }

function getNebulaProfessor(professorName) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };
    const getDataPromise = new Promise((resolve, reject) => {
        try {
            const nameSplit = professorName.split(" ");
            const firstName = nameSplit[0];
            const lastName = nameSplit[nameSplit.length - 1];
            fetch(
                `https://api.utdnebula.com/professor?first_name=${firstName}&last_name=${lastName}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log(err);
                    reject(null);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(null);
        }
    });

    return getDataPromise;
}

function getNebulaCourse(coursePrefix, courseNumber) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(
                `https://api.utdnebula.com/course?course_number=${courseNumber}&subject_prefix=${coursePrefix}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log("Nebula error is: ",err);
                    reject(err);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(err);
        }
    });

    return getDataPromise;
}

// will be used in the future
function getNebulaSections(courseReference, professorReference) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(
                `https://api.utdnebula.com/section?course_reference=${courseReference}&professors=${professorReference}`,
                {
                    method: "GET",
                    headers: headers,
                }
            )
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log("Nebula error is: ",err);
                    reject(err);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(err);
        }
    });

    return getDataPromise;
}

function getNebulaSection(section_id) {
    const headers = {
        "x-api-key": unRegister(NEBULA_API_KEY),
        Accept: "application/json",
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(`https://api.utdnebula.com/section/${section_id}`, {
                method: "GET",
                headers: headers,
            })
                .then(function (res) {
                    resolve(res.json());
                })
                .catch(function (err) {
                    console.log(err);
                    reject(null);
                });
        } catch (err) {
            console.log("Error getting data: " + err);
            reject(null);
        }
    });

    return getDataPromise;
}
function getSections(tableIn) {
    if (!tableIn || !tableIn.data) {
        return null;
    }
    return tableIn.data[0]["sections"];
}
function getCourseId(tableIn) {
    if (tableIn?.data?.[0]?.["_id"]) {
        return tableIn.data[0]["_id"];
    }
    return null;
}
function getGradeDist(tableIn) {
    if (!tableIn || !tableIn.data) {
        return null;
    }
    // console.log(tableIn.data);
    return tableIn.data["grade_distribution"];
}

function getEndDate(tableIn) {
    if (
        !tableIn ||
        !tableIn.data ||
        !tableIn.data["meetings"] ||
        !tableIn.data["meetings"][0] ||
        !tableIn.data["meetings"][0]["end_date"]
    ) {
        return -1;
    }
    // console.log(tableIn.data);
    return tableIn.data["meetings"][0]["end_date"];
}

function getProfessorFullName(tableIn) {
    // console.log("getProfessorFullName:", tableIn.data[0]);
    if (
        !tableIn ||
        !tableIn.data ||
        !tableIn.data[0] ||
        !tableIn.data[0]["first_name"] ||
        !tableIn.data[0]["last_name"]
    ) {
        return null;
    }
    return tableIn.data[0]["first_name"] + " " + tableIn.data[0]["last_name"];
}

function getProfessorId(tableIn) {
    if (tableIn?.data?.[0]?.["_id"]) {
        return tableIn.data[0]["_id"];
    }
    return null;
}

function getRandomRpmTags() {
    const shuffled = [...allRmpTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

export async function getProfessorGradeList(
    subjectPrefix,
    courseNumber,
    professorList
) {
    const course = await getNebulaCourse(subjectPrefix, courseNumber);
    const courseId = getCourseId(course);
    const courseInfo = getSections(course);
    // console.log("Course sections: ",courseInfo);
    const professorCourseInfoList = [];
    const promises = professorList.map(async professorName => {
        const professor = await getNebulaProfessor(professorName);
        const professorId = getProfessorId(professor);
        const professorInfo = getSections(professor);
        if (!professorInfo) {
            professorCourseInfoList.push({
                id: null,
                professor: professorName,
                professorId: professorId,
                rmp: "_",
                difficulty: "_",
                grades: [],
                numRatings: 0,
                subjectPrefix,
                courseNumber,
            });
            return;
        }
        // const intersection = await getNebulaSections(courseId, professorId);
        const intersection = intersect_arrays(courseInfo, professorInfo)
        const gradeObjects = [];
        const profSections = await Promise.all(intersection.map(i => getNebulaSection(i)));
        for (const elem of profSections) {
            const section = elem;
            const gradeDistribution = getGradeDist(section);
            if (gradeDistribution?.length > 0) {
                gradeObjects.push({
                    distribution: gradeDistribution,
                    section: section.data["section_number"],
                    academicSession: section.data["academic_session"].name,
                });
            }
        }
        professorCourseInfoList.push({
            professor: getProfessorFullName(professor),
            professorId: professorId,
            grades: gradeObjects,
            subjectPrefix,
            courseNumber,
        });
    });

    await Promise.all(promises);

    const data = await getRMPData(professorList);
    console.log(data)
    for (let i = 0; i < professorCourseInfoList.length; i++) {
        for (let j = 0; j < data.length; j++) {
            const noMiddleName = data[j].firstName + " " + data[j].lastName;
            if (professorCourseInfoList[i].professor == noMiddleName) {
                professorCourseInfoList[i].rmp = data[j].avgRating;
                professorCourseInfoList[i].numRatings = data[j].numRatings;
                professorCourseInfoList[i].id = atob(data[j].id);
                professorCourseInfoList[i].rmpTags = getRandomRpmTags();
                professorCourseInfoList[i].difficulty = (data[j].avgDifficulty ? data[j].avgDifficulty : "_");
                professorCourseInfoList[i].wouldTakeAgainPercent = data[j].wouldTakeAgainPercent;
            }
        }
    }
    return professorCourseInfoList;
}

export function getRMPData(professors) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({type: "REQUEST_PROFESSORS", profName: professors, schoolId: "1273"}, response => {
            if(response != null) {
                resolve(response);
            } else {
                reject('Something wrong');
            }
        });
    });
}
