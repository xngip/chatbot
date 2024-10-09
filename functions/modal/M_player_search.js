const { ModalSubmitInteraction, ModalBuilder } = require("discord.js");

module.exports.data = {
	name: "M_player_search",
	type: "modal",
};

/**
 * @param { object } modal - object modal
 * @param { ModalSubmitInteraction } modal.interaction - modal interaction
 * @param { import('../../lang/vi.js') } modal.lang - language
 */

module.exports.execute = async ({ interaction, lang }) => {
	const { guild, client, fields } = interaction;
	const query = fields.getTextInputValue("search-input");
	const command = client.functions.get("Search");
	await command.execute(interaction, query, lang);
};
