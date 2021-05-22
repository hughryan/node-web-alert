import path from 'path';
import {
	existsSync,
	readFileSync,
	writeFileSync,
} from 'fs';
import R from 'ramda';
import mkdirp from 'mkdirp';
import config from './config/index.js';
import {
	digest,
	interval,
	pngdiff,
	slack,
	discord,
	webshot,
} from './utilities/index.js';

mkdirp.sync(config.path);

console.log('Initializing...');

interval(
	() => {
		console.log('Scraping pages...')

		return Promise.all(R.map(async (uri) => {
			try {
				const uriHash = digest(uri).slice(0, 12);
				const imgPath = path.join(config.path, `${uriHash}.png`);
				const diffPath = path.join(config.path, `${uriHash}_diff.png`);

				const next = await webshot(uri);

				if (existsSync(imgPath)) {
					const prev = readFileSync(imgPath);
					const diff = pngdiff(prev, next, config.diffThreshold);

					if (diff.image) writeFileSync(diffPath, diff.image);
					if (diff.pixels > 0) {
						console.log(`${diff.pixels} pixels changed on: ${uri}`);
						if (diff.image) {
							if (slack.enabled) {
								slack.webhook.send(`Change detected on: ${uri}`);
								const result = await slack.webclient.files.upload(
									`${Date.now()}.png`,
									{
										file: diff.image,
										channels: config.slack.channel,
									},
								);
								console.log('*** Posted change to slack ***');
							}
							if (discord.enabled) {
								await discord.webhook.send(`Change detected on: ${uri}`, {
									embeds: [{
									thumbnail: {
										url: `attachment://${Date.now()}.png`
										}
									}],
									files: [{
										attachment: diffPath,
										name: `${Date.now()}.png`
									}]
								})
								console.log('*** Posted change to discord ***');
							}
						}
					} else {
						console.log(`No change detected on: ${uri}`);
					}
				} else {
					console.log(`No previous snapshot for: ${uri}`);
				}
				writeFileSync(imgPath, next);
			} catch (err) {
				console.log(err);
			}
		}, config.watch));
	},
	config.intervalMs,
);
