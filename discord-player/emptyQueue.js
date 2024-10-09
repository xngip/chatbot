const config = require("../config");
const { useMainPlayer, GuildQueueEvent } = require("discord-player");
const players = useMainPlayer();

module.exports = {
	name: GuildQueueEvent.emptyQueue,
	type: "Player",
	execute: async (queue) => {
		const player = players.client.functions.get("player_func");
		if (!player) return;
		const res = await player.execute(players.client, queue);
		if (queue.metadata.mess) return queue.metadata.mess.edit(res);
	},
};
