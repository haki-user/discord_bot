const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const axios = require('axios');
const url = require('url');
const fs = require('fs/promises');
// const jimp = require('jimp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cf_rgraph')
        .setDescription("Provides graph representing user's contest rating history.")
        .addStringOption((option) =>
            option.setName('handle').setDescription('user handle').setRequired(true)
        ),
        
    async execute(interaction) {
        try {
            if (!interaction.isChatInputCommand()) return;
            
            let userRatingApi_url = new URL("https://codeforces.com/api/user.rating");

            let userHandle = interaction.options.getString("handle");
            userRatingApi_url.searchParams.append('handle', userHandle);
            // console.log(userHandle);
            
            // create graph image
            async function genGraphImage(ratingData) {
                const width = 900;
                const height = 600;

                // extract time
                const timeLabels = ratingData.map((entry) => {
                    const timeInSec = entry.ratingUpdateTimeSeconds;
                    const date = new Date(timeInSec * 1000);
                    return date.toLocaleDateString();
                });
                //extrac newRating
                const newRatings = ratingData.map((entry) => entry.newRating);

                // create new instance of chartJSNodeCanvas
                const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

                // generate the graph using Chart.js
                const config = {
                    type: 'line',
                    data: {
                        labels: timeLabels,
                        datasets: [
                            {
                                label: 'New Ratings',
                                data: newRatings,
                                fill: true,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                // backgroundColor: '#D30000',
                                backgroundColor: 'rgba(255, 200, 200, 0.7)',
                                pointBackgroundColor: 'rgba(25, 0, 132, 1)',
                                borderWidth: 3,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            x: {
                                display: true,
                                color: 'rgba(0, 0, 0, 1)',
                                ticks: {
                                    color:'black',
                                    fontSize: 14
                                },
                                backgroundColor: 'rgba(240, 240, 240, .7)',
                                grid: {
                                    display: true,
                                    color: 'rgba(250, 250, 250, 0.9)', // Set the color of the x-axis grid line
                                    lineWidth: 1, // Set the width of the x-axis grid line
                                },
                            },
                            y: {
                                beginAtZero: true,
                                color: 'rgba(0, 0, 0, 1)',
                                ticks: {
                                    color:'black',
                                    fontSize: 14
                                },
                                backgroundColor: 'rgba(255, 255, 255, .7)',
                                grid: {
                                    display: true,
                                    color: 'rgba(250, 250, 250, 0.9)', // Set the color of the x-axis grid line
                                    lineWidth: 1, // Set the width of the x-axis grid line
                                },
                            },
                        },
                    },
                };

                const imageBuffer = await chartJSNodeCanvas.renderToBuffer(config);
                
                // create a new Jimp image from the buffer
                // const image = await jimp.read(imageBuffer);
                // image.background(0xCAF1DE);
                // const newImageBuffer = await image.getBufferAsync(jimp.MIME_PNG);

                //    console.log(image);
                // await fs.writeFile("image.png", imageBuffer, (err) => {
                //     console.log("some error", err);
                // });
                
                return {
                    attachment: imageBuffer,
                    name: 'graph.png'
                };
            }
            
            // fetch handle rating data
            let ratingData;
            try {
                // console.log(userRatingApi_url.href);
                let res = await axios(userRatingApi_url.href);
                ratingData = res.data.result;
                // console.log(ratingData);
            } catch (err) {
                console.log(`An error occurred while fetching from ${userRatingApi_url}.`);
                console.log(err.data);
                interaction.reply("Oops..");
                return;
            }
            
            // create embed
            const embed = new EmbedBuilder()
                .setTitle(`${userHandle} Rating Graph`)
                // .setColor()
                .setImage('attachment://graph.png')
                // .attachFiles([ await genGraphImage(ratingData) ]);


            await interaction.reply({ embeds: [ embed ], files: [ await genGraphImage(ratingData)] });
        } catch (err) {
            console.log("cf_graph global error");
            console.log(err);
        }
    },
}





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