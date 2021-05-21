import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
	args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
});

const onClose = () => browser.close();
process.on('SIGINT', onClose);
process.on('SIGHUP', onClose);
process.on('SIGTERM', onClose);

export default async (uri) => {
	const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');

	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	await page.goto(uri, {
		timeout: 60000,
		waitUntil: 'networkidle0',
	});

	await page.waitForTimeout(10000);

	console.log(`Taking snapshot of ${uri}`);
	const shot = await page.screenshot();

	return shot;
};
