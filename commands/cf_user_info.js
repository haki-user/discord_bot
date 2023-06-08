const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const url = require("url");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cf_uinfo")
    .setDescription("Provides codeforces user information.")
    .addStringOption((option) =>
      option.setName("handle").setDescription("user handle").setRequired(true)
    ),
  async execute(interaction) {
    try {
      if (!interaction.isChatInputCommand()) return;

      let userInfoApi_url = new URL("https://codeforces.com/api/user.info/");

      let userHandle = interaction.options.getString("handle");
      userInfoApi_url.searchParams.append("handle", userHandle);
    //   console.log(userHandle);
    //   console.log(userInfoApi_url.href);
      let userInfo;

      // get user info from url
      try {
        let res = await axios.get(userInfoApi_url.href);
        userInfo = res.data.result[0];
      } catch {
        interaction.reply(`Handle '${userHandle}' not found..`);
        return;
      }

      // build embed
      const embed = new EmbedBuilder()
        .setTitle("User-Info")
        .addFields(
          { name: "Handle", value: userHandle || "none" },
          { name: "Rating", value: userInfo.rating.toString() || "none" },
          { name: "Rank", value: userInfo.rank || "none" },
          { name: "maxRating", value: userInfo.maxRating.toString() || "none" },
          { name: "email", value: userInfo.email || "none" }
        )
        .setImage(userInfo.titlePhoto);

      // reply
      interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(`Error while responding, url:${userInfoApi_url.href}`);
      console.log(err);
    }
  },
};

// // Create a mock interaction object with a dummy handle
// const mockInteraction = {
//   isChatInputCommand: () => true,
//   options: {
//     getString: () => "pirate__hunter", // Replace with your desired handle for testing
//   },
//   reply: (response) => {
//     console.log("resp", response);
//     // Handle the response as needed
//   },
// };

// // Simulate executing the command with the mock interaction
// module.exports.execute(mockInteraction);
