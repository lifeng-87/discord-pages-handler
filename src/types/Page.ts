import { ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';

export interface Page {
	content?: string;
	embeds?: EmbedBuilder[];
	setContent?: (content: string) => this;
}

export interface PageInfo {
	currentPage: number;
	pages: Page[];
}

export interface ReturnPage extends Page {
	components: ActionRowBuilder<ButtonBuilder>[];
}
