(() => {
	const names = [
		'Yaakov',
		'John',
		'Jen',
		'Jason',
		'Paul',
		'Frank',
		'Larry',
		'Paula',
		'Laura',
		'Jim',
	];

	let i, firstLetter;

	for (i = 0; i < names.length; i++) {
		firstLetter = names[i].charAt(0).toLowerCase();

		if (firstLetter === 'j') {
			byeSpeaker.speak(names[i]);
			continue;
		}

		helloSpeaker.speak(names[i]);
	}
})();
