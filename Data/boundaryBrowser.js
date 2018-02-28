const fs = require('graceful-fs');

const fillColour = {
	"Lab": "#d50000",
	"Con": "#0087dc",
	"LD": "#FDBB30",
	"Green": "#8dc63f",
	"SNP": "#FFF95D",
	"PC": "#3F8428",
	"UKIP": "#B3009D",
	"Other": "gray"
}

function test(){
	console.log("test!");
}

fs.readFile('boundaries.geojson', 'utf8', function (err, data) {
	var boundaries = JSON.parse(data);

	//CHECK FOR GEOJSON FORMAT & NUMBER OF CONSTITUENCIES (632 - NI)//

	//console.log(boundaries.features[0]);
	// var counter = 0;
	// boundaries.features.forEach(function(b){
	// 	counter++;
	// });
	// console.log(counter);

	fs.readFile('results2017.json', 'utf8', function (err2, results2017) {

		var results = JSON.parse(results2017);

		boundaries.features.forEach(function(b){

			const constID = b.properties.pcon16cd;
			const winningVote = Math.random();
			var countedVotes = 0;
			//console.log(results[constID]);

			results[constID].candidates.forEach(function(c){
				//console.log(c);
				countedVotes += c.vote_share;
				if (countedVotes >= winningVote){
					console.log(c.firstname, c.surname);
					return;
				}
			});

		});

	})
});

console.log(Math.random());