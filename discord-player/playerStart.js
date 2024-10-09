const { GuildQueue, Track, GuildQueueEvent } = require("discord-player");
const config = require("../config");

async function SendNewMessenger(queue, playerGui) {
	queue.metadata.mess = await queue.metadata.channel.send(playerGui);
	return;
}

module.exports = {
	name: GuildQueueEvent.playerStart,
	type: "Player",
	/**
	 *
	 * @param { GuildQueue } queue
	 * @param { Track } track
	 * @returns
	 */
	execute: async (queue, track) => {
		const { client } = queue.player;

		const player_func = client.functions.get("player_func");
		if (!player_func) return;

		const playerGui = await player_func.execute(client, queue, track);

		// send messenger
		if (!queue.metadata.mess) {
			await SendNewMessenger(queue, playerGui);
			return;
		}
		// edit messenger
		await queue.metadata.mess.edit(playerGui).catch(async () => await SendNewMessenger(queue, playerGui));
		// lyrics

		const ZiLyrics = queue.metadata.ZiLyrics;
		if (ZiLyrics?.Active) {
			const Lyrics = client.functions.get("Lyrics");
			if (!Lyrics) return;
			await Lyrics.execute(null, { type: "syncedLyrics", queue });
			return;
		}
	},
};
