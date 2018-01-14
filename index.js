const path = require('path');
const {
	existsSync,
	readFileSync,
	writeFileSync,
} = require('fs');
const R = require('ramda');
const mkdirp = require('mkdirp');
const config = require('./config/index.js');
const {
	digest,
	pngdiff,
	slack,
	webshot,
} = require('./utilities/index.js');

mkdirp.sync(config.path);

setInterval(
	() => R.forEach(async (uri) => {
		try {
			const uriHash = digest(uri).slice(0, 12);
			const imgPath = path.join(config.path, `${uriHash}.png`);
			const diffPath = path.join(config.path, `${uriHash}_diff.png`);

			const next = await webshot(uri);

			if (existsSync(imgPath)) {
				const prev = readFileSync(imgPath);
				const diff = pngdiff(prev, next, config.threshold);

				if (diff.image) writeFileSync(diffPath, diff.image);
				if (diff.pixels > 0) {
					console.log(`${diff.pixels} pixels changed on ${uri}!`);
					slack.send(`Change detected on: ${uri}`);
				}
			}
			writeFileSync(imgPath, next);
		} catch (err) {
			console.log(err);
		}
	}, config.watch),
	config.interval,
);
