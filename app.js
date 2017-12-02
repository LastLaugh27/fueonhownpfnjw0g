const Discord = require('discord.io');
const fs = require('fs');
const randomInt = require('random-int');
const cookies = require('./config/cookies.json');
const auth = require('./config/auth.json');

var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );

var bot = new Discord.Client({ token: auth.token, autorun: true });

bot.on('ready', function (evt) {
  console.log('Cookiebot online!');
  bot.setPresence({game: {name: 'baking cookies'}});
});

bot.on('message', function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) == '!')
  {
  	var args = message.substring(1).split(' ');
  	var cmd = args[0].toLowerCase();
    var temp = args[1];
    var id = '';

    for(i in temp)
    {
      if((i > 2) && (i < (temp.length - 1)))
      {
        id = id + args[1][i];
      }
    }

    switch (cmd) {
      case 'givecookie':
        bot.sendMessage({
          to: channelID,
          message: giveCookie(id)
        });
      break;

      case 'cookies':
      case 'displaycookies':
        if(!args[1])
        {
          id = userID;
        }

        bot.sendMessage({
          to:channelID,
          message: displayCookies(id)
        });
      break;

      case 'cookieinfo':
        /*bot.sendMessage({
          to: channelID,
          message: getInfo(args[1])
        })*/

    }
  }
});

function giveCookie(id)
{
  var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );

  if((id === '') || (/[a-z]/i.test(id)))
  {
    return "**Usage:** `!giveCookie @DiscordUsername`\nMake sure you're actuall @-ing them! (I rely on ids!)";
  }
  for(i in users)
  {
    if(users[i].id === id)
    {
      users[i].cookies += 1;

      if( randomInt(100) > 75)
      {
        var special = randomInt(cookies.special.length);

        if( randomInt(100) > (100 - cookies.special[special].dropChance) )
        {
          users[i].specialCookies.push(cookies.special[special].name)

          fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")

          return "Gave <@!" + id + "> a **rare** " + cookies.special[special].name + "!"
        }
      }
      fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")
      return "Gave <@!" + id + "> 1 cookie!"
    }
  }

  var newUser =
  {
    id: id,
    cookies: 1,
    specialCookies: ["Starter Cookie"]
  }

  users.push(newUser);

  fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")

  return "Gave <@!" + id + "> 1 cookie and added them to the list!"
}

function displayCookies(id)
{
  var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );

  if((id === '') || (/[a-z]/i.test(id)))
  {
    return "**Usage:** `!displayCookies @DiscordUsername [leave blank for yourself]`\nMake sure you're actuall @-ing them! (I rely on ids!)";
  }

  for(i in users)
  {
    if(users[i].id === id)
    {
      var temp = "User Info:\nUsername: <@!" + users[i].id + ">\nCookies: " + users[i].cookies

      for(j in users[i].specialCookies)
      {
        if(j < 1)
        {
          temp += "\nSpecial Cookies: " + users[i].specialCookies[j];
        }else
        {
          temp += ", " + users[i].specialCookies[j];
        }
      }

      return temp;
    }
  }

  return "Sorry, " + id + " does not have any cookies :("
}
