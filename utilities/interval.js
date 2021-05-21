export default (fn, interval) => {
	fn();
	setInterval(fn, interval);
};
