((target) => {
	const byeSpeaker = new Object();
	const speakWord = 'Good Bye';

	byeSpeaker.speak = (name) => console.log(`${speakWord} ${name}`);

	target.byeSpeaker = byeSpeaker;
})(window);
