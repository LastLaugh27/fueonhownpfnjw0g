# cookie-bot

## Overview
A Discord bot that gives out and keeps track of cookies. Uses a permissions system so only certain users can give.
## commands
* **!giveCookie <@username>** : gives the user a cookie, has a small chance of it being a rare cookie
* **!displayCookies <@username> [OPTIONAL]** : Displays the cookies owned by a user, leave the argument blank to display your own info

## configuration

* **auth.json** : store the bots token here (needed to access Discord)
* **givers.json** : Who can give out cookies
* everything else is used and editied from the bot

## dependancies

* **discord.js**: to connect to discord
* **fs**: to store the JSON in such a way that it updates without triggering NodeJS' cache
* **random-int**: for RNG
