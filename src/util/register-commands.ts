import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { commands } from '#/util/get-commands.js';

config();

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
  console.log(report);
} catch (error) {
  console.error(error);
}
