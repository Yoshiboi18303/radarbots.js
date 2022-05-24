const Discord = require("discord.js");
const fetch = require("node-fetch");
const ms = require("ms");

module.exports = class Client {
  /** 
   * @param {Discord.Client} client
   * @param {String} token
   */
  constructor(client, token) {
    this.client = client;
    this.token = token;
    this.fetch = fetch;

    if(!(this.client instanceof Discord.Client)) throw new Error("The client option needs to be a Discord.js Client!".red)
  }

  /** 
   * Posts server stats to the API.
   * Requires the server count, shard count will be set to 1 if not provided.
   * Can autopost to the API if the autopost option is true.
   * Autopost option is false by default.
   * @param {Number} serverCount
   * @param {Number} shardCount
   * @param {Boolean} autopost
   */
  stats(serverCount, shardCount, autopost) {
    if(!serverCount) throw new Error("The server count is required!".red)
    if(!shardCount) shardCount = 1
    if(!autopost) autopost = false;

    return new Promise(async (resolve, reject) => {
      if(autopost) {
        setInterval(async () => {
          var req = await this.fetch.default(`https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/stats`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": this.token
            },
            body: JSON.stringify({
              guilds: serverCount,
              shards: shardCount
            })
          })
          if(req.status != 200) return reject(`[RadarJS] - ${req.status}: ${req.statusText}`)
          var data = await req.json()
          return resolve(data)
        }, ms("2m"))
      } else {
        var req = await this.fetch.default(`https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/stats`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": this.token
            },
            body: JSON.stringify({
              guilds: serverCount,
              shards: shardCount
            })
          })
          if(req.status != 200) return reject(`[RadarJS] - ${req.status}: ${req.statusText}`)
          var data = await req.json()
          return resolve(data)
      }
    })
  }

  /** 
   * Fetches your bot info from the API.
   */
  botInfo() {
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(`https://radarbotdirectory.xyz/api/bot/${this.client.user.id}`, {
        method: "GET"
      })
      if(req.status != 200) return reject(`[RadarJS] - ${req.status}: ${req.statusText}`)
      var data = await req.json()
      return resolve(data)
    })
  }

  /** 
   * Fetches your bot widget from the API
   */
  botWidget() {
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(`https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/widget`, {
        method: "GET"
      })
      if(req.status != 200) return reject(`[RadarJS] - ${req.status}: ${req.statusText}`)
      var data = await req.json()
      return resolve(data)
    })
  }

  /** 
   * Fetches the Unix Epoch Timestamp of the last time the specified user voted for your bot.
   * @param {String} userID
   */
  lastVoted(userID) {
    if(!userID) throw new Error("The user ID is required!".red)
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(`https://radarbotdirectory.xyz/lastvoted/${userID}/${this.client.user.id}`, {
        method: "GET"
      })
      if(req.status != 200) return reject(`[RadarJS] - ${req.status}: ${req.statusText}`)
      var data = await req.json()
      return resolve(data)
    })
  }
}