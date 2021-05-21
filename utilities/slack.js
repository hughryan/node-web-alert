import { WebClient } from '@slack/web-api';
import { IncomingWebhook } from '@slack/webhook';
import config from '../config/index.js';

const enabled = config.slack.webhook_url && config.slack.token && config.slack.channel;
const webclient = enabled ? new WebClient(config.slack.token) : undefined;
const webhook = enabled ? new IncomingWebhook(config.slack.webhook_url) : undefined;

export default {
	enabled,
	webclient,
	webhook,
};
