chrome.action.onClicked.addListener((tab) => {
	console.log('Background service worker loaded.');

	if (
		tab.url &&
		tab.url.includes('https://forum.minerva.edu/app/assignments')
	) {
		// inject content.js into the assignments page only when clicked
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['content.js'],
		});
		console.log('Content script executed on assignments page.');
	} else {
		console.log(
			'Please navigate to the assignments page to run this extension.'
		);
	}
});
