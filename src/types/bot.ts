import { Client, Events, GatewayIntentBits, InteractionReplyOptions } from 'discord.js';
import { commands } from '#/util/get-commands.js';
import { logger } from '#/util/logger.js';

const { TOKEN } = process.env;

export class Bot extends Client {
  commands = commands;

  constructor() {
    super({ intents: [GatewayIntentBits.Guilds] });

    this.once(Events.ClientReady, async (bot) => {
      logger.info(`online as ${bot.user.tag}`);
    });

    this.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const cmd = (interaction.client as Bot).commands.get(interaction.commandName);
      if (!cmd) {
        logger.error(`${interaction.commandName} invoked, ignored`);
        return;
      }

      try {
        await cmd.execute(interaction);
      } catch (error) {
        logger.error(error);
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
