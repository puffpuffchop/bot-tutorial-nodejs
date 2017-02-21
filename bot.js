var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
    var request = JSON.parse(this.req.chunks[0]);
    var scheduleRegex = /^\/sch ([a-z]{2,3})$/;
    var rosterRegex = /^\/roster ([a-z]{2,3})$/;
    dlRegex = /^\/dl$/;

    if (request.text && scheduleRegex.test(request.text)) {
        var team = (request.text).match(scheduleRegex);
        this.res.writeHead(200);
        postResponse('schedule', team[1]);
        this.res.end();
    } else if (request.text && rosterRegex.test(request.text)) {
        var team = (request.text).match(rosterRegex);
        this.res.writeHead(200);
        postResponse('roster', team[1]);
        this.res.end();
    }

    else if(request.text && dlRegex.test(request.text)){      
      this.res.writeHead(200);
      postResponse('', '');
      this.res.end();
    }
    else {
        console.log("don't care");
        this.res.writeHead(200);
        this.res.end();
    }
}

function postResponse(route, teamName) {
    var botResponse, options, body, botReq;
    var url = "http://daddyleagues.com/" + process.env.LEAGUE_NAME + "/team/" + teamName + "/"+route;
    if(route == '' && teamName == ''){
      url = `http://daddyleagues.com/${process.env.LEAGUE_NAME}/`
    }
    botResponse = url;

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

    botReq = HTTPS.request(options, function(res) {
        if (res.statusCode == 202) {
            //neat
        } else {
            console.log('rejecting bad status code ' + res.statusCode);
        }
    });

    botReq.on('error', function(err) {
        console.log('error posting message ' + JSON.stringify(err));
    });
    botReq.on('timeout', function(err) {
        console.log('timeout posting message ' + JSON.stringify(err));
    });
    botReq.end(JSON.stringify(body));
}


exports.respond = respond;
