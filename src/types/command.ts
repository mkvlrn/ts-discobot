import { Interaction, SlashCommandBuilder } from 'discord.js';

export type CommandExecution = (interaction: Interaction) => Promise<void>;

export class Command {
  data: SlashCommandBuilder;

  execute: CommandExecution;

  constructor(name: string, description: string, execute: CommandExecution) {
    this.data = new SlashCommandBuilder().setName(name).setDescription(description);
    this.execute = execute;
  }
}
