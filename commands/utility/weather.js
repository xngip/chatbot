const { CommandInteraction, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
	data: {
		name: "weather",
		description: "Kiểm tra thời tiết",
		type: 1,
		options: [
			{
				name: "city",
				description: "Tên thành phố",
				type: 3,
				required: true,
				autocomplete: true,
			},
		],
		integration_types: [0, 1],
		contexts: [0, 1, 2],
	},

	/**
	 * @param { object } command - object command
	 * @param { CommandInteraction } command.interaction - interaction
	 * @param { import('../../lang/vi.js') } command.lang - language
	 */

	async execute({ interaction, lang }) {
		await interaction.deferReply();
		const cityInput = interaction.options.getString("city");
		const apiKey = process.env.WEATHER_API_KEY;

		if (!apiKey) {
			return interaction.editReply("API key không tồn tại. Vui lòng liên hệ quản lý bot.");
		}

		try {
			let apiUrl;
			const cityParts = cityInput.split("; ");
			if (cityParts.length >= 4) {
				const lat = cityParts[cityParts.length - 2];
				const lon = cityParts[cityParts.length - 1];
				apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=${lang.name}`;
			} else {
				apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric&lang=${lang.name}`;
			}

			const { data } = await axios.get(apiUrl);

			const formatTime = (timestamp) =>
				new Date((timestamp + data.timezone) * 1000).toLocaleTimeString("en-UK", {
					timeZone: "UTC",
				});
			const weatherEmbed = new EmbedBuilder()
				.setColor("#0099ff")
				.setTitle(`🌡️ ${lang.weather.TITLE}: ${data.name}, :flag_${data.sys.country.toLowerCase()}:`)
				.setDescription(data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1))
				.setThumbnail(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
				.addFields(
					{ name: `🌡️ ${lang.weather.TEMP}`, value: `${data.main.temp}°C`, inline: true },
					{ name: `💧 ${lang.weather.HUMIDITY}`, value: `${data.main.humidity}%`, inline: true },
					{ name: `💨 ${lang.weather.WIND}`, value: `${data.wind.speed} m/s`, inline: true },
					{ name: `☁️ ${lang.weather.CLOUDS}`, value: `${data.clouds.all}%`, inline: true },
					{ name: `🏋️ ${lang.weather.PRESSURE}`, value: `${data.main.pressure} hPa`, inline: true },
					{ name: "\u200B", value: "\u200B", inline: true },
					{ name: `🌅 ${lang.weather.SUNRISE}`, value: formatTime(data.sys.sunrise), inline: true },
					{ name: `🌇 ${lang.weather.SUNSET}`, value: formatTime(data.sys.sunset), inline: true },
					{
						name: `📍 ${lang.weather.COORDINATES}`,
						value: `🌏 ${lang.weather.LATITUDE}: ${data.coord.lat}\n🌎 ${lang.weather.LONGITUDE}: ${data.coord.lon}`,
						inline: false,
					},
				)
				.setFooter({
					text: `${lang.until.requestBy} ${interaction.user.username}`,
					iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
				})
				.setTimestamp();

			await interaction.editReply({ embeds: [weatherEmbed] });
		} catch (error) {
			console.error("Lỗi khi lấy dữ liệu thời tiết:", error);
			await interaction.editReply("Có lỗi xảy ra khi lấy thông tin thời tiết.");
		}
	},

	/**
	 * @param { object } autocomplete - object autocomplete
	 * @param { AutocompleteInteraction } autocomplete.interaction - interaction
	 * @param { import('../../lang/vi.js') } autocomplete.lang - language
	 */

	async autocomplete({ interaction, lang }) {
		const focusedValue = interaction.options.getFocused();
		if (!focusedValue) return interaction.respond([]);

		try {
			const response = await axios.get(
				`http://api.openweathermap.org/geo/1.0/direct?q=${focusedValue}&limit=15&appid=${process.env.WEATHER_API_KEY}`,
			);
			const cities = response.data.map((city) => ({
				name: `${city.name}, ${city.country} X: ${city.lat} Y: ${city.lon}`,
				value: `${city.name}; ${city.country}; ${city.lat}; ${city.lon}`,
			}));
			if (!cities.length) return;
			await interaction.respond(cities);
		} catch (error) {
			return;
		}
	},
};
