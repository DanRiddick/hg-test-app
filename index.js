var http, director, cool, bot, router, server, port;

http        = require('http');
HTTPS       = require('https');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');
var XMLHttpRequest = require('xhr2');
var botID = process.env.BOT_ID;
var fs = require('fs');
var botID = process.env.BOT_ID;

router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

function ping() {
    this.res.writeHead(200);
    var xhr = new XMLHttpRequest();
    var respstring = [];
    var postname = false, player1 = '';
    xhr.open("POST", "http://clashcaller.com/api.php", true);
    xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
    xhr.send("REQUEST=GET_FULL_UPDATE&warcode=u43at");
    xhr.onreadystatechange = function (returnval) {
        if (xhr.readyState == xhr.DONE && xhr.status == 200) {
            var respJSON = JSON.parse(xhr.responseText);
            for (var rKey in respJSON) {
                if (rKey == "calls") {
                    var callsJSON = JSON.parse(JSON.stringify(respJSON[rKey]));
                    for (var cKey in callsJSON) {
                        var singleCallJSON = JSON.parse(JSON.stringify(callsJSON[cKey]));
                        for (var sKey in singleCallJSON) {
                            if (sKey == 'posy' && singleCallJSON[sKey] == '1') {
                                postname = true;
                            }
                            if (sKey == 'playername' && postname == true) {
                                if (postname == true) {
                                    respstring[respstring.length] = singleCallJSON[sKey];
                                    postname = false;
                                }
                            }
                        }
                    }
                }
            }

            var botResponse, options, body, botReq;

            botResponse = "Most Recent Call: " + respstring[respstring.length - 1] + "\n";
            botResponse += "Previous Calls: ";

            var i;
            for (i = 2; i <= respstring.length; i++) {
                if (i != respstring.length) {
                    botResponse += respstring[(respstring.length - i)] + ", ";
                } else {
                    botResponse += respstring[(respstring.length - i)];
                }
            }

            options = {
                hostname: 'api.groupme.com',
                path: '/v3/bots/post',
                method: 'POST'
            };

            body = {
                "bot_id": botID,
                "text": botResponse,
            };

            console.log('sending ' + botResponse + ' to ' + botID);

            botReq = HTTPS.request(options, function (res) {
                if (res.statusCode == 202) {
                    //neat
                } else {
                    console.log('rejecting bad status code ' + res.statusCode);
                }
            });

            botReq.on('error', function (err) {
                console.log('error posting message ' + JSON.stringify(err));
            });
            botReq.on('timeout', function (err) {
                console.log('timeout posting message ' + JSON.stringify(err));
            });
            botReq.end(JSON.stringify(body));
        }
    }
  this.res.end();
}