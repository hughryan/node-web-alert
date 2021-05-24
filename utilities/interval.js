const interval = (intervalMs, fn) => {
	fn().then(() => {
		console.log(`=== Sleeping for ${intervalMs}ms ===`);
		setTimeout(() => interval(intervalMs, fn), intervalMs);
	}).catch(err => {
		console.log('Error: ', err);
	});
};

export default interval;
