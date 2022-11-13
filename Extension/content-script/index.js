console.log("Content script loaded");

var messageType = {
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

			// add Professor header to the table
			const tableHeaders = courseTable.querySelector('thead > tr');
			const newHeader = document.createElement('th');
			newHeader.innerText = 'Professor';
			tableHeaders.insertBefore(newHeader, tableHeaders.children[7]);

			courseRows.forEach((courseRow) => {
				// get professor name from course row
				const sectionDetailsButton = courseRow.querySelector('tr > td > button');
				// expand section details to load the details
				sectionDetailsButton.click();
				const sectionDetails = courseRow.querySelector('tr:nth-child(2)');
				const sectionDetailsList = sectionDetails.querySelectorAll('li');
				let professor = '';
				sectionDetailsList.forEach(li => {
					const detailLabelText = li.querySelector('strong > span').innerText;
					if (detailLabelText.includes('Instructor')) {
						professor = li.innerText.split(":")[1].trim();
						professors.push(professor);
					}
				});
				// append professor name to the table
				const newTd = document.createElement('td');
				newTd.innerText = professor;
				// append span element with professor as text to the newTd
				// const newSpan = document.createElement('span');
				// newSpan.innerText = professor;
				// newTd.appendChild(newSpan);
				const courseRowCells = courseRow.querySelector('tr');
				courseRowCells.insertBefore(newTd, courseRowCells.children[7]);

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
