import axios from 'axios';
import { CommandInteraction, Interaction } from 'discord.js';
import { config } from 'dotenv';
import { Command } from '#/types/command.js';

config();
const { UNSPLASH_ACCESS_KEY } = process.env;

export const cheese = new Command('cheese', 'mmm cheese', async (index: Interaction) => {
  const interaction = index as CommandInteraction;

  const response = await axios.get<{ urls: { raw: string } }>(
    'https://api.unsplash.com/photos/random?query=cheese',
    {
      headers: {
        'Accept-Version': 'v1',
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    },
  );

  interaction.reply(response.data.urls.raw);
});
