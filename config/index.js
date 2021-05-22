import 'dotenv/config';

const config = {
	// URLs to poll
	watch: [
		'https://www.microsoft.com',
	],
	// Value from 0 to 1 where the smaller the number the more precise the comparison, 1 seems to work best for most pages
	diffThreshold: 1.0,
	// Time to wait between polls in milliseconds, this number should be higher than waitAfterLoadMs + timeoutMs
	intervalMs: 30000,
	// Time to wait after the page loads in milliseconds, so that initial javascript and animations can play out
	waitAfterLoadMs: 5000,
	// Time to wait for the page to load before timing out and giving up
	timeoutMs: 20000,
	// Width of the browser window, in pixels
	browserWidth: 1920,
	// Height of the browser window, in pixels
	browserHeight: 1080,
	// Local path to store screenshots, relative to the application root
	path: 'screenshots',
	// Slack credentials, token/channel needed for uploading photos, provide in .env file
	slack: {
		token: process.env.SLACK_TOKEN,
		webhook_url: process.env.SLACK_WEBHOOK_URL,
		channel: process.env.SLACK_CHANNEL,
	},
	// Discord credentials, provide in .env file
	discord: {
		webhook_url: process.env.DISCORD_WEBHOOK_URL,
	},
};

export default config;
