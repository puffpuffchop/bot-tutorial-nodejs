var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      scheduleRegex = /^\/sch ([a-z]{2,3})$/;
      rosterRegex = /^\/roster ([a-z]{2,3})$/;
      //dlRegex = /^\/dl$/;

  if(request.text && scheduleRegex.test(request.text)) {
    var team = scheduleRegex.exec(request.text);
    console.log(team);
    var url = "http://daddyleagues.com/"+process.env.LEAGUE_NAME+"/team/"+team+"/schedule";
    //this.res.writeHead(200);
    postResponse(url);
    //this.res.end();
  } else if(request.text && rosterRegex.test(request.text)){
    console.log(team);
    var team = rosterRegex.exec(request.text);
    var url = "http://daddyleagues.com/"+process.env.LEAGUE_NAME+"/team/"+team+"/roster";
    //this.res.writeHead(200);
    postResponse(url);
    //this.res.end();
  }
  //already have bot doing requests to /dl
  /*else if(request.text && dlRegex.test(request.text)){
    var url = `http://daddyleagues.com/${process.env.LEAGUE_NAME}/`
    this.res.writeHead(200);
    postResponse(url);
    this.res.end();
  }*/
  else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postResponse(url) {
  var botResponse, options, body, botReq;

  botResponse = url;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
