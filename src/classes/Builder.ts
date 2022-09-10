import { EmbedBuilder } from 'discord.js';
import { Page } from '../types/Page';

export class PagesBuilder {
	public data: Page[];
	constructor(data: Page[] = []) {
		this.data = data;
	}

	public getFirstPage(): Page {
		return this.data[0];
	}

	public addPage(input: ((page: PageBuilder) => PageBuilder) | Page): this {
		const result =
			typeof input === 'function' ? input(new PageBuilder()) : input;

		this.data.push(result);
		return this;
	}
}

export class PageBuilder implements Page {
	public content?: string = 'undefined';
	public embeds?: EmbedBuilder[] = undefined!;
	constructor(data: Page = { content: 'undefined' }) {
		this.content = data.content;
		this.embeds = data.embeds;
	}
	public setContent(content: string): this {
		this.content = content;
		return this;
	}
	public setEmbeds(embeds: EmbedBuilder[]): this {
		this.embeds = embeds;
		return this;
	}
}
