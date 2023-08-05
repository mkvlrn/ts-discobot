import { Client, Events, GatewayIntentBits, InteractionReplyOptions } from 'discord.js';
import { pino } from 'pino';
import { getCommands, registerCommands } from '#/commander.js';

const logger = pino();
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = await getCommands();
await registerCommands(logger, commands);

bot.once(Events.ClientReady, async (client) => {
  logger.info(`online as ${client.user.tag}`);
});

bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = commands.get(interaction.commandName);
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

await bot.login(process.env.TOKEN);
