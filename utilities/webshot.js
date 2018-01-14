const puppeteer = require('puppeteer');

module.exports = async (uri) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	await page.goto(uri);

	const shot = await page.screenshot();

	await browser.close();
	return shot;
};
