const { useMainPlayer, useQueue } = require("discord-player");
const { ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction, ActionRowBuilder } = require("discord.js");
const player = useMainPlayer();
module.exports.data = {
	name: "B_Lyrics_cancel",
	type: "button",
};

/**
 * @param { object } button - object button
 * @param { ButtonInteraction } button.interaction - button interaction
 * @param { import('../../lang/vi.js') } button.lang - language
 * @returns
 */

module.exports.execute = async ({ interaction, lang }) => {
	await interaction.deferUpdate();
	const queue = useQueue(interaction.guild.id);

	if (!queue) {
		await interaction.message.delete().catch(() => {});
		return;
	}
	// Kiểm tra xem có khóa player không
	if (queue.metadata.LockStatus && queue.metadata.requestedBy?.id !== interaction.user?.id)
		return interaction.followUp({ content: lang.until.noPermission, ephemeral: true });

	// Kiểm tra xem người dùng có ở cùng voice channel với bot không
	const botVoiceChannel = interaction.guild.members.me.voice.channel;
	const userVoiceChannel = interaction.member.voice.channel;
	if (!botVoiceChannel || botVoiceChannel.id !== userVoiceChannel?.id)
		return interaction.followUp({ content: lang.music.NOvoiceMe, ephemeral: true });

	const ZiLyrics = queue.metadata.ZiLyrics;
	ZiLyrics?.unsubscribe();
	ZiLyrics.mess.delete().catch(() => {});
	ZiLyrics.Active = false;
	return;
};
