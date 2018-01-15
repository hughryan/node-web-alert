const puppeteer = require('puppeteer');

module.exports = async (uri) => {
	const browser = await puppeteer.launch({
		args: ['--disable-dev-shm-usage'],
	});
	const onClose = () => browser.close();
	process.on('SIGINT', onClose);

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

	await page.waitFor(5000);

	const shot = await page.screenshot();

	await browser.close();
	process.removeListener('SIGINT', onClose);
	return shot;
};
