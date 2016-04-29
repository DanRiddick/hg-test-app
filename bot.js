var HTTPS = require('https');
var XMLHttpRequest = require('xhr2');
var botID = process.env.BOT_ID;

function respond() {
    var request = JSON.parse(this.req.chunks[0]);

    switch (request.text) {
        case "/cc":
            this.res.writeHead(200);
            postCC(request.name, request.user_id);
            this.res.end();
            break;
        case "/asspic":
            this.res.writeHead(200);
            postImg();
            this.res.end();
            break;
        default:
            console.log("don't care");
            this.res.writeHead(200);
            this.res.end();
            break;
    }
    if (request.text.toLowerCase().substr(0, 5) == "/call") {
        this.res.writeHead(200);
        var baseToCall = request.text.substr(5) - 1;
        postCall(baseToCall, request.name);
        this.res.end();
    }
    if (request.text.toLowerCase().substr(0, 9) == "/getcalls") {
        this.res.writeHead(200);
        var baseToCall = request.text.substr(9) - 1;
        getCalls(baseToCall);
        this.res.end();
    }
}

function getCalls(num) {
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
}

function postCall(num, name) {

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://clashcaller.com/api.php", true);
    xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
    xhr.send("REQUEST=APPEND_CALL&warcode=u43at&posy="+num+"&value="+name);
    xhr.onreadystatechange = function (returnval) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
            //check_for_update();
        }
    }

    var botResponse, options, body, botReq;

    botResponse = 'Calling #' + (num + 1) + ' as ' + name;

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botID,
        "text": botResponse
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
    console.log('posting...');
}

function postImg() {
    var options, body, botReq, buffer, randNum;

    randNum = getRandomIntInclusive(1, 9);

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    if (randNum == 1) {
        body = {
            "bot_id": botID,
            "attachments": [{
                "type": "image",
                "url": "http://i.imgur.com/bSyIp29.jpg"
            }]
        };
    } else
    if (randNum == 2) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/HHrP9GZ.jpg"
            }]
        };
    } else
    if (randNum == 3) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/ppEuj5F.jpg"
            }]
        };
    } else
    if (randNum == 4) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/jB9inTw.jpg"
            }]
        };
    } else
    if (randNum == 5) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/z9HLyA6.jpg"
            }]
        };
    } else
    if (randNum == 6) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/kAWZcGp.jpg"
            }]
        };
    } else
    if (randNum == 7) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/17lS9I9.jpg"
            }]
        };
    } else
    if (randNum == 8) {
        body = {
            "bot_id": botID,
            "attachments" : [{
                "type":"image",
                "url":"http://i.imgur.com/xBra65Y.jpg"
            }]
        };
    } else
    if (randNum == 9) {
        body = {
            "bot_id": botID,
            "attachments": [{
                "type": "image",
                "url": "http://i.imgur.com/2nnGixF.jpg"
            }]
        };
    }

    console.log('sending asspic to ' + botID);

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

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function postCC(name, userId) {
    var botResponse, options, body, botReq, nameLength;

    nameLength = name.length;
    botResponse = 'http://clashcaller.com/war/u43at';

    options = {
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    };

    body = {
        "bot_id": botID,
        "text": "here ya go @" + name + "\n" + botResponse ,
	"attachments": [
       {
         "loci": [
           [
             12,
             nameLength
           ]
         ],
         "type": "mentions",
         "user_ids": [
           userId
         ]
       }
     ]
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

exports.respond = respond;