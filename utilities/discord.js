import Discord from 'discord.js';

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
const enabled = !!webhookUrl;
const webhookId = enabled ? webhookUrl.split('/')[5] : undefined;
const webhookToken = enabled ? webhookUrl.split('/')[6] : undefined;

const webhook = new Discord.WebhookClient(webhookId, webhookToken);

export default {
	enabled,
	webhook,
}
