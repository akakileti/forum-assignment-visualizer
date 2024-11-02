function readAssignments() {
	const assignments = [];
	const titleElements = document.querySelectorAll('.title-span');
	const dueDateElements = document.querySelectorAll('.due-date-region');
	const links = document.querySelectorAll('.assignment-link');
	const courseElements = document.querySelectorAll('.course-section-region');

	// Get the current year
	const currentYear = new Date().getFullYear();

	// Check that we have the same number of titles and due dates
	if (titleElements.length === dueDateElements.length) {
		titleElements.forEach((titleElement, index) => {
			const title = titleElement.innerText.trim();
			const dueDateText = dueDateElements[index].innerText.trim();
			const dueDateWithYear = `${dueDateText
				.replace('Due ', '')
				.trim()} ${currentYear}`;
			const dueDate = new Date(dueDateWithYear);
			const eachLink = links[index];
			const link = eachLink
				? `https://forum.minerva.edu${eachLink.getAttribute('href')}`
				: null;
			const course = courseElements[index].innerText.split(' ')[0].trim();

			assignments.push({ title, dueDate, link, course });
			console.log('Assignment added:', { title, dueDate, link, course }); // Debugging
		});
	} else {
		console.error(
			'Mismatch between number of title elements and due date elements.'
		);
	}

	injectAssignments(assignments);
}

function injectAssignments(assignments) {
	// Remove any existing container to avoid duplicates
	const existingContainer = document.getElementById(
		'assignments-timeline-container'
	);
	if (existingContainer) {
		existingContainer.remove();
	}

	// Tooltip element for displaying assignment details
	const tooltip = document.createElement('div');
	tooltip.id = 'assignment-tooltip';
	tooltip.style.position = 'absolute';
	tooltip.style.padding = '5px 10px';
	tooltip.style.color = '#086099';
	tooltip.style.borderRadius = '4px';
	tooltip.style.fontSize = '12px';
	tooltip.style.visibility = 'hidden';
	tooltip.style.whiteSpace = 'nowrap';
	tooltip.style.pointerEvents = 'none'; // Ensure the tooltip does not interfere with mouse events
	document.body.appendChild(tooltip);

	// Set up the timeline container
	const today = new Date();
	const daysAhead = 30;
	const daysWithAssignments = new Array(daysAhead).fill(null).map(() => []);

	assignments.forEach(({ title, dueDate, link, course }) => {
		const daysUntilDue =
			Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)) + 1;
		if (daysUntilDue >= 0 && daysUntilDue < daysAhead) {
			daysWithAssignments[daysUntilDue].push({ title, link, course });
		}
	});

	const timelineContainer = document.createElement('div');
	timelineContainer.id = 'assignments-timeline-container';
	timelineContainer.style.display = 'flex';
	timelineContainer.style.marginTop = '20px';
	timelineContainer.style.width = '100%';

	// Populate the timeline
	daysWithAssignments.forEach((assignmentsForDay, index) => {
		if (assignmentsForDay.length === 0) {
			const emptyBlock = document.createElement('div');
			emptyBlock.style.flexGrow = '1';
			emptyBlock.style.height = '20px';
			emptyBlock.style.backgroundColor = '#ECEBE9';
			emptyBlock.style.marginRight = '2px';
			timelineContainer.appendChild(emptyBlock);
		} else {
			assignmentsForDay.forEach(({ title, link, course }) => {
				const assignmentBlock = document.createElement('div');
				assignmentBlock.style.flexGrow = '1';
				assignmentBlock.style.height = '20px';
				assignmentBlock.style.marginRight = '2px';
				assignmentBlock.style.backgroundColor =
					assignmentsForDay.length === 1 ? '#FFA500' : '#FF8C00';

				// Show tooltip on hover with fixed position relative to the block
				assignmentBlock.addEventListener('mouseenter', (event) => {
					tooltip.innerText = `${course}: ${title}`;
					const blockRect = assignmentBlock.getBoundingClientRect();
					tooltip.style.top = `${window.scrollY + blockRect.top - 25}px`; // Place tooltip above the block
					tooltip.style.left = `${
						window.scrollX +
						blockRect.left +
						blockRect.width / 2 -
						tooltip.offsetWidth / 2
					}px`; // Center tooltip over the block
					tooltip.style.visibility = 'visible';
				});

				// Hide tooltip when not hovering
				assignmentBlock.addEventListener('mouseleave', () => {
					tooltip.style.visibility = 'hidden';
				});

				// Click event to open the assignment link
				assignmentBlock.style.cursor = 'pointer';
				assignmentBlock.addEventListener('click', () => {
					window.open(link, '_blank');
				});

				timelineContainer.appendChild(assignmentBlock);
			});
		}
	});

	// Append the timeline container to the page
	const assignmentsContainer = document.querySelector(
		'.student-assignments-list-view'
	);
	if (assignmentsContainer) {
		assignmentsContainer.appendChild(timelineContainer);
		console.log('Timeline appended successfully.');
	} else {
		console.error('Assignments container not found');
	}
}

readAssignments();
