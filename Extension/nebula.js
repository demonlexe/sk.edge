function intersect_arrays(a, b) {
    var sorted_a = a.concat().sort();
    var sorted_b = b.concat().sort();
    var common = [];
    var a_i = 0;
    var b_i = 0;

    while (a_i < a.length
            && b_i < b.length)
    {
        if (sorted_a[a_i] === sorted_b[b_i]) {
            common.push(sorted_a[a_i]);
            a_i++;
            b_i++;
        }
        else if(sorted_a[a_i] < sorted_b[b_i]) {
            a_i++;
        }
        else {
            b_i++;
        }
    }
    return common;
}

function getNebulaProfessor(professorName) { 
const headers = {
    'x-api-key': 'AIzaSyDswjXmm_HXXcjr2yPTmVC_0b9BhQsN8lk',
    'Accept': 'application/json',
};
const getDataPromise = new Promise((resolve, reject) => {
    try {
    fetch(`https://api.utdnebula.com/professor?last_name=${professorName}`, {
        method: 'GET',
        headers: headers,
    })
        .then(function (res) {
        resolve(res.json());
        })
        .then(function (err) {
        console.log(err);
        reject(null);
        });
            
    }
    catch (err) {
        console.log("Error getting data: "+err);
        reject(null);
    }
});

return getDataPromise;
}

function getNebulaCourse(coursePrefix, courseNumber)
{
const headers = {
    'x-api-key': 'AIzaSyDswjXmm_HXXcjr2yPTmVC_0b9BhQsN8lk',
    'Accept': 'application/json',
    };
    
const getDataPromise = new Promise((resolve, reject) => {
    try {
    fetch(`https://api.utdnebula.com/course?course_number=${courseNumber}&subject_prefix=${coursePrefix}`, {
        method: 'GET',
        headers: headers,
    })
        .then(function (res) {
        resolve(res.json());
        })
        .then(function (err) {
        console.log(err);
        reject(null);
        });
            
    }
    catch (err) {
        console.log("Error getting data: "+err);
        reject(null);
    }
});

return getDataPromise;
}

function getNebulaSection(section_id)
{
const headers = {
    'x-api-key': 'AIzaSyDswjXmm_HXXcjr2yPTmVC_0b9BhQsN8lk',
    'Accept': 'application/json',
};

const getDataPromise = new Promise((resolve, reject) => {
    try {
    fetch(`https://api.utdnebula.com/section/${section_id}`, {
        method: 'GET',
        headers: headers,
    })
        .then(function (res) {
        resolve(res.json());
        })
        .then(function (err) {
        console.log(err);
        reject(null);
        });
            
    }
    catch (err) {
        console.log("Error getting data: "+err);
        reject(null);
    }
});

return getDataPromise;
}
function getSections(tableIn)
{
if (!tableIn || !tableIn.data)
{
    return null;
}
return (tableIn.data[0]['sections']);
}
function getGradeDist(tableIn)
{
if (!tableIn || !tableIn.data)
{
    return null;
}
console.log(tableIn.data);
return (tableIn.data['grade_distribution']);
}

function getEndDate(tableIn)
{
if (!tableIn || !tableIn.data || !tableIn.data['meetings'] || !tableIn.data['meetings'][0] || !tableIn.data['meetings'][0]['end_date'])
{
    return -1;
}
console.log(tableIn.data);
return (tableIn.data['meetings'][0]['end_date']);
}

function getProfessorFullName(tableIn)
{
console.log("getProfessorFullName:", tableIn.data[0])
if (!tableIn || !tableIn.data || !tableIn.data[0]|| !tableIn.data[0]['first_name'] || !tableIn.data[0]['last_name'])
{
    return null;
}
return (tableIn.data[0]['first_name']+" "+tableIn.data[0]['last_name']);
}


// USE THIS CODE
const course = await getNebulaCourse('CS', '3345');
const professor = await getNebulaProfessor("Ozbirn");
const courseInfo = getSections(course);
const professorInfo = getSections(professor);
// console.log("Course sections: ",courseInfo);
// console.log("Professor sections: ",professorInfo);
const intersection = intersect_arrays(courseInfo,professorInfo);
console.log("Intersection: ",intersection);
let mostRecentEndDate = -1;
let mostRecentDist;
for (const elem of intersection) {
    let section = await getNebulaSection(elem);
    let grades = getGradeDist(section);
    let endDate = new Date(getEndDate(section));
    if (endDate > mostRecentEndDate && grades.length > 1) {
    mostRecentEndDate = endDate;
    mostRecentDist = grades;
    }
    // console.log("Grades are ",grades," endDate is ",endDate);
}
// console.log("FINAL Grades are ",mostRecentDist," endDate is ",mostRecentEndDate);
let obj = {
    professor: getProfessorFullName(professor),
    rmp: '5',
    grade_distribution: mostRecentDist,
    endDate: mostRecentEndDate
}