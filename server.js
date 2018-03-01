const path = require('path')  
const express = require('express')  
const exphbs = require('express-handlebars')
const d3 = require('d3')
const fs = require('graceful-fs')

const app = express()
const port = 80;

var geo, results;

function winningPartyFill (abr){
  const fillColour = {
    "Lab": "#d50000",
    "Con": "#0087dc",
    "LD": "#FDBB30",
    "Green": "#8dc63f",
    "SNP": "#FFF95D",
    "PC": "#3F8428",
    "UKIP": "#B3009D",
    "Other": "gray"
  };
  if (!fillColour[abr]){
    return fillColour['Other'];
  }
  return fillColour[abr];
}

var winnerStore = [];

function addThreshold(results, threshold){

  for (var j in results) {

    activeCandidates = [];
    activeVotes = 0;

    for (var i = results[j].candidates.length - 1; i >= 0; i--) {
      c = results[j].candidates[i];
      if (c.vote_share > threshold){
        activeCandidates.push(c);
        activeVotes += c.votes;
      }
    }

    for (var i = activeCandidates.length - 1; i >= 0; i--) {
      c = activeCandidates[i];
      c.vote_share = (c.votes / activeVotes);
    }

    results[j].candidates = activeCandidates;

  }

  return results;
}

function generateWinners(threshold){
  var returnedResults = [];
  winnerStore = [];

  fs.readFile('Data/results2017.json', 'utf8', function (err, data) {
    results = JSON.parse(data);
    results = addThreshold(results, threshold);
    //console.log(results['E14000746']);

    for (var j in results) {
      var constID = j;
      var winningVote = Math.random();
      var countedVotes = 0;

      for (var i = results[constID].candidates.length - 1; i >= 0; i--) {

        c = results[constID].candidates[i];
        countedVotes += c.vote_share;

        if (countedVotes >= winningVote){
            
            var largestVoteShare = 0,
                realWinner = '',
                winnerMatch = '';

            for (var j = results[constID].candidates.length - 1; j >= 0; j--) {
                if (results[constID].candidates[j].vote_share > largestVoteShare){
                    largestVoteShare = results[constID].candidates[j].vote_share;
                    realWinner = results[constID].candidates[j].party_abr;
                }
            }
            
            if (realWinner == c.party_abr){
                winnerMatch = "true";
            } else {
                winnerMatch = "false";
            }

          
          returnedResults.push({
            "constituency_id": constID,
            "constituency_name": results[constID].name,
            "constituency_type": results[constID].type,
            "winner_firstname": c.firstname,
            "winner_surname": c.surname,
            "winner_party": c.party_full,
            "winner_abr": c.party_abr,
            "winner_gender": c.gender,
            "winner_voteshare": c.vote_share,
            "fill_colour": winningPartyFill(c.party_abr),
            "candidate_list": results[constID].candidates,
            "is_real_winner": winnerMatch  
          });
          break;
        }
      };
    }
    //console.log(returnedResults);
    winnerStore = returnedResults;
    return returnedResults;     
  }); 

}

function buildMap(data){
  //console.log(data);
  d3.json(data, function(error, uk) {
    if (error) return console.error(error);
    console.log(uk);
  });
}

//console.log(results[Object.keys(results)[0]]);
//var map_data = generateWinners(geo, results);

app.use(express.static('./public'));

app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'public/layouts')
}))
app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'public'))  

app.get('/', (request, response) => {  
  response.render('home', {
    name: 'Owen'
    //mapData: encodeURIComponent(JSON.stringify(map_data))
  })
})

app.get('/getData', (request, response) => {
  var threshold = request.query.threshold;
  generateWinners(threshold);
  setTimeout(function(){
    //console.log(winnerStore);
    response.json(winnerStore);
    response.send();
  }, 250)
  
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})


