import puppeteer from 'puppeteer';
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import fetch from 'cross-fetch';
import { promises as fs } from 'fs';
import which from 'which';
import config from '../config/index.js';

const chromiumPath = which.sync('chromium', {nothrow: true})
const options = {
	args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
};
if (chromiumPath) options.executablePath = chromiumPath;
const browser = await puppeteer.launch(options);

const onClose = () => browser.close();
process.on('SIGINT', onClose);
process.on('SIGHUP', onClose);
process.on('SIGTERM', onClose);

export default async (uri) => {
	const page = await browser.newPage();
	try {
		PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch, {
			path: 'engine.bin',
			read: fs.readFile,
			write: fs.writeFile,
		}).then((blocker) => {
			blocker.enableBlockingInPage(page);
		}).catch(err => {
			console.log('ERROR: Failed to load blocklists', err);
		});
		await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');
		await page.setViewport({
			width: config.browserWidth,
			height: config.browserHeight,
		});

		await page.goto(uri, {
			timeout: config.loadWaitMs,
			waitUntil: 'networkidle0',
		});

		await page.waitForTimeout(config.waitAfterLoadMs);
		const shot = await page.screenshot();
		await page.close();

		return shot;
	} catch (err) {
		if (page) await page.close();
		throw err;
	}
};
