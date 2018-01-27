require('dotenv').config();

module.exports = {
	interval: 300000,
	watch: [
		'https://www.google.com',
	],
	threshold: 0.1,
	path: 'screenshots',
	slack: {
		token: process.env.SLACK_TOKEN,
		webhook_url: process.env.SLACK_WEBHOOK_URL,
		channel: process.env.SLACK_CHANNEL,
	},
};
