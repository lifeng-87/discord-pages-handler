import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	Collection,
	Message,
} from 'discord.js';
import { PageInfo } from '../types/Page';
import { PagesBuilder } from './Builder';
import { Button } from './Buttons';

type PagerOption = {
	client: Client;
	frontButton?: ButtonBuilder;
	prevButton?: ButtonBuilder;
	pageButton?: ButtonBuilder;
	nextButton?: ButtonBuilder;
	lastButton?: ButtonBuilder;
};
export class Pager {
	private pageInfo: Collection<string, PageInfo> = new Collection();
	private frontButton: Button = new Button(
		new ButtonBuilder()
			.setCustomId(`frontButton-lifeng`)
			.setStyle(ButtonStyle.Primary)
			.setLabel('<<'),
		async ({ interaction }) => {
			const pageInfo = this.pageInfo.get(interaction.message.id);
			if (!pageInfo) return await interaction.deferUpdate();

			try {
				pageInfo.currentPage = 1;
				this.pageInfo.set(interaction.message.id, pageInfo);
				const pageComponents = this.createPageButton(
					pageInfo.currentPage,
					pageInfo.pages.length
				);
				const page = pageInfo.pages[pageInfo.currentPage - 1];
				interaction.message.edit({
					content: page.content,
					embeds: page.embeds,
					components: pageComponents,
				});

				interaction.deferUpdate();
			} catch (err) {
				console.log(err);
			}
		}
	);
	private prevButton: Button = new Button(
		new ButtonBuilder()
			.setCustomId(`prevButton-lifeng`)
			.setStyle(ButtonStyle.Danger)
			.setLabel('<'),
		async ({ interaction }) => {
			const pageInfo = this.pageInfo.get(interaction.message.id);
			if (!pageInfo) return await interaction.deferUpdate();

			try {
				if (pageInfo.currentPage <= 1) return interaction.deferUpdate();

				pageInfo.currentPage -= 1;
				this.pageInfo.set(interaction.message.id, pageInfo);
				const pageComponents = this.createPageButton(
					pageInfo.currentPage,
					pageInfo.pages.length
				);
				const page = pageInfo.pages[pageInfo.currentPage - 1];
				interaction.message.edit({
					content: page.content,
					embeds: page.embeds,
					components: pageComponents,
				});

				interaction.deferUpdate();
			} catch (err) {
				console.log(err);
			}
		}
	);
	private pageButton: Button = new Button(
		new ButtonBuilder()
			.setCustomId(`pageButton-lifeng`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(),
		async ({ interaction }) => {
			return await interaction.deferUpdate();
		}
	);
	private nextButton: Button = new Button(
		new ButtonBuilder()
			.setCustomId(`nextButton-lifeng`)
			.setStyle(ButtonStyle.Success)
			.setLabel('>'),
		async ({ interaction }) => {
			const pageInfo = this.pageInfo.get(interaction.message.id);
			if (!pageInfo) return await interaction.deferUpdate();

			try {
				if (pageInfo.currentPage >= pageInfo.pages.length)
					return interaction.deferUpdate();

				pageInfo.currentPage += 1;
				this.pageInfo.set(interaction.message.id, pageInfo);
				const pageComponents = this.createPageButton(
					pageInfo.currentPage,
					pageInfo.pages.length
				);
				const page = pageInfo.pages[pageInfo.currentPage - 1];
				interaction.message.edit({
					content: page.content,
					embeds: page.embeds,
					components: pageComponents,
				});

				interaction.deferUpdate();
			} catch (err) {
				console.log(err);
			}
		}
	);
	private lastButton: Button = new Button(
		new ButtonBuilder()
			.setCustomId(`lastButton-lifeng`)
			.setStyle(ButtonStyle.Primary)
			.setLabel('>>'),
		async ({ interaction }) => {
			const pageInfo = this.pageInfo.get(interaction.message.id);
			if (!pageInfo) return await interaction.deferUpdate();

			try {
				pageInfo.currentPage = pageInfo.pages.length;
				this.pageInfo.set(interaction.message.id, pageInfo);
				const pageComponents = this.createPageButton(
					pageInfo.currentPage,
					pageInfo.pages.length
				);
				const page = pageInfo.pages[pageInfo.currentPage - 1];
				interaction.message.edit({
					content: page.content,
					embeds: page.embeds,
					components: pageComponents,
				});

				interaction.deferUpdate();
			} catch (err) {
				console.log(err);
			}
		}
	);

	constructor(pagerOption: PagerOption) {
		this.frontButton.data =
			pagerOption.frontButton?.setCustomId('frontButton-lifeng') ||
			this.frontButton.data;
		this.prevButton.data =
			pagerOption.prevButton?.setCustomId('prevButton-lifeng') ||
			this.prevButton.data;
		this.pageButton.data =
			pagerOption.pageButton?.setDisabled() || this.pageButton.data;
		this.nextButton.data =
			pagerOption.nextButton?.setCustomId('nextButton-lifeng') ||
			this.nextButton.data;
		this.lastButton.data =
			pagerOption.lastButton?.setCustomId('lastButton-lifeng') ||
			this.lastButton.data;

		pagerOption.client.on('interactionCreate', (interaction) => {
			if (interaction.isButton()) {
				switch (interaction.customId) {
					case 'frontButton-lifeng':
						this.frontButton.run({ client: pagerOption.client, interaction });
						break;
					case 'prevButton-lifeng':
						this.prevButton.run({ client: pagerOption.client, interaction });
						break;
					case 'nextButton-lifeng':
						this.nextButton.run({ client: pagerOption.client, interaction });
						break;
					case 'lastButton-lifeng':
						this.lastButton.run({ client: pagerOption.client, interaction });
						break;
				}
			}
		});
	}

	public handlePage(
		message: Message,
		pages: PagesBuilder,
		timeOut: number | undefined = undefined
	) {
		this.pageInfo.set(message.id, { currentPage: 1, pages: pages.data });

		if (timeOut)
			setTimeout(() => {
				this.pageInfo.delete(message.id);
			}, timeOut);

		message.edit({
			content: pages.data[0].content,
			embeds: pages.data[0].embeds,
			components: this.createPageButton(1, pages.data.length),
		});
	}

	private createPageButton(
		currentPage: number,
		pageMaxnum: number
	): ActionRowBuilder<ButtonBuilder>[] {
		return [
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				this.frontButton.data,
				this.prevButton.data,
				this.pageButton.data.setLabel(`${currentPage}/${pageMaxnum}`),
				this.nextButton.data,
				this.lastButton.data
			),
		];
	}
}
