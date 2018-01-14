const { IncomingWebhook } = require('@slack/client');
const config = require('../config/index.js');

module.exports = new IncomingWebhook(config.slack.webhook_url);
