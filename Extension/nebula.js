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

function getNebulaProfessor(professorName) {
    const headers = {
        "x-api-key": "AIzaSyDswjXmm_HXXcjr2yPTmVC_0b9BhQsN8lk",
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
        "x-api-key": "AIzaSyDswjXmm_HXXcjr2yPTmVC_0b9BhQsN8lk",
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

function getNebulaSection(section_id) {
    const headers = {
        "x-api-key": "AIzaSyDswjXmm_HXXcjr2yPTmVC_0b9BhQsN8lk",
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
    if (!tableIn || !tableIn.data || !tableIn.data[0] || !tableIn.data[0]["id"]) {
        return null;
    }
    return tableIn.data[0]["id"];
}


export async function getProfessorGradeList(subjectPrefix, courseNumber, professorList) {

	const course = await getNebulaCourse(subjectPrefix, courseNumber);
	const courseInfo = getSections(course);
	// console.log("Course sections: ",courseInfo);
	const professorCourseInfoList = [];
	for (const professorName of professorList) {
		const professor = await getNebulaProfessor(professorName);
		const professorInfo = getSections(professor);
        // console.log(professorInfo);
        if (!professorInfo) {
            professorCourseInfoList.push({
                professor: professorName,
                professorId: getProfessorId(professor),
                rmp: 5.0,
                grades: null,
                endDate: null,
            })
            continue;
        }
        // console.log("Professor sections: ",professorInfo);
		const intersection = intersect_arrays(courseInfo, professorInfo);
		// console.log("Intersection: ", intersection);
		let mostRecentEndDate = -1;
		let mostRecentDist;
		for (const elem of intersection) {
			const section = await getNebulaSection(elem);
			const grades = getGradeDist(section);
			const endDate = new Date(getEndDate(section));
			if (endDate > mostRecentEndDate && grades.length > 1) {
				mostRecentEndDate = endDate;
				mostRecentDist = grades;
			}
			// console.log("Grades are ",grades," endDate is ",endDate);
		}
		professorCourseInfoList.push({
            id: 0,
			professor: getProfessorFullName(professor),
            professorId: getProfessorId(professor),
			rmp: 5.0,
			grades: mostRecentDist,
			endDate: mostRecentEndDate,
            numRatings: 0
		});
	}

    const data = await getRMPData(professorList);
    for (let i = 0; i < professorCourseInfoList.length; i++) {
        for (let j = 0; j < data.length; j++) {
            const noMiddleName = data[j].name.split(' ')[0] + " " + data[j].name.split(' ')[data[j].name.split(' ').length - 1];
            if (professorCourseInfoList[i].professor == noMiddleName) {
                professorCourseInfoList[i].rmp = data[j].rating;
                professorCourseInfoList[i].numRatings = data[j].num_ratings;
                professorCourseInfoList[i].id = data[j].rmp_id;
            }
        }
    }
	return professorCourseInfoList;
}

export async function getRMPData(professors) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const getDataPromise = new Promise((resolve, reject) => {
        try {
            fetch(`https://us-central1-hackutdix.cloudfunctions.net/get_professors`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    names: professors,
                    school: "university of texas dallas" 
                })
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
