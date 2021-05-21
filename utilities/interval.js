const interval = (fn, timeout) => {
	fn().then(() => {
		console.log(`Sleeping for ${timeout}ms`);
		setTimeout(() => interval(fn, timeout), timeout);
	}).catch(err => {
		console.log('Error: ', err);
	});
};

export default interval;
