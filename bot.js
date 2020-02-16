var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

var contents = fs.readFileSync('nums.json', 'utf8');
var counter = JSON.parse(contents);
var currentCounter = counter.currentCounter;
var totalCounter = 0;
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {

    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !add
            case 'add':
                currentCounter++;
                let cc = {
                  "currentCounter": currentCounter
                };
                let data = JSON.stringify(cc);
                fs.writeFileSync('nums.json', data);
                bot.sendMessage({
                    to: channelID,
                    message: 'Added to chicken tender count. Current count: ' + currentCounter
                });
            break;
            // !remove
            case 'reset':
                currentCounter = 0;
                bot.sendMessage({
                    to: channelID,
                    message: 'Reset chicken tender count.'
                });
            break;
            case 'remove':
                currentCounter--;
                bot.sendMessage({
                    to: channelID,
                    message: 'Removed from chicken tender count. Current count: ' + currentCounter
                });
            break;
            case 'streak':
                bot.sendMessage({
                    to: channelID,
                    message: 'Currently he has eaten ' + currentCounter + " times of chicken tenders in a row."
                });
            break;
         }
     }
});
