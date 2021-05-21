import Discord from 'discord.js';
import config from '../config/index.js';

const webhookUrl = config.discord.webhook_url;
const enabled = !!webhookUrl;
const webhookId = enabled ? webhookUrl.split('/')[5] : undefined;
const webhookToken = enabled ? webhookUrl.split('/')[6] : undefined;

const webhook = new Discord.WebhookClient(webhookId, webhookToken);

export default {
	enabled,
	webhook,
}
