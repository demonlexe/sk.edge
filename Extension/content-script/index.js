console.log("Content script loaded");

const messageType = {
	SHOW_COURSE_TAB: 'SHOW_COURSE_TAB',
	SHOW_PROFESSOR_TAB: 'SHOW_PROFESSOR_TAB',
}

// send event to to extension to show the course info tab
function sendCourseDataToExtension(coursePrefix, courseNumber, professors) {
	chrome.runtime.sendMessage({
		type: messageType.SHOW_COURSE_TAB,
		payload: {
			coursePrefix,
			courseNumber,
			professors,
		}
	});
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getCourseData() {
	return new Promise(resolve => {
		waitForElement('h1').then((course) => {
			const courseData = course.innerText.split(" ");
			coursePrefix = courseData[0];
			courseNumber = courseData[1];
			resolve({ coursePrefix, courseNumber });
		});
	});
};

function getProfessorNames() {
	return new Promise(resolve => {
		waitForElement('table').then((courseTable) => {
			const professors = [];
			const courseRows = courseTable.querySelectorAll('tbody');
			courseRows.forEach((courseRow) => {
				// get professor name from course row
				const sectionDetailsButton = courseRow.querySelector('tr > td > button');
				// expand section details to load the details
				sectionDetailsButton.click();
				const sectionDetails = courseRow.querySelector('tr:nth-child(2)');
				const sectionDetailsList = sectionDetails.querySelectorAll('li');
				sectionDetailsList.forEach(li => {
					const detailLabelText = li.querySelector('strong > span').innerText;
					if (detailLabelText.includes('Instructor')) {
						const professor = li.innerText.split(":")[1].trim();
						professors.push(professor);
					}
				})
				// collapse section details
				sectionDetailsButton.click();
			});
			resolve(professors);
		});
	});
};


Promise.all([getCourseData(), getProfessorNames()]).then(([courseData, professors]) => {
	console.log(courseData.coursePrefix, courseData.courseNumber, professors);
	sendCourseDataToExtension(courseData.coursePrefix, courseData.courseNumber, professors);
});
