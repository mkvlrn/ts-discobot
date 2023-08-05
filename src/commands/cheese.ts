import axios from 'axios';
import { CommandInteraction, Interaction } from 'discord.js';
import { createCommand } from '#/commander.js';

const { UNSPLASH_ACCESS_KEY } = process.env;

const execute = async (index: Interaction) => {
  const interaction = index as CommandInteraction;
  const url = 'https://api.unsplash.com/photos/random?query=cheese';
  const axiosOptions = {
    headers: {
      'Accept-Version': 'v1',
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  };

  const response = await axios.get<{ urls: { raw: string } }>(url, axiosOptions);

  interaction.reply(response.data.urls.raw);
};

export const cheese = createCommand('cheese', 'mmm cheese', execute);
