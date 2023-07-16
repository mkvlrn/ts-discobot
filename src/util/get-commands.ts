import { readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Command } from '#/types/command.js';

const directory = pathToFileURL(fileURLToPath(new URL('../commands', import.meta.url)));
const files = await readdir(directory);
const commands = new Map<string, Command>();

await Promise.all(
  files.map(async (file) => {
    const commandImport = await import(`${directory}/${file}`);
    const command = commandImport[file.split('.')[0]] as Command;
    commands.set(command.data.name, command);
  }),
);

export { commands };
