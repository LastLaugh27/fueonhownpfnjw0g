/* CookieBot - A Discord bot that gives out cookies and does stuff
 * Copyright (C) 2017  Ben Mabe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Discord = require('discord.js');
const fs = require('fs');
const randomInt = require('random-int');
const cookies = require('./config/cookies.json');
const auth = require('./config/auth.json');
const givers = require('./config/givers.json');

var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );

var bot = new Discord.Client();

bot.login(auth.token);

bot.on('ready', () =>
{
  console.log('Logged into Discord!');
  console.log('Ready to dispense cookies!')
});

bot.on('message', function (message) {
  if (message.content.substring(0, 1) == '!')

  //Determines is the current user is allowed to give out cookies
  for(i in givers)
  {
    if(message.author.id === givers[i])
      canGive = true;
  }

  canGive = true;

  //Command handler
  if (message.content.substring(0, 1) == '!')
  {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0].toLowerCase();
    var temp = args[1];
    var id = '';

    if(temp !== undefined)
      id = temp.replace(/[<@!>]/g, '');

    switch (cmd) {
      case 'givecookie':
      case 'give🍪':
      case '🍪':
        if(canGive)
        {
          message.channel.send(giveCookie(id))
          canGive = false;
        }
      break;

      case 'cookies':
      case 'displaycookies':
        if(!args[1])
        {
          id = message.author.id;
        }
        message.channel.send(displayCookies(id));
      break;

      case '2liter':
        message.channel.send("Uuuuh 2 liter machine :b:roke, we got 1 liter tho")
      break;

      case '1liter':
        message.channel.send("https://i.imgur.com/1Vuspjq.png")
      break;

      case 'tidepods':
      case 'tidepod':
        message.channel.send("https://www.youtube.com/watch?v=tb2Ct3yyB4g")
      break;
      case 'stealcookies':
        message.channel.send(stealCookie(message.author.id, id));
      break;
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

          for(j in users[i].specialCookies)
          {
            if(users[i].specialCookies[j].name === cookies.special[special].name)
            {
              users[i].specialCookies[j].quantity++
              fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")
              return "🍪 Gave <@" + id + "> a **rare** " + cookies.special[special].name + "!"
            }

          }
          var newSpecial =
          {
            name: cookies.special[special].name,
            quantity: 1,
          }
          users[i].specialCookies.push(newSpecial)

          fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")
          return "🍪 Gave <@" + id + "> a **rare** " + cookies.special[special].name + "!"
        }
      }
      fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")
      return "🍪  Gave <@" + id + "> 1 cookie!"
    }
  }

  var newUser =
  {
    id: id,
    cookies: 1,
    specialCookies: [{"name":"Starter Cookie","quantity":1}]
  }

  users.push(newUser);

  fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8")

  return "🍪 Gave <@" + id + "> 1 cookie and added them to the list!"
}

function displayCookies(id)
{
  var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );

  if((id === '') || (/[a-z]/i.test(id)))
  {
    return "**Usage:** `!displayCookies @DiscordUsername [leave blank for yourself]`\nMake sure you're actuall @-ing them! (I rely on ids!)";
  }

  for(i in id)
  {
    if(id[i] === '!')
      id = id.slice(0, i) + id.slice(i + 1, id.length)
  }

  for(i in users)
  {
    if(users[i].id === id)
    {
      var temp = "User Info:\nUsername: <@" + users[i].id + ">\nCookies: " + users[i].cookies

      for(j in users[i].specialCookies)
      {
        if(j < 1)
        {
          temp += "\nSpecial Cookies: " + users[i].specialCookies[j].name + " x " + users[i].specialCookies[j].quantity;
        }else
        {

          temp += ", " + users[i].specialCookies[j].name + " x " + users[i].specialCookies[j].quantity;
        }
      }
      return temp;
    }
  }

  return "Sorry, <@" + id + "> does not have any cookies :("
}

function stealCookie(robberId, victimId)
{
  var users = JSON.parse( fs.readFileSync("./config/userCookies.json", "utf8") );
  var victim;
  var robber;

  if((victimId === '') || (/[a-z]/i.test(victimId)))
  {
    return "**Usage:** `!stealCookies @DiscordUsername`\nMake sure you're actuall @-ing them! (I rely on ids!)";
  }

  for(i in robberId)
  {
    if(robberId[i] === '!')
      robberId = robberId.slice(0, i) + robberId.slice(i + 1, robberId.length)
  }

  for(i in victimId)
  {
    if(victimId[i] === '!')
      victimId = victimId.slice(0, i) + victimId.slice(i + 1, victimId.length)
  }

  var victimIndex;
  for(i in users)
  {
    if(users[i].id === victimId)
    {
      victim = users[i];
      victimIndex = i;
    }
  }

  if(victim === undefined)
  {
    return "**YOU CAN'T STEAL FROM SOMEONE WHO DOESN'T HAVE ANY COOKIES!** :rage:";
  }else if(victim.cookies === 0)
  {
    return "**:cookie: Looks like some has stolen all of <@" + victim.id + ">'s cookies...** :cry:";
  }

  var robberIndex;
  for(i in users)
  {
    if(users[i].id === robberId)
    {
      robber = users[i];
      robberIndex = i;
    }
  }

  if(robber === undefined)
  {
    return "Sorry, you must have been given a cookie to start the game :cry:"
  }

	var amountToSteal = randomInt(victim.cookies / 2);

	if(amountToSteal === 0)
		amountToSteal = 1;

	var stealChance = 0;

  if(victim.cookies > robber.cookies)
  {
    stealChance = 10;
  }else if(victim.cookies === robber.cookies)
  {
    stealChance = 50;
  }else if(victim.cookies < robber.cookies)
  {
    stealChance = 90;
  }

  if(randomInt(100) >= stealChance)
  {
    users[victimIndex].cookies -= amountToSteal;
    users[robberIndex].cookies += amountToSteal;

    switch(amountToSteal)
    {
      case 1:
        fs.writeFileSync("./config/userCookies.json", JSON.stringify(users), "utf8");
        return ":cookie: **Oh no! <@" + robber.id + "> stole " + amountToSteal + " cookie from <@" + victim.id + "> !**";
        break;
      default:
        return ":cookie: **Oh no! <@" + robber.id + "> stole " + amountToSteal + " cookies from <@" + victim.id + "> !**";
    }

  }else {
    switch (amountToSteal)
    {
      case 1:
        return ":cookie: **Oh no! <@" + robber.id + "> tried to steal " + amountToSteal + " cookie from <@" + victim.id + "> !**";
        break;
      default:
        return ":cookie: **Oh no! <@" + robber.id + "> tried to steal " + amountToSteal + " cookies from <@" + victim.id + "> !**";
    }
  }

}
