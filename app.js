const Discord = require('discord.io');
const fs = require('fs');
const randomInt = require('random-int');
const cookies = require('./config/cookies.json');
const auth = require('./config/auth.json');
const givers = require('./config/givers.json');

var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );

var bot = new Discord.Client({ token: auth.token, autorun: true });

bot.on('ready', function (evt) {
  console.log('Cookiebot online!');
  bot.setPresence({game: {name: 'baking cookies'}});
});

bot.on('message', function (user, userID, channelID, message, evt) {
  var canGive = false;
  
  //Determines is the current user is allowed to give out cookies
  for(i in givers)
  {
    if(userID === givers[i])
      canGive = true;
  }
  
  //Command handler
  if (message.substring(0, 1) == '!')
  {
  	var args = message.substring(1).split(' ');
  	var cmd = args[0].toLowerCase();
    var temp = args[1];
    var id = '';
    
    //Takes the userID from the ping in the call
    for(i in temp)
    {
      if((i > 2) && (i < (temp.length - 1)))
      {
        id = id + args[1][i];
      }
    }

    switch (cmd) {
      case 'givecookie':
        if(canGive)
        {
          bot.sendMessage({
            to: channelID,
            message: giveCookie(id, channelID)
          });
          canGive = false;
        }
      break;

      case 'cookies':
      case 'displaycookies':
        if(!args[1])
        {
          id = userID;
        }

        bot.sendMessage({
          to:channelID,
          message: displayCookies(id, channelID)
        });
      break;
    }
  }
});

function giveCookie(id, channelID)
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

          return ":cookie: Gave **" + bot.servers[bot.channels[channelID].guild_id].members[id].username + "** a rare **" + cookies.special[special].name + "**!"
        }
      }
      fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")
      return ":cookie: Gave **" + bot.servers[bot.channels[channelID].guild_id].members[id].username + "** 1 cookie!"
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

  return ":cookie: Gave **" + bot.servers[bot.channels[channelID].guild_id].members[id].username + "** 1 cookie and added them to the list!"
}

function displayCookies(id, channelID)
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
      var temp = "User Info:\nUsername: **" + bot.servers[bot.channels[channelID].guild_id].members[users[i].id].username + "**\nCookies: " + users[i].cookies

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

  return "Sorry, " + bot.servers[bot.channels[channelID].guild_id].members[id].username + " does not have any cookies :("
}
