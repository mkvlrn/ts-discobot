import { Client, Events, GatewayIntentBits, InteractionReplyOptions } from 'discord.js';
import { config } from 'dotenv';
import { commands } from '#/util/get-commands.js';

config();
const { TOKEN } = process.env;

export class Bot extends Client {
  commands = commands;

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });

    this.once(Events.ClientReady, async (bot) => {
      console.log(`online as ${bot.user.tag}`);
    });

    this.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const cmd = (interaction.client as Bot).commands.get(interaction.commandName);
      if (!cmd) {
        console.error(`${interaction.commandName} invoked, ignored`);
        return;
      }

      try {
        await cmd.execute(interaction);
      } catch (error) {
        console.error(error);
        const reply: InteractionReplyOptions = {
          content: 'There was an error while executing this command!',
          ephemeral: true,
        };
        await (interaction.replied || interaction.deferred
          ? interaction.followUp(reply)
          : interaction.reply(reply));
      }
    });
  }

  async start() {
    await this.login(TOKEN);
  }
}
