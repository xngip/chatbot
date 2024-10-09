const { CommandInteraction, PermissionsBitField } = require("discord.js");

module.exports.data = {
	name: "purge",
	description: "Xóa một số lượng tin nhắn từ một kênh",
	type: 1, // slash command
	options: [
		{
			name: "amount",
			description: "Số lượng tin nhắn cần xóa",
			type: 4, // integer
			required: true,
			min_value: 1,
			max_value: 100,
		},
		{
			name: "user",
			description: "Người dùng cần xóa tin nhắn",
			type: 6, // user
			required: false,
		},
	],
	integration_types: [0],
	contexts: [0],
	default_member_permissions: "0",
};

/**
 * @param { object } command - object command
 * @param { CommandInteraction } command.interaction - interaction
 * @param { import('../../lang/vi.js') } command.lang - language
 */

module.exports.execute = async ({ interaction, lang }) => {
	const amount = interaction.options.getInteger("amount");
	const user = interaction.options.getUser("user");

	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
		return interaction.reply({ content: lang.until.noPermission, ephemeral: true });
	}

	if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
		return interaction.reply({ content: lang.until.NOPermission, ephemeral: true });
	}

	const messages = await interaction.channel.messages.fetch({ limit: amount });
	const filteredMessages =
		user ?
			Array.from(messages.filter((msg) => msg.author.id === user.id).values()).slice(0, amount)
		:	Array.from(messages.values()).slice(0, amount);

	await interaction.channel.bulkDelete(filteredMessages, true);
	interaction.reply({ content: `Đã xóa ${filteredMessages.length} tin nhắn.`, ephemeral: true });
};
