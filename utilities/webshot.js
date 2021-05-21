import puppeteer from 'puppeteer';
import config from '../config/index.js';

const browser = await puppeteer.launch({
	args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
});

const onClose = () => browser.close();
process.on('SIGINT', onClose);
process.on('SIGHUP', onClose);
process.on('SIGTERM', onClose);

export default async (uri) => {
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36');

	await page.setViewport({
		width: config.browserWidth,
		height: config.browserHeight,
	});

	await page.goto(uri, {
		timeout: config.timeoutMs,
		waitUntil: 'networkidle0',
	});

	await page.waitForTimeout(config.waitAfterLoadMs);

	console.log(`Taking snapshot of ${uri}`);
	const shot = await page.screenshot();

	await page.close();

	return shot;
};
