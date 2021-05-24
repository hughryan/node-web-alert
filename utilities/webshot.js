import puppeteer from 'puppeteer';
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer';
import fetch from 'cross-fetch';
import { promises as fs } from 'fs';
import which from 'which';

const initBrowser = async () => {
	const chromiumPath = which.sync('chromium', {nothrow: true})
	const options = {
		args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
		headless: false,
	};
	if (chromiumPath) options.executablePath = chromiumPath;

	return await puppeteer.launch(options);
}

const initPages = async (browser) => {
	// browser starts with a single page
	for (let i = 1; i < parseInt(process.env.MAX_PAGES); i++) {
		await browser.newPage();
	}
	const pages = await browser.pages();
	try {
		const blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch, {
			path: 'engine.bin',
			read: fs.readFile,
			write: fs.writeFile,
		});
		for (let page of pages) {
			blocker.enableBlockingInPage(page);
		}
	} catch (err) {
		console.log('ERROR: Failed to initalize blocklist', err);
	}
	for (let page of pages) {
		// these are not the droids you're looking for
		await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');
		await page.setViewport({
			width: parseInt(process.env.BROWSER_WIDTH),
			height: parseInt(process.env.BROWSER_HEIGHT),
		});
	}
	return pages;
}

const browser = await initBrowser();
const pages = await initPages(browser);

const onClose = () => {
	browser.close();
	process.exit(1);
}
process.on('SIGINT', onClose);
process.on('SIGHUP', onClose);
process.on('SIGTERM', onClose);

export default async (uri, idx) => {
	await pages[idx].goto(uri, {
		timeout: parseInt(process.env.LOAD_TIMEOUT),
		waitUntil: 'load',
	});
	await pages[idx].waitForTimeout(parseInt(process.env.WAIT_AFTER_LOAD_MS));

	return pages[idx].screenshot();
};
