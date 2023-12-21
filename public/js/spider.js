function getQueryParameters() {
  var queryString = window.location.search.substring(1);
  var queryParams = {};
  queryString.split('&').forEach(function (pair) {
      var parts = pair.split('=');
      queryParams[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
  });
  return queryParams;
}

var queryParams = getQueryParameters()

var p1 = queryParams.p1;
var p2 = queryParams.p2;

console.log(p1,p2)

var config = {
  w: 500,
  h: 400,
  maxValue: 1,
  levels: 5,
  ExtraWidthX: 0,
  ExtraHeightY: 0
};

var data = [];
var filteredData = [];
var gw1 = [];
var player1 = p1? p1:"Erling Haaland";

var data2 = [];
var filteredData2 = [];
var gw2 = [];
var player2 = p2? p2:"Mohamed Salah";

var redirect_to_trend = document.querySelector('.trend-thing');
var dataToPass = {
    p1: `${player1}`,
    p2: `${player2}`
};
console.log(`${player1},${player2}`)
var queryString = Object.keys(dataToPass)
.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataToPass[key]))
.join('&');
redirect_to_trend.href = 'timeline.html?' + queryString;

// Load the CSV file
d3.csv("../data/individual_gw.csv").then(function(csvData) {
  var playerSearch = document.getElementById('player-search');
  var playerList = document.getElementById('player-list');
  var selectedPlayer = document.getElementById('selected-player');

  var playerSearch2 = document.getElementById('player-search2');
  var playerList2 = document.getElementById('player-list2');
  var selectedPlayer2 = document.getElementById('selected-player2');

  if (player1 != "") {
    // When the select button is clicked, draw the spider chart for that player
    playerName = player1;
    // Filter the data to only include the rows for the selected player
    filteredData = csvData.filter(function(row) {
        return row['name'] === playerName;
    });

    // Map the filtered data to the format expected by the drawSpiderChart function
    data = [
        {axis: 'assists', value: filteredData.map(function(row) {return parseInt(row['assists']);})},
        {axis: 'goals_scored', value: filteredData.map(function(row) {return parseInt(row['goals_scored']);})},
        {axis: 'expected_assists', value: filteredData.map(function(row) {return parseFloat(row['expected_assists']);})},
        {axis: 'expected_goals', value: filteredData.map(function(row) {return parseFloat(row['expected_goals']);})},
        {axis: 'bonus', value: filteredData.map(function(row) {return parseInt(row['bonus']);})}
    ];

    gw1 = [
        {axis: 'opponent', value: filteredData.map(function(row) {return parseInt(row['opponent_team']);})},
        {axis: 'ishome', value: filteredData.map(function(row) {return (row['was_home']);})}
    ];

    // Get all player boxes
    var playerBoxes = document.getElementsByClassName('player-box');
    // Find the object where axis is 'ishome'
    var ishomeObject = gw1.find(function(d) { return d.axis === 'ishome'; });
    console.log(ishomeObject.value);
    var opponentObject = gw1.find(function(d) { return d.axis === 'opponent'; });

    // Replace the content of each player box with the corresponding data
    for (var i = 0; i < playerBoxes.length/2; i++) {
        
        
        var home = "(H)";
        if (ishomeObject.value[i] == 'False') {
            home = "(A)";
        };

        var opponent = "Error";

        if (opponentObject.value[i] == 1) {
            opponent = "ARS";
        };
        if (opponentObject.value[i] == 2) {
            opponent = "AVL";
        };
        if (opponentObject.value[i] == 3) {
            opponent = "BOU";
        };
        if (opponentObject.value[i] == 4) {
            opponent = "BRE";
        };
        if (opponentObject.value[i] == 5) {
            opponent = "BHA";
        };
        if (opponentObject.value[i] == 6) {
            opponent = "BUR";
        };
        if (opponentObject.value[i] == 7) {
            opponent = "CHE";
        };
        if (opponentObject.value[i] == 8) {
            opponent = "CRY";
        };
        if (opponentObject.value[i] == 9) {
            opponent = "EVE";
        };
        if (opponentObject.value[i] == 10) {
            opponent = "FUL";
        };
        if (opponentObject.value[i] == 11) {
            opponent = "LIV";
        };
        if (opponentObject.value[i] == 12) {
            opponent = "LUT";
        };
        if (opponentObject.value[i] == 13) {
            opponent = "MCI";
        };
        if (opponentObject.value[i] == 14) {
            opponent = "MUN";
        };
        if (opponentObject.value[i] == 15) {
            opponent = "NEW";
        };
        if (opponentObject.value[i] == 16) {
            opponent = "NFO";
        };
        if (opponentObject.value[i] == 17) {
            opponent = "SHU";
        };
        if (opponentObject.value[i] == 18) {
            opponent = "TOT";
        };
        if (opponentObject.value[i] == 19) {
            opponent = "WHU";
        };
        if (opponentObject.value[i] == 20) {
            opponent = "WOL";
        };

        playerBoxes[i].textContent = opponent + home;
    }
    // Call the drawSpiderChart function with the mapped data
    drawSpiderChart("#chart", data, data2, config, 1, player1, player2);
    // Add this inside the selectButton click event listener, after the drawSpiderChart function call
    // var selectedPlayer = document.getElementById('selected-player');
    selectedPlayer.textContent = 'Selected player: ' + playerName;
  }

  if (player2 != "") {
    // When the select button is clicked, draw the spider chart for that player
    playerName = player2;

    // Filter the data to only include the rows for the selected player
    var filteredData2 = csvData.filter(function(row) {
        return row['name'] === playerName;
    });

    // Map the filtered data to the format expected by the drawSpiderChart function
    data2 = [
        {axis: 'assists', value: filteredData2.map(function(row) {return parseInt(row['assists']);})},
        {axis: 'goals_scored', value: filteredData2.map(function(row) {return parseInt(row['goals_scored']);})},
        {axis: 'expected_assists', value: filteredData2.map(function(row) {return parseFloat(row['expected_assists']);})},
        {axis: 'expected_goals', value: filteredData2.map(function(row) {return parseFloat(row['expected_goals']);})},
        {axis: 'bonus', value: filteredData2.map(function(row) {return parseInt(row['bonus']);})}
    ];

    gw2 = [
        {axis: 'opponent', value: filteredData2.map(function(row) {return parseInt(row['opponent_team']);})},
        {axis: 'ishome', value: filteredData2.map(function(row) {return (row['was_home']);})}
    ];

    // Get all player boxes
    var playerBoxes = document.getElementsByClassName('player-box');
    // Find the object where axis is 'ishome'
    var ishomeObject = gw2.find(function(d) { return d.axis === 'ishome'; });
    console.log(ishomeObject.value);
    var opponentObject = gw2.find(function(d) { return d.axis === 'opponent'; });

    // Replace the content of each player box with the corresponding data
    for (var i = 0; i < playerBoxes.length/2; i++) {
        
        
        var home = "(H)";
        if (ishomeObject.value[i] == 'False') {
            home = "(A)";
        };

        var opponent = "Error";

        if (opponentObject.value[i] == 1) {
            opponent = "ARS";
        };
        if (opponentObject.value[i] == 2) {
            opponent = "AVL";
        };
        if (opponentObject.value[i] == 3) {
            opponent = "BOU";
        };
        if (opponentObject.value[i] == 4) {
            opponent = "BRE";
        };
        if (opponentObject.value[i] == 5) {
            opponent = "BHA";
        };
        if (opponentObject.value[i] == 6) {
            opponent = "BUR";
        };
        if (opponentObject.value[i] == 7) {
            opponent = "CHE";
        };
        if (opponentObject.value[i] == 8) {
            opponent = "CRY";
        };
        if (opponentObject.value[i] == 9) {
            opponent = "EVE";
        };
        if (opponentObject.value[i] == 10) {
            opponent = "FUL";
        };
        if (opponentObject.value[i] == 11) {
            opponent = "LIV";
        };
        if (opponentObject.value[i] == 12) {
            opponent = "LUT";
        };
        if (opponentObject.value[i] == 13) {
            opponent = "MCI";
        };
        if (opponentObject.value[i] == 14) {
            opponent = "MUN";
        };
        if (opponentObject.value[i] == 15) {
            opponent = "NEW";
        };
        if (opponentObject.value[i] == 16) {
            opponent = "NFO";
        };
        if (opponentObject.value[i] == 17) {
            opponent = "SHU";
        };
        if (opponentObject.value[i] == 18) {
            opponent = "TOT";
        };
        if (opponentObject.value[i] == 19) {
            opponent = "WHU";
        };
        if (opponentObject.value[i] == 20) {
            opponent = "WOL";
        };

        playerBoxes[i+12].textContent = opponent + home;
    }

    // Call the drawSpiderChart function with the mapped data
    drawSpiderChart("#chart", data, data2, config, 1, player1, player2);

    selectedPlayer2.textContent = 'Selected player: ' + playerName;
  }


  playerSearch.addEventListener('input', function() {
      var searchValue = playerSearch.value.toLowerCase();

      // Filter the data to only include the players whose names start with the search value
      var matchingPlayers = csvData.filter(function(row) {
          return row['name'].toLowerCase().includes(searchValue);
      });

      // Get the unique player names
      var uniquePlayerNames = [...new Set(matchingPlayers.map(player => player['name']))];

      // Clear the player list
      playerList.innerHTML = '';

      if (csvData.length != matchingPlayers.length) {
      // Add the unique player names to the player list
      uniquePlayerNames.forEach(function(playerName) {
          var playerItem = document.createElement('div');
          playerItem.textContent = playerName;

          var selectButton = document.createElement('button');
          selectButton.textContent = 'Select';
          selectButton.addEventListener('click', function() {
              // When the select button is clicked, draw the spider chart for that player
              player1 = playerName;
              // Filter the data to only include the rows for the selected player
              filteredData = csvData.filter(function(row) {
                  return row['name'] === playerName;
              });

              // Map the filtered data to the format expected by the drawSpiderChart function
              data = [
                  {axis: 'assists', value: filteredData.map(function(row) {return parseInt(row['assists']);})},
                  {axis: 'goals_scored', value: filteredData.map(function(row) {return parseInt(row['goals_scored']);})},
                  {axis: 'expected_assists', value: filteredData.map(function(row) {return parseFloat(row['expected_assists']);})},
                  {axis: 'expected_goals', value: filteredData.map(function(row) {return parseFloat(row['expected_goals']);})},
                  {axis: 'bonus', value: filteredData.map(function(row) {return parseInt(row['bonus']);})}
              ];

              gw1 = [
                  {axis: 'opponent', value: filteredData.map(function(row) {return parseInt(row['opponent_team']);})},
                  {axis: 'ishome', value: filteredData.map(function(row) {return (row['was_home']);})}
              ];

              // Get all player boxes
              var playerBoxes = document.getElementsByClassName('player-box');
              // Find the object where axis is 'ishome'
              var ishomeObject = gw1.find(function(d) { return d.axis === 'ishome'; });
              console.log(ishomeObject.value);
              var opponentObject = gw1.find(function(d) { return d.axis === 'opponent'; });

              // Replace the content of each player box with the corresponding data
              for (var i = 0; i < playerBoxes.length/2; i++) {
                  
                  
                  var home = "(H)";
                  if (ishomeObject.value[i] == 'False') {
                      home = "(A)";
                  };

                  var opponent = "Error";

                  if (opponentObject.value[i] == 1) {
                      opponent = "ARS";
                  };
                  if (opponentObject.value[i] == 2) {
                      opponent = "AVL";
                  };
                  if (opponentObject.value[i] == 3) {
                      opponent = "BOU";
                  };
                  if (opponentObject.value[i] == 4) {
                      opponent = "BRE";
                  };
                  if (opponentObject.value[i] == 5) {
                      opponent = "BHA";
                  };
                  if (opponentObject.value[i] == 6) {
                      opponent = "BUR";
                  };
                  if (opponentObject.value[i] == 7) {
                      opponent = "CHE";
                  };
                  if (opponentObject.value[i] == 8) {
                      opponent = "CRY";
                  };
                  if (opponentObject.value[i] == 9) {
                      opponent = "EVE";
                  };
                  if (opponentObject.value[i] == 10) {
                      opponent = "FUL";
                  };
                  if (opponentObject.value[i] == 11) {
                      opponent = "LIV";
                  };
                  if (opponentObject.value[i] == 12) {
                      opponent = "LUT";
                  };
                  if (opponentObject.value[i] == 13) {
                      opponent = "MCI";
                  };
                  if (opponentObject.value[i] == 14) {
                      opponent = "MUN";
                  };
                  if (opponentObject.value[i] == 15) {
                      opponent = "NEW";
                  };
                  if (opponentObject.value[i] == 16) {
                      opponent = "NFO";
                  };
                  if (opponentObject.value[i] == 17) {
                      opponent = "SHU";
                  };
                  if (opponentObject.value[i] == 18) {
                      opponent = "TOT";
                  };
                  if (opponentObject.value[i] == 19) {
                      opponent = "WHU";
                  };
                  if (opponentObject.value[i] == 20) {
                      opponent = "WOL";
                  };

                  playerBoxes[i].textContent = opponent + home;
              }

              var dataToPass = {
                p1: `${player1}`,
                p2: `${player2}`
            };
            console.log(`${player1},${player2}`)
            var queryString = Object.keys(dataToPass)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataToPass[key]))
            .join('&');
            redirect_to_trend.href = 'timeline.html?' + queryString;

              // Call the drawSpiderChart function with the mapped data
              drawSpiderChart("#chart", data, data2, config, 1, player1, player2);
              // Add this inside the selectButton click event listener, after the drawSpiderChart function call
              // var selectedPlayer = document.getElementById('selected-player');
              selectedPlayer.textContent = 'Selected player: ' + playerName;

              // Clear the search bar and hide the player list
              playerSearch.value = '';
              playerList.innerHTML = '';
          });

          playerItem.appendChild(selectButton);
          playerList.appendChild(playerItem);
      });}
  });

  playerSearch2.addEventListener('input', function() {
      var searchValue = playerSearch2.value.toLowerCase();

      // Filter the data to only include the players whose names start with the search value
      var matchingPlayers = csvData.filter(function(row) {
          return row['name'].toLowerCase().includes(searchValue);
      });

      // Get the unique player names
      var uniquePlayerNames = [...new Set(matchingPlayers.map(player => player['name']))];

      // Clear the player list
      playerList2.innerHTML = '';

      if (csvData.length != matchingPlayers.length) {
      // Add the unique player names to the player list
      uniquePlayerNames.forEach(function(playerName) {
          var playerItem = document.createElement('div');
          playerItem.textContent = playerName;

          var selectButton = document.createElement('button');
          selectButton.textContent = 'Select';
          selectButton.addEventListener('click', function() {
              // When the select button is clicked, draw the spider chart for that player
              player2 = playerName;

              // Filter the data to only include the rows for the selected player
              var filteredData2 = csvData.filter(function(row) {
                  return row['name'] === playerName;
              });

              // Map the filtered data to the format expected by the drawSpiderChart function
              data2 = [
                  {axis: 'assists', value: filteredData2.map(function(row) {return parseInt(row['assists']);})},
                  {axis: 'goals_scored', value: filteredData2.map(function(row) {return parseInt(row['goals_scored']);})},
                  {axis: 'expected_assists', value: filteredData2.map(function(row) {return parseFloat(row['expected_assists']);})},
                  {axis: 'expected_goals', value: filteredData2.map(function(row) {return parseFloat(row['expected_goals']);})},
                  {axis: 'bonus', value: filteredData2.map(function(row) {return parseInt(row['bonus']);})}
              ];

              gw2 = [
                  {axis: 'opponent', value: filteredData2.map(function(row) {return parseInt(row['opponent_team']);})},
                  {axis: 'ishome', value: filteredData2.map(function(row) {return (row['was_home']);})}
              ];

              // Get all player boxes
              var playerBoxes = document.getElementsByClassName('player-box');
              // Find the object where axis is 'ishome'
              var ishomeObject = gw2.find(function(d) { return d.axis === 'ishome'; });
              console.log(ishomeObject.value);
              var opponentObject = gw2.find(function(d) { return d.axis === 'opponent'; });

              // Replace the content of each player box with the corresponding data
              for (var i = 0; i < playerBoxes.length/2; i++) {
                  
                  
                  var home = "(H)";
                  if (ishomeObject.value[i] == 'False') {
                      home = "(A)";
                  };

                  var opponent = "Error";

                  if (opponentObject.value[i] == 1) {
                      opponent = "ARS";
                  };
                  if (opponentObject.value[i] == 2) {
                      opponent = "AVL";
                  };
                  if (opponentObject.value[i] == 3) {
                      opponent = "BOU";
                  };
                  if (opponentObject.value[i] == 4) {
                      opponent = "BRE";
                  };
                  if (opponentObject.value[i] == 5) {
                      opponent = "BHA";
                  };
                  if (opponentObject.value[i] == 6) {
                      opponent = "BUR";
                  };
                  if (opponentObject.value[i] == 7) {
                      opponent = "CHE";
                  };
                  if (opponentObject.value[i] == 8) {
                      opponent = "CRY";
                  };
                  if (opponentObject.value[i] == 9) {
                      opponent = "EVE";
                  };
                  if (opponentObject.value[i] == 10) {
                      opponent = "FUL";
                  };
                  if (opponentObject.value[i] == 11) {
                      opponent = "LIV";
                  };
                  if (opponentObject.value[i] == 12) {
                      opponent = "LUT";
                  };
                  if (opponentObject.value[i] == 13) {
                      opponent = "MCI";
                  };
                  if (opponentObject.value[i] == 14) {
                      opponent = "MUN";
                  };
                  if (opponentObject.value[i] == 15) {
                      opponent = "NEW";
                  };
                  if (opponentObject.value[i] == 16) {
                      opponent = "NFO";
                  };
                  if (opponentObject.value[i] == 17) {
                      opponent = "SHU";
                  };
                  if (opponentObject.value[i] == 18) {
                      opponent = "TOT";
                  };
                  if (opponentObject.value[i] == 19) {
                      opponent = "WHU";
                  };
                  if (opponentObject.value[i] == 20) {
                      opponent = "WOL";
                  };

                  playerBoxes[i+12].textContent = opponent + home;
              }

              var dataToPass = {
                p1: `${player1}`,
                p2: `${player2}`
            };
            console.log(`${player1},${player2}`)
            var queryString = Object.keys(dataToPass)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(dataToPass[key]))
            .join('&');
            redirect_to_trend.href = 'timeline.html?' + queryString;

              // Call the drawSpiderChart function with the mapped data
              drawSpiderChart("#chart", data, data2, config, 1, player1, player2);

              selectedPlayer2.textContent = 'Selected player: ' + playerName;

              // Clear the search bar and hide the player list
              playerSearch2.value = '';
              playerList2.innerHTML = '';
          });

          playerItem.appendChild(selectButton);
          playerList2.appendChild(playerItem);
      });}
  });
}).catch(function(error) {
  console.log(error);
});

  
  
  // Create a function to draw the spider chart
function drawSpiderChart(id, data, data2, config, maxval=1, name1='', name2='') {

    // Print data and data2 to the console
    console.log('data:', data);
    console.log('data2:', data2);


    d3.select(id).select("svg").remove();

    var allAxis = data.map(function(i, j){return i.axis}),
        total = allAxis.length,
        radius = Math.min(config.w/3, config.h/3),
        Format = d3.format('%'),
        angleSlice = Math.PI * 2 / total;

    var allAxis2 = data2.map(function(i, j){return i.axis}),
        total2 = allAxis2.length,
        radius2 = Math.min(config.w/3, config.h/3),
        Format2 = d3.format('%'),
        angleSlice2 = Math.PI * 2 / total2;
  
    // Create the spider chart SVG
    var svg = d3.select(id).append("svg")
      .attr("width",  config.w + config.ExtraWidthX)
      .attr("height", config.h + config.ExtraHeightY)
      .append("g")
      .attr("transform", "translate(" + (200) + "," + (200) + ")");
  
    // Create a wrapper for the grid & axes
    var axisGrid = svg.append("g").attr("class", "axisWrapper");
  
    // Calculate maxValue
    var maxValue = Math.max(...data.map(function(d) { return d.value; }));
    var maxValue2 = Math.max(...data2.map(function(d) { return d.value; }));

    if (maxValue >= maxValue2) {
      // Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1, (config.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/config.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1);

      // Draw the axes
      var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    
      // Append the lines
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return radius * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return radius * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");
    
      // Append the labels
      axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return radius * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return radius * Math.sin(angleSlice*i - Math.PI/2); });
    
      // Create a path function
      var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function(d) { return radius * d.value/config.maxValue; })
        .angle(function(d,i) {  return i*angleSlice; });

      // Create a path function
      var radarLine2 = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function(d) { return radius * d.value/config.maxValue; })
        .angle(function(d,i) {  return i*angleSlice; });
    }
    else {
      // Draw the background circles
      axisGrid.selectAll(".levels")
        .data(d3.range(1, (config.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius2/config.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", 0.1);

      // Draw the axes
      var axis = axisGrid.selectAll(".axis")
        .data(allAxis2)
        .enter()
        .append("g")
        .attr("class", "axis");
    
      // Append the lines
      axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return radius2 * Math.cos(angleSlice2*i - Math.PI/2); })
        .attr("y2", function(d, i){ return radius2 * Math.sin(angleSlice2*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-width", "1px");
    
      // Append the labels
      axis.append("text")
        .attr("class", "legend")
        .text(function(d){return d})
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return radius2 * Math.cos(angleSlice2*i - Math.PI/2); })
        .attr("y", function(d, i){ return radius2 * Math.sin(angleSlice2*i - Math.PI/2); });
    
      // Create a path function
      var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function(d) { return radius2 * d.value/config.maxValue; })
        .angle(function(d,i) {  return i*angleSlice2; });

      // Create a path function
      var radarLine2 = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function(d) { return radius2 * d.value/config.maxValue; })
        .angle(function(d,i) {  return i*angleSlice2; });
    }
  
    // Create a wrapper for the radar areas
    var radarWrapper = svg.append("g").attr("class", "radarWrapper");
  
    // Append the backgrounds
    if (data.length > 0) {
      console.log('data:', data);
      radarWrapper.append("path")
        .datum(data)
        .attr("class", "radarArea")
        .attr("d", radarLine)
        .style("fill", "blue")
        .style("fill-opacity", 0.1)
        .style("stroke-width", "2px")
        .style("stroke", "blue")
        .style("stroke-opacity", 0.7);
    }

    // Append the backgrounds
    if (data2.length > 0) {
      radarWrapper.append("path")
        .datum(data2)
        .attr("class", "radarArea")
        .attr("d", radarLine2)
        .style("fill", "red")
        .style("fill-opacity", 0.1)
        .style("stroke-width", "2px")
        .style("stroke", "red")
        .style("stroke-opacity", 0.7);
    }

    // Combine your data arrays
    // var allData = [data, data2];

    // Draw the spider chart
    data.forEach(function(d, i) {
      // Your code to draw the spider chart here...
      // console.log('dataset:', d.value * Math.cos(angleSlice*i));
      // Append the circles
      radarWrapper.append("circle")
        .attr("class", "radarCircle")
        .attr("r", 6)
        .attr("cx", radius*d.value * Math.cos(angleSlice*i- Math.PI/2)) // Use d.value directly
        .attr("cy", radius*d.value * Math.sin(angleSlice*i- Math.PI/2)) // Use d.value directly
        .style("fill", "blue")
        .style("fill-opacity", 0.8)
        .on("mouseover", function() {
          // Show tooltip
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`${player1}\nValue: ${d.value*maxval}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
        })
        .on("mouseout", function() {
          // Hide tooltip
          tooltip.transition().duration(200).style("opacity", 0);
    }); });

    data2.forEach(function(d, i) {
      // Your code to draw the spider chart here...
      // console.log('dataset:', d.value * Math.cos(angleSlice*i));
      // Append the circles
      radarWrapper.append("circle")
        .attr("class", "radarCircle")
        .attr("r", 6)
        .attr("cx", radius*d.value * Math.cos(angleSlice*i- Math.PI/2)) // Use d.value directly
        .attr("cy", radius*d.value * Math.sin(angleSlice*i- Math.PI/2)) // Use d.value directly
        .style("fill", "red")
        .style("fill-opacity", 0.8)
        .on("mouseover", function() {
          // Show tooltip
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip.html(`${player2}\nValue: ${d.value*maxval}`)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
        })
        .on("mouseout", function() {
          // Hide tooltip
          tooltip.transition().duration(200).style("opacity", 0);
    }); });

    // Create a tooltip
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  } 

  // Get the select element and the features list
// var select = document.getElementById('spider-featureDropdown');
// var featuresList = document.getElementById('spider-selectedFeatures');
// Add event listener to the feature dropdown for feature selection
// Features to plot on the timeline
let spider_selected_features = ['goals_scored', 'assists', 'expected_goals', 'expected_assists', 'bonus'];

const select = document.getElementById('spider-featureDropdown');
const featuresList = document.getElementById('spider-selectedFeatures');
const maxFeaturesMessage = document.getElementById('maxFeaturesMessage');


// Function to display selected features as buttons
const spiderdisplaySelectedFeatures = () => {
  featuresList.innerHTML = ''; // Clear previous content

  spider_selected_features.forEach((feature) => {
      const featureButton = document.createElement('button');
      featureButton.textContent = feature + ' ❌'; // Show feature name and cross mark
      featureButton.classList.add('selectedFeature');

      featureButton.addEventListener('click', () => {
          spider_selected_features = spider_selected_features.filter((item) => item !== feature);
          spiderdisplaySelectedFeatures(); // Call this function after removing the feature

          // Populate the list with the current features
          data.forEach(function() {
                // Remove the feature from the data
                data = data.filter(function(e) {
                    return e.axis !== feature;
                });
                // Remove the feature from the data
                data2 = data2.filter(function(e) {
                    return e.axis !== feature;
                });

                // Update the chart, the list, and the dropdown options
                drawSpiderChart("#chart", data, data2, config, 1, player1, player2);
                //updateListAndOptions();
            });
            // listItem.appendChild(button);
            //featuresList.appendChild(listItem);
        });

          //updateFeatures(spider_selected_features);
          //updateListAndOptions();

      featuresList.appendChild(featureButton);
  });

  // Apply CSS to handle button layout
  featuresList.style.display = 'flex';
  featuresList.style.flexWrap = 'wrap';
  featuresList.style.gap = '5px'; // Adjust the gap between buttons as needed
};


spiderdisplaySelectedFeatures();

// Function to update the list and the dropdown options
function updateListAndOptions() {
  // Clear the list
  featuresList.innerHTML = ''; // Clear previous content
  // while (featuresList.firstChild) {
  //    featuresList.removeChild(featuresList.firstChild);
  //}

  // Populate the list with the current features
  data.forEach(function(d) {
      const listItem = document.createElement('button');
      listItem.textContent = feature + ' ❌'; // Show feature name and cross mark
      listItem.classList.add('selectedFeature');
      listItem.addEventListener('click', function() {
          // Remove the feature from the data
          data = data.filter(function(e) {
              return e.axis !== d.axis;
          });
          // Remove the feature from the data
          data2 = data2.filter(function(e) {
              return e.axis !== d.axis;
          });

          // Update the chart, the list, and the dropdown options
          drawSpiderChart("#chart", data, data2, config, 1, player1, player2);
          updateListAndOptions();
      });
      // listItem.appendChild(button);
      featuresList.appendChild(listItem);
  });

  // Update the dropdown options
  var options = select.options;
  for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (data.some(function(d) { return d.axis === option.value; })) {
          option.style.display = 'none';
      } else {
          option.style.display = 'block';
      }
  }
}

// Redraw the chart whenever the selected option changes
select.addEventListener('change', function() {
  // Get the selected feature
  const feature = select.value;

  if (spider_selected_features.length >= 7) {
    maxFeaturesMessage.style.display = 'block';
    maxFeaturesMessage.style.fontSize = '12px';
    maxFeaturesMessage.style.margin = '5px';
    return;
  }

  if (!spider_selected_features.includes(feature)) {
    spider_selected_features.push(feature);
    maxFeaturesMessage.style.display = 'none';
    spiderdisplaySelectedFeatures();

    // Call update_timeline_Plot whenever selected features change
    // update_timeline_Plot(selected_features);
  }

  // Add the feature to the data
  data.push({
      axis: feature,
      value: filteredData.map(function(row) {return parseFloat(row[feature]);})
  });

  // Add the feature to the data
  data2.push({
    axis: feature,
    value: filteredData2.map(function(row) {return parseFloat(row[feature]);})
  });

  // Create a new div with the feature name
  /* var featureDiv = document.createElement('div');
  featureDiv.textContent = feature;

  // Add a click event listener to the feature div
  featureDiv.addEventListener('click', function() {
      // Remove the feature from the data
      data = data.filter(function(d) {
          return d.axis !== feature;
      });
      // Remove the feature from the data
      data2 = data2.filter(function(d) {
        return d.axis !== feature;
    });

      // Remove the feature div
      featureDiv.remove();

      // Update the chart and the dropdown options
      drawSpiderChart("#chart", data, data2, config, 1, player1, player2);
      updateListAndOptions();
  }); */

  // Append the div to the features container
  // document.getElementById('spider-feature-container').appendChild(featureDiv);

  // Update the chart, the list, and the dropdown options
  drawSpiderChart("#chart", data, data2, config, player1, player2);
  // updateListAndOptions();
});

  // Get the player boxes
  var playerBoxes = document.getElementsByClassName('player-box');
  
  // Add a click event listener to each player box
  for (var k = 0; k < playerBoxes.length; k++) {
    playerBoxes[k].addEventListener('click', function() {
        // Toggle the selected class
        this.classList.toggle('selected');

        // Update the chart
        updateChart();
    });
  }

  var selectAllButton1 = document.getElementById('select-all-button-1');
  var unselectAllButton1 = document.getElementById('unselect-all-button-1');
  var selectAllButton2 = document.getElementById('select-all-button-2');
  var unselectAllButton2 = document.getElementById('unselect-all-button-2');

  // Add a click event listener to the select all button for the first grid
  selectAllButton1.addEventListener('click', function() {
    for (var i = 0; i < playerBoxes.length/2; i++) {
      playerBoxes[i].classList.add('selected');
    }

    // Update the chart
    updateChart();
  });

  // Add a click event listener to the unselect all button for the first grid
  unselectAllButton1.addEventListener('click', function() {
    for (var i = 0; i < playerBoxes.length/2; i++) {
      playerBoxes[i].classList.remove('selected');
    }

    // Update the chart
    updateChart();
  });

  // Add a click event listener to the select all button for the second grid
  selectAllButton2.addEventListener('click', function() {
    for (var i = 0; i < playerBoxes.length/2; i++) {
      playerBoxes[i+12].classList.add('selected');
    }

    // Update the chart
    updateChart();
  });

  // Add a click event listener to the unselect all button for the second grid
  unselectAllButton2.addEventListener('click', function() {
    for (var i = 0; i < playerBoxes.length/2; i++) {
      playerBoxes[i+12].classList.remove('selected');
    }

    // Update the chart
    updateChart();
  });

  // Function to update the chart based on the selected players
  function updateChart() {
    // Get the selected players
    var selectedPlayers = [];
    console.log('boxes:', playerBoxes);
    for (var i = 0; i < playerBoxes.length /2; i++) {
        if (playerBoxes[i].classList.contains('selected')) {
            selectedPlayers.push(i);
        }
    }

    // Calculate the aggregated data for the selected players
    var aggregatedData = data.map(function(d) {
        var value = selectedPlayers.reduce(function(sum, i) {
            return sum + d.value[i];
        }, 0);
        return {axis: d.axis, value: value};
    });

    // Get the selected players
    var selectedPlayers2 = [];
    for (var i = 12; i < playerBoxes.length; i++) {
        if (playerBoxes[i].classList.contains('selected')) {
            selectedPlayers2.push(i-12);
        }
    }

    // Calculate the aggregated data for the selected players 2
    var aggregatedData2 = data2.map(function(d) {
      var value = selectedPlayers2.reduce(function(sum, i) {
          return sum + d.value[i];
      }, 0);
      return {axis: d.axis, value: value};
  });

    // Find the maximum value across all features
    var maxValue = Math.max(...aggregatedData.map(function(d) { return d.value; }));
    var maxValue2 = Math.max(...aggregatedData2.map(function(d) { return d.value; }));
    var finalMaxValue = Math.max(maxValue, maxValue2);

    // Normalize the aggregated data
    aggregatedData.forEach(function(d) {
      d.value = d.value / finalMaxValue;
    });

    // Normalize the aggregated data
    aggregatedData2.forEach(function(d) {
      d.value = d.value / finalMaxValue;
    });

    // Update the chart with the aggregated data
    drawSpiderChart("#chart", aggregatedData, aggregatedData2, config, finalMaxValue, player1, player2);

  }

  // Draw the chart initially with all players
  window.onload = function() {
    updateChart();
    //updateListAndOptions();
  }