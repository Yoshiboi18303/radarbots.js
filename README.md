# Radarbots.js

An unofficial package used to interact with the [Radar Bot Directory](https://radarbotdirectory.xyz) API

---

# Developer

This package was developed by Yoshiboi18303

---

# Usage

## Server Stats Post

```js
const Discord = require("discord.js");
const Radar = require("radarbots.js");
const client = new Discord.Client({
  intents: Object.values(Discord.Intents.FLAGS),
});
const radar = new Radar(client, "Your Radar Bot Directory Token");

client.on("ready", async () => {
  console.log("The client is ready!");
  console.log(await radar.stats(client.guilds.cache.size));
});

client.login("Your token goes here");
```

## Bot Widget

```js
console.log(await radar.botWidget());
```

## Autoposting Stats

```js
const Discord = require("discord.js");
const Radar = require("radarbots.js");
const client = new Discord.Client({
  intents: Object.values(Discord.Intents.FLAGS),
});
const radar = new Radar(client, "Your Radar Bot Directory Token");

client.on("ready", async () => {
  console.log("The client is ready!");
  console.log(await radar.stats(client.guilds.cache.size), 1, true);
});

client.login("Your token goes here");
```

---

# Note

This package could be really buggy (as I'm shitty at JS), so any bug reports would be appreciated.
