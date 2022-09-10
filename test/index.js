const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Pager, PagesBuilder } = require('dist');
const { token } = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
const pager = new Pager({
	client: client,
});

client.on('messageCreate', async (message) => {
	if (message.content.startsWith('?test')) {
		const pages = new PagesBuilder([
			{
				content: '1',
				embeds: [new EmbedBuilder().setDescription('1').setColor('Aqua')],
			},
			{
				content: '2',
				embeds: [new EmbedBuilder().setDescription('2').setColor('Aqua')],
			},
		])
			.addPage((page) =>
				page
					.setContent('3')
					.setEmbeds([new EmbedBuilder().setDescription('3').setColor('Aqua')])
			)
			.addPage({
				content: '4',
				embeds: [new EmbedBuilder().setDescription('4').setColor('Aqua')],
			});

		pager.handlePage(await message.reply(pages.getFirstPage()), pages);
	}
});

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);
