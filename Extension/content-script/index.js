console.log("Content script loaded");

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

waitForElement('table').then((courseTable) => {
	console.log('Table found');
	// console.log(courseTable);
	const courseRows = courseTable.querySelectorAll('tbody');
	courseRows.forEach((courseRow) => {
		// console.log(courseRow);

		// get professor name from course row
		const sectionDetailsButton = courseRow.querySelector('tr > td > button');
		// console.log(sectionDetailsButton);
		sectionDetailsButton.click();
		const sectionDetails = courseRow.querySelector('tr:nth-child(2)');
		// console.log(sectionDetails);
		const sectionDetailsList = sectionDetails.querySelectorAll('li');
		sectionDetailsList.forEach(li => {
			const detailLabelText = li.querySelector('strong > span').innerText;
			if (detailLabelText.includes('Instructor')) {
				const professor = li.innerText.split(":")[1].trim();
				console.log(professor);
			}
		})
	});
});