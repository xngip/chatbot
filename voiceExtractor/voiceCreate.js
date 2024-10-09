const { useMainPlayer, useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
async function Update_Player(client, queue) {
	const player = client.functions.get("player_func");
	if (!player) return;
	const res = await player.execute(client, queue);
	queue.metadata.mess.edit(res);
}
module.exports = {
	name: "voiceCreate",
	type: "voiceExtractor",
	execute: async ({ content, channel, client }) => {
		const player = useMainPlayer();
		const lowerContent = content.toLowerCase();
		const queue = useQueue(channel.guild);
		if (!queue) return;

		const commands = {
			"skip|bỏ qua|next": () => {
				queue.node.skip();
				console.log("Đã bỏ qua bài hát hiện tại");
			},
			"volume|âm lượng": () => {
				const volumeMatch = lowerContent.match(/\d+/);
				if (volumeMatch) {
					const newVolume = parseInt(volumeMatch[0]);
					if (newVolume >= 0 && newVolume <= 100) {
						queue.node.setVolume(newVolume);
						console.log(`Đã đặt âm lượng thành ${newVolume}%`);
					} else {
						console.log("Âm lượng phải nằm trong khoảng từ 0 đến 100");
					}
				} else {
					console.log("Không tìm thấy giá trị âm lượng hợp lệ trong lệnh");
				}
				Update_Player(client, queue);
			},
			"pause|tạm dừng": () => {
				queue.node.pause();
				Update_Player(client, queue);
				console.log("Đã tạm dừng phát nhạc");
			},
			"resume|tiếp tục": () => {
				queue.node.resume();
				Update_Player(client, queue);
				console.log("Đã tiếp tục phát nhạc");
			},
			"disconnect|ngắt kết nối": () => {
				queue.delete();
				console.log("Đã ngắt kết nối");
			},
			"auto play|tự động phát": async () => {
				queue.setRepeatMode(queue.repeatMode === 3 ? 0 : 3);
				if (queue.isPlaying()) return Update_Player(client, queue);
				const B_player_autoPlay = client.functions.get("B_player_autoPlay");
				const tracks = await B_player_autoPlay.getRelatedTracks(queue?.history?.previousTrack, queue?.history);
				if (!tracks?.at(0)?.url.length) return;
				const searchCommand = client.functions.get("Search");
				await searchCommand.execute(null, tracks?.at(0)?.url, queue?.metadata?.lang);
			},
			"play|tìm|phát|hát": async () => {
				const query = lowerContent.replace(/play|tìm|phát|hát/g, "").trim();
				await player.play(channel, query);
			},
		};

		for (const [pattern, action] of Object.entries(commands)) {
			if (lowerContent.match(new RegExp(pattern))) {
				await action();
				break;
			}
		}
	},
};
