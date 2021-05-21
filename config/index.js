import 'dotenv/config';

const config = {
	interval: 15000, // milliseconds
	watch: [
		'https://www.google.com',
	],
	threshold: 0.9,
	path: 'screenshots',
	slack: {
		token: process.env.SLACK_TOKEN,
		webhook_url: process.env.SLACK_WEBHOOK_URL,
		channel: process.env.SLACK_CHANNEL,
	},
	discord: {
		webhook_url: process.env.DISCORD_WEBHOOK_URL,
	},
};

export default config;
