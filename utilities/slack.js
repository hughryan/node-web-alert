const { WebClient, IncomingWebhook } = require('@slack/client');
const config = require('../config/index.js');

const webclient = new WebClient(config.slack.token);
const webhook = new IncomingWebhook(config.slack.webhook_url);

module.exports = {
	webclient,
	webhook,
};
