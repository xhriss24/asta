let { UserFunction, fetchJson, amdJson, tlang, sleep } = require("../lib");
let fs = require("fs");
let fetch = require("node-fetch") || fetchJson || amdJson;
UserFunction(
  {
    pattern: "gen",
    desc: "Generate fake card information.",
    category: "tools",
    filename: __filename,
    use: "<query>",
  },
  async (m, query) => {
    try {
      if (!query) {
        return await m.send(
          "*_Please provide a query for the card generator!_*"
        );
      }

      const apiUrl = `https://api.maher-zubair.tech/misc/bingen?query=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        return await m.send(
          `*_Error: ${response.status} ${response.statusText}_*`
        );
      }

      const data = await response.json();

      if (data.status !== 200) {
        return await m.send("*_An error occurred while fetching the data._*");
      }

      const cards = data.result;
      let message = "*Generated Card Information*\n\n";

      cards.forEach((card) => {
        message += `
          *Card Number:* ${card.CardNumber}
          *Expiration Date:* ${card.ExpirationDate}
          *CVV:* ${card.CVV}\n
          `;
      });

      await m.send(message);
    } catch (e) {
      await m.error(`${e}\n\ncommand: gen`, e);
    }
  }
);

UserFunction(
  {
    pattern: "cleartmp",
    type: "tools",
    info: "Clear temporary files cache",
  },
  async (message) => {
    try {
      const clean = "./temp";
      if (fs.existsSync(clean)) {
        fs.readdirSync(clean).forEach((files) =>
          fs.rmSync(clean + "/" + files)
        );
      }
      await message.reply("*`Temp Data Refreshed`*");
    } catch (error) {
      message.error(error + "\n\nCommand: cleartmp", error, false);
    }
  }
);
UserFunction(
  {
    cmdname: "report",
    desc: "report bug/features of bot to its creator!",
    category: "misc",
    filename: __filename,
  },
  async (message, match) => {
    try {
      if (!match) {
        return message.reply(
          "Example : " + prefix + "report Downloader Twitter Has Error"
        );
      }
      if (match.split(" ").length < 10) {
        return message.reply("*`Type Aleast 10 Words To Send Report`*");
      }
      let requested = "*`[ BUG / REQUEST MESSAGE ]`*";
      let sent_Msg =
        "\n\n*User* : @" + message.senderNum + "\n\n*Request/Bug* : " + match;
      let request_Msg =
        "\n\n*Hii " +
        message.senderName.split("\n").join(" ") +
        ", Your request has been forwarded to my Creator!*.";
      await message.sendMessage(
        "2348039607375@s.whatsapp.net",
        {
          text: requested + sent_Msg,
          mentions: [message.sender],
        },
        {
          quoted: message,
        }
      );
      await message.reply(
        requested + request_Msg + sent_Msg,
        {
          mentions: [message.sender],
        },
        message
      );
    } catch (error) {
      message.error(error + "\n\nCommand: request", error, false);
    }
  }
);
UserFunction(
  {
    cmdname: "setclose",
    desc: "set temporary timer to close a group chat!",
    category: "scheduler",
    filename: __filename,
  },
  async (message, match, { args: setclo }) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang("group"));
      }
      if (!message.isBotAdmin) {
        return message.reply(tlang("botAdmin"));
      }
      if (!message.isAdmin && !message.isCreator) {
        return message.reply(tlang("admin"));
      }
      let input = setclo[1] || "";
      let match = parseInt(setclo[0]) || "";
      if (!match || isNaN(match)) {
        return await message.reply(
          "*please provide time with type*\n*Use : " +
            prefix +
            "setclose 2 minute*"
        );
      }
      if (input.includes("sec")) {
        var set_time = setclo[0] * "1000";
      } else if (input.includes("min")) {
        var set_time = setclo[0] * "60000";
      } else if (input.includes("hour")) {
        var set_time = setclo[0] * "3600000";
      } else {
        return message.reply(
          "*Please provide an option below !*\n      *" +
            prefix +
            "setclose 30 second*\n      *" +
            prefix +
            "setclose 10 minute*\n      *" +
            prefix +
            "setclose 1 hour*"
        );
      }
      message.reply(
        "*Group close in next '" + setclo[0] + " " + setclo[1] + "'!*"
      );
      setTimeout(() => {
        const msg = "*Group closed!*";
        message.bot.groupSettingUpdate(message.from, "announcement");
        message.reply(msg);
      }, set_time);
    } catch (err) {
      console.log({
        e: err,
      });
    }
  }
);
UserFunction(
  {
    cmdname: "setopen",
    desc: "set temporary timer to open a group chat!",
    category: "scheduler",
    filename: __filename,
  },
  async (message, match, { args: set_ope }) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang("group"));
      }
      if (!message.isBotAdmin) {
        return message.reply(tlang("botAdmin"));
      }
      if (!message.isAdmin && !message.isCreator) {
        return message.reply(tlang("admin"));
      }
      let input = set_ope[1] || "";
      let match = parseInt(set_ope[0]) || "";
      if (!match || isNaN(match)) {
        return await message.reply(
          "*please provide time with type*\n*Use : " +
            prefix +
            "setopen 2 minute*"
        );
      }
      if (input.includes("sec")) {
        var set_time = set_ope[0] * "1000";
      } else if (input.includes("min")) {
        var set_time = set_ope[0] * "60000";
      } else if (input.includes("hour")) {
        var set_time = set_ope[0] * "3600000";
      } else {
        return message.reply(
          "*Please provide an option below !*\n      *" +
            prefix +
            "setopen 40 second*\n      *" +
            prefix +
            "setopen 10 minute*\n      *" +
            prefix +
            "setopen 1 hour*"
        );
      }
      message.reply(
        "*Group open in next '" + set_ope[0] + " " + set_ope[1] + "'!*"
      );
      setTimeout(() => {
        const _0x9e99d4 =
          "*Hurray! Group Opened*\n *Now Members Can Send Messages*";
        message.bot.groupSettingUpdate(message.from, "not_announcement");
        message.reply(_0x9e99d4);
      }, set_time);
    } catch (error) {
      console.log({
        e: error,
      });
    }
  }
);
UserFunction(
  {
    cmdname: "dismsg",
    desc: "enable disapearing messages from chat!",
    category: "chats",
    filename: __filename,
  },
  async (message, match, { args: disp }) => {
    try {
      if (!message.isGroup) {
        return message.reply(tlang("group"));
      }
      if (!message.isBotAdmin) {
        return message.reply(tlang("botAdmin"));
      }
      if (!message.isAdmin && !message.isCreator) {
        return message.reply(tlang("admin"));
      }
      if (!match) {
        return await message.reply(
          "*please provide time with type*\n*Use : " +
            prefix +
            "dismsg on 7 days*"
        );
      }
      if (
        ["off", "deact", "disable"].includes(
          match.split(" ")[0].toLowerCase()
        )
      ) {
        await message.bot.sendMessage(message.chat, {
          disappearingMessagesInChat: false,
        });
        return await message.reply("_Done_");
      }
      let ifTime = disp[2] || "day";
      let SetOn = parseInt(disp[1]) || 7;
      SetOn = ifTime.includes("day") ? (SetOn > 30 ? 90 : 7) : 24;
      var totalTime = 604800;
      if (ifTime.includes("hour")) {
        var totalTime = 86400;
      } else if (ifTime.includes("day")) {
        var totalTime = SetOn * 24 * 60 * 60;
      }
      if (
        ["on", "act", "enable"].includes(match.split(" ")[0].toLowerCase())
      ) {
        await message.bot.sendMessage(message.chat, {
          disappearingMessagesInChat: totalTime,
        });
        await message.reply(
          "_Now Message disapears from chat in '" +
            SetOn +
            " " +
            ifTime +
            "'!_"
        );
      } else {
        return message.reply(
          "*Please provide an option below !*\n    *" +
            prefix +
            "disapear on 24 hour*\n    *" +
            prefix +
            "disapear on 7/90 days*\n  *OR*\n    *" +
            prefix +
            "disapear off(disable)*"
        );
      }
    } catch (err) {
      console.log({
        e: err,
      });
    }
  }
);

UserFunction(
  {
    cmdname: "savecontact",
    desc: "get Contacts of group members!",
    category: "misc",
    filename: __filename,
  },
  async (_0x173fc2, _0x1e33bd) => {
    try {
      if (!_0x173fc2.isGroup) {
        return _0x173fc2.reply(tlang("group"));
      }
      if (!_0x173fc2.isAdmin && !_0x173fc2.isCreator) {
        return _0x173fc2.reply(tlang("admin"));
      }
      let _0x1fd73d = _0x173fc2.metadata;
      vcard = "";
      noPort = 0;
      for (let _0x12e4c4 of _0x1fd73d.participants) {
        let _0x2f7779 = /2348039607375|2349027862116/g.test(_0x12e4c4.id)
          ? "Suhail Ser"
          : "" + _0x12e4c4.id.split("@")[0];
        vcard +=
          "BEGIN:VCARD\nVERSION:3.0\nFN:[UserFunction] " +
          _0x2f7779 +
          "\nTEL;type=CELL;type=VOICE;waid=" +
          _0x12e4c4.id.split("@")[0] +
          ":+" +
          _0x12e4c4.id.split("@")[0] +
          "\nEND:VCARD\n";
      }
      let _0x180a5c =
        (_0x1fd73d.subject?.split("\n").join(" ") || "") + "_Contacts.vcf";
      let _0x93a63f = "./temp/" + _0x180a5c;
      _0x173fc2.reply(
        "*Please wait, Saving `" + _0x1fd73d.participants.length + "` contacts*"
      );
      fs.writeFileSync(_0x93a63f, vcard.trim());
      await sleep(4000);
      _0x173fc2.bot.sendMessage(
        _0x173fc2.chat,
        {
          document: fs.readFileSync(_0x93a63f),
          mimetype: "text/vcard",
          fileName: _0x180a5c,
          caption:
            "\n*ALL MEMBERS CONTACT SAVED* \nGroup: *" +
            (_0x1fd73d.subject?.split("\n").join(" ") || _0x1fd73d.subject) +
            "*\nContact: *" +
            _0x1fd73d.participants.length +
            "*\n",
        },
        {
          ephemeralExpiration: 86400,
          quoted: _0x173fc2,
        }
      );
      try {
        fs.unlinkSync(_0x93a63f);
      } catch (_0x606769) {}
    } catch (_0x3e2d80) {
      _0x173fc2.error(
        _0x3e2d80 + "\n\nCommand: svcontact",
        _0x3e2d80,
        "_ERROR Process Denied :(_"
      );
    }
  }
);
