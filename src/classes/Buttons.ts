import { ButtonBuilder, Client, MessageComponentInteraction } from 'discord.js';

export class Button {
	public data: ButtonBuilder;
	public run: (buttonRunOption: ButtonRunOption) => any;
	constructor(data: ButtonBuilder, run: (buttonRunOption: ButtonRunOption) => any) {
		this.data = data;
		this.run = run;
	}
}

interface ButtonRunOption {
	client: Client;
	interaction: MessageComponentInteraction;
}
