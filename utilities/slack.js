import { WebClient } from '@slack/web-api';
import { IncomingWebhook } from '@slack/webhook';

const enabled = process.env.SLACK_WEBHOOK_URL && process.env.SLACK_TOKEN && process.env.SLACK_CHANNEL;
const webclient = enabled ? new WebClient(process.env.SLACK_TOKEN) : undefined;
const webhook = enabled ? new IncomingWebhook(process.env.SLACK_WEBHOOK_URL) : undefined;

export default {
	enabled,
	webclient,
	webhook,
};
