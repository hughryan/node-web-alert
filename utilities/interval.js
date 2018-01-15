module.exports = (fn, interval) => {
	fn();
	setInterval(fn, interval);
};
