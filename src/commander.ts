import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Interaction, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { Logger } from 'pino';

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => Promise<void>;
};

export function createCommand(
  name: string,
  description: string,
  execute: (interaction: Interaction) => Promise<void>,
): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute,
  };
}

export async function getCommands(): Promise<Map<string, Command>> {
  const directory = pathToFileURL(fileURLToPath(new URL('commands', import.meta.url)));
  const files = await readdir(directory);
  const commands = new Map<string, Command>();

  await Promise.all(
    files.map(async (file) => {
      const commandImport = await import(`${directory}/${file}`);
      const command = commandImport[file.split('.')[0]] as Command;
      commands.set(command.data.name, command);
    }),
  );

  return commands;
}

export async function registerCommands(
  logger: Logger,
  commands: Map<string, Command>,
): Promise<void> {
  const { TOKEN, CLIENT_ID, SERVER_ID, NODE_ENV } = process.env;
  const isDevelopment = NODE_ENV === 'development';
  const rest = new REST().setToken(TOKEN!);
  const payload = { body: Array.from(commands, ([_, cmd]) => cmd.data.toJSON()) };
  const register = isDevelopment
    ? () => rest.put(Routes.applicationGuildCommands(CLIENT_ID!, SERVER_ID!), payload)
    : () => rest.put(Routes.applicationCommands(CLIENT_ID!), payload);
  const report = `${commands.size} commands registered in ${NODE_ENV}:\n${payload.body.map(
    (c) => `/${c.name}`,
  )}`;

  try {
    await register();
    logger.info(report);
  } catch (error) {
    logger.error(error);
  }
}
