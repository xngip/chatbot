// const { User } = require("discord.js");
const { CommandInteraction } = require("discord.js");

module.exports.data = {
	name: "cat",
	description: "Random ảnh mèo",
	type: 1, // slash command
	options: [
		{
			name: "count",
			description: "Số lượng mèo",
			type: 4,
			required: false,
			max_value: 10,
		},
	],
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

/**
 * @param { object } command - object command
 * @param { CommandInteraction } command.interaction - interaction
 * @param { import('../../lang/vi.js') } lang
 */

module.exports.execute = async ({ interaction, lang }) => {
	await interaction.deferReply();
	const count = interaction.options.getInteger("count") || 1;

	const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${count}`);
	const data = await response.json();

	const urls = data.map((image) => image.url);

	await interaction.editReply({ files: urls });
};
