import puppeteer from 'puppeteer';
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import fetch from 'cross-fetch';
import { promises as fs } from 'fs';
import which from 'which';

const chromiumPath = which.sync('chromium', {nothrow: true})
const options = {
	args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
};
if (chromiumPath) options.executablePath = chromiumPath;
const browser = await puppeteer.launch(options);
const pages = await browser.pages();
const page = pages[0];
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
	width: parseInt(process.env.BROWSER_WIDTH),
	height: parseInt(process.env.BROWSER_HEIGHT),
});

const onClose = () => browser.close();
process.on('SIGINT', onClose);
process.on('SIGHUP', onClose);
process.on('SIGTERM', onClose);

export default async (uri) => {
	await page.goto(uri, {
		timeout: parseInt(process.env.LOAD_TIMEOUT),
		waitUntil: 'load',
	});
	await page.waitForTimeout(parseInt(process.env.WAIT_AFTER_LOAD_MS));

	return await page.screenshot();
};
