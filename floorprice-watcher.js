require("dotenv").config()
const Discord = require("discord.js")
var schedule = require("node-schedule")
const axios = require("axios")

// Setup Discord
const webhookClient = new Discord.WebhookClient(process.env.DISCORD_CHANNELID, process.env.DISCORD_TOKEN)
const embed = new Discord.MessageEmbed().setTitle("Floor Price Warning").setColor("#0099ff")

const COLLECTION_NAME = "otherdeed"
const PRICE_THRESHOLD = 3.6
const PRICE_LISTING = 4.6
const FACTOR_REWARD = 1.4

// #############
// ### START ###
// #############

main()

// #################
// ### Functions ###
// #################
async function main() {
  sendDiscord("Start Floor Watcher Job")

  const jobs = {}
  const delayHours = 0.01 // if you want to start right away give it some time like 0.01h
  const delayedStart = new Date(new Date().getTime() + delayHours * 3600 * 1000) // delay the first Jobrun

  jobs["Job"] = schedule.scheduleJob(delayedStart, async () => {
    runJob()
      .then(() => {
        var nextSchedule = new Date(new Date().getTime() + 0.5 * 3600 * 1000)

        jobs["Job"].reschedule(nextSchedule)
      })
      .catch(() => {
        // try again on error (Polygon in error state, e.g. too busy)
        var nextScheduleError = new Date(new Date().getTime() + 0.5 * 3600 * 1000) // 1 hour
        jobs["Job"].reschedule(nextScheduleError)
      })
  })
}

async function runJob() {
  // Check Floor Price via OpenSea
  const result = await axios.get(`https://api.opensea.io/collection/${COLLECTION_NAME}`)
  const floorPrice = parseFloat(result.data.collection.stats.floor_price)
  console.log(`${COLLECTION_NAME} Floor price at ${floorPrice}`)


  if(floorPrice > PRICE_THRESHOLD) {
    // Send to Discord
    sendDiscord(`WARNING ${COLLECTION_NAME}: Floor Price exceeds your Threshold:     ${floorPrice} > ${PRICE_THRESHOLD}`)
  } else {
    // Send to Discord
    // sendDiscord(`INFO FLOOR PRICE on ${COLLECTION_NAME} is fine:     ${floorPrice} < ${MAX_THRESHOLD}`)
  }

  if(floorPrice * FACTOR_REWARD < PRICE_LISTING){
    // Send to Discord
    sendDiscord(`INFO ${COLLECTION_NAME}: Listing Price of ${PRICE_LISTING}ETH is lower than minimum Earn Threshold of ${floorPrice * FACTOR_REWARD}`)
  }
}

function sendDiscord(text) {
  webhookClient.send(text, {
    username: "FloorWatcher",
    avatarURL: "https://i.imgur.com/wSTFkRM.png",
    embeds: [embed]
  })
}
