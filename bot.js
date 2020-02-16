var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

var contents = fs.readFileSync('ccnum.json', 'utf8');
var contents2 = fs.readFileSync('tcnum.json', 'utf8');
var counter = JSON.parse(contents);
var counter2 = JSON.parse(contents2);
var currentCounter = counter.currentCounter;
var totalCounter = counter2.totalCounter;
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
                totalCounter++;
                let ccAdd = {
                  "currentCounter": currentCounter
                };
                let dataAdd = JSON.stringify(ccAdd);
                fs.writeFileSync('ccnum.json', dataAdd);
                let tcAdd = {
                  "totalCounter": totalCounter
                };
                let dataAdd2 = JSON.stringify(tcAdd);
                fs.writeFileSync('tcnum.json', dataAdd2);
                bot.sendMessage({
                    to: channelID,
                    message: 'Added to chicken tender streak. Current streak: ' + currentCounter + " / Total count: " + totalCounter
                });
            break;
            // !reset
            case 'reset':
                currentCounter = 0;
                let ccRs = {
                  "currentCounter": currentCounter
                };
                let dataRs = JSON.stringify(ccRs);
                fs.writeFileSync('ccnum.json', dataRs);
                bot.sendMessage({
                    to: channelID,
                    message: 'Reset chicken tender streak.'
                });
            break;
            // !remove
            case 'remove':
                currentCounter--;
                totalCounter--;
                let ccRm = {
                  "currentCounter": currentCounter
                };
                let dataRm = JSON.stringify(ccRm);
                let tcRm = {
                  "totalCounter": totalCounter
                };
                let dataRm2 = JSON.stringify(tcRm);
                fs.writeFileSync('tcnum.json', dataRm2);
                bot.sendMessage({
                    to: channelID,
                    message: 'Removed from chicken tender streak. Current streak: ' + currentCounter + " / Total count: " + totalCounter
                });
            break;
            // !streak
            case 'streak':
                bot.sendMessage({
                    to: channelID,
                    message: "Currently he has eaten chicken tenders " + currentCounter + " times in a row and a total of " + totalCounter + " times."
                });
            break;
            // !help
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Commands:\n !remove- removes from streak and total\n !add- adds to streak and total\n !reset- resets streak of chicken tenders\n !streak- shows streak and total chicken tenders eaten'
                });
            break;
         }
     }
});
