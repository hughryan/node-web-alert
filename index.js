import 'dotenv/config';
import path from 'path';
import {
	existsSync,
	readFileSync,
	writeFileSync,
} from 'fs';
import R, { max } from 'ramda';
import mkdirp from 'mkdirp';
import {
	digest,
	interval,
	pngdiff,
	slack,
	discord,
	webshot,
	sleep,
} from './utilities/index.js';

console.log('Initializing...');
const urlWatchlist = JSON.parse(process.env.URL_WATCHLIST);
const maxPages = parseInt(process.env.MAX_PAGES);
const intervalMs = parseInt(process.env.INTERVAL_MS);
const screenshotPath = process.env.SCREENSHOT_PATH;
mkdirp.sync(screenshotPath);

const scrape = async (uri, idx) => {
	try {
		const uriHash = digest(uri).slice(0, 12);
		const imgPath = path.join(screenshotPath, `${uriHash}.png`);
		const diffPath = path.join(screenshotPath, `${uriHash}_diff.png`);

		const next = await webshot(uri, idx);

		if (existsSync(imgPath)) {
			const prev = readFileSync(imgPath);
			const diff = pngdiff(prev, next, parseFloat(process.env.DIFF_THRESHOLD));

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
								channels: process.env.SLACK_CHANNEL,
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
		console.log(`${err.message} for: ${uri}`);
	}
}

interval(
	intervalMs,
	async () => {
		console.log('Scraping pages...')
		let urlIdx = 0;
		const promises = [];

		const scrapePage = async (pageIdx) => {
			if (urlIdx >= urlWatchlist.length) return;
			return scrape(urlWatchlist[urlIdx++], pageIdx).then(() => {
				promises.push(scrapePage(pageIdx));
			});
		}

		for (let pageIdx = 0; pageIdx < maxPages; pageIdx++) {
			promises.push(scrapePage(pageIdx));
		}

		while (promises.length < urlWatchlist.length) {
			await sleep(500);
		}

		return Promise.all(promises);
	}
);
