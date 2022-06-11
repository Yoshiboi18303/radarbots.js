const Discord = require("discord.js");
const fetch = require("node-fetch");
const ms = require("ms");

module.exports = class Client {
  /**
   * Initializes a new `radar`
   * @param {Discord.Client} client - Your DiscordJS Client.
   * @param {String} token - The token found from your user page on the Radar Bot Directory.
   */
  constructor(client, token) {
    this.client = client;
    this.token = token;
    this.fetch = fetch;

    if (!(this.client instanceof Discord.Client))
      throw new Error("The client option needs to be a Discord.js Client!");
    if (!this.token) throw new Error("The token is required!");
  }

  /**
   * Posts server stats to the API.
   * Requires the `server count`, `shard count` will be set to 1 if not provided.
   * If autopost is set to true, the radar will post to the API every two minutes.
   * @param {Number} serverCount - The amount of servers your bot is in. If not provided, an error will be returned.
   * @param {Number} shardCount - The amount of shards your bot has. Defaults to 1.
   * @param {Boolean} autopost - Whether to autopost to the API or not. Defaults to false.
   * @returns A Promise either containing the status code (if it's not 200 OK), or a success message.
   */
  stats(serverCount, shardCount = 1, autopost = false) {
    if (!serverCount) throw new Error("The server count is required!");

    if (!autopost) {
      return new Promise(async (resolve, reject) => {
        var req = await this.fetch.default(
          `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/stats`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: this.token,
            },
            body: JSON.stringify({
              guilds: serverCount,
              shards: shardCount,
            }),
          }
        );
        var data = await req.json();
        if (req.status != 200) reject(data);
        resolve(data);
      });
    } else {
      var firstRequest = this.fetch.default(
        `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token,
          },
          body: JSON.stringify({
            guilds: serverCount,
            shards: shardCount,
          }),
        }
      );
      return new Promise(async (resolve, reject) => {
        firstRequest
          .json()
          .then((data) => {
            resolve(data);
            setInterval(() => {
              return new Promise(async (resolve, reject) => {
                var req = await this.fetch.default(
                  `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: this.token,
                    },
                    body: JSON.stringify({
                      guilds: serverCount,
                      shards: shardCount,
                    }),
                  }
                );
                var data = await req.json();
                if (req.status != 200) reject(data);
                else resolve(data);
              });
            }, ms("2m"));
          })
          .catch((e) => reject(e));
      });
    }
  }

  /**
   * Fetches your bot info from the API.
   */
  botInfo() {
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(
        `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}`,
        {
          method: "GET",
        }
      );
      if (req.status != 200)
        return reject(`[RadarBots.JS] - ${req.status}: ${req.statusText}`);
      var data = await req.json();
      return resolve(data);
    });
  }

  /**
   * Fetches your bot widget from the API.
   */
  botWidget() {
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(
        `https://radarbotdirectory.xyz/api/bot/${this.client.user.id}/widget`,
        {
          method: "GET",
        }
      );
      if (req.status != 200)
        return reject(`[RadarBots.JS] - ${req.status}: ${req.statusText}`);
      var buffer = Buffer.from(await req.arrayBuffer());
      return resolve(buffer);
    });
  }

  /**
   * Fetches the Unix Epoch Timestamp of the last time the specified user voted for your bot.
   * @param {Discord.Snowflake} userID - The ID of the user to look up.
   */
  lastVoted(userID) {
    if (!userID) throw new Error("The user ID is required!");
    return new Promise(async (resolve, reject) => {
      var req = await this.fetch.default(
        `https://radarbotdirectory.xyz/api/lastvoted/${userID}/${this.client.user.id}`,
        {
          method: "GET",
        }
      );
      if (req.status != 200)
        return reject(`[RadarBots.JS] - ${req.status}: ${req.statusText}`);
      var data = await req.json();
      return resolve(data);
    });
  }
};
