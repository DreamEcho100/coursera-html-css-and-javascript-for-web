((target) => {
	const helloSpeaker = new Object();
	const speakWord = 'Hello';

	helloSpeaker.speak = (name) => console.log(`${speakWord} ${name}`);

	target.helloSpeaker = helloSpeaker;
})(window);
