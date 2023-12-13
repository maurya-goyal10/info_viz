  // Add this at the beginning of your script
  var playerSearch = document.getElementById('player-search');
  var playerList = document.getElementById('player-list');

  playerSearch.addEventListener('input', function() {
    var searchValue = playerSearch.value.toLowerCase();

    // Filter the data to only include the players whose names start with the search value
    var matchingPlayers = csvData.filter(function(row) {
        return row['name'].toLowerCase().includes(searchValue);
    });

    // Clear the player list
    playerList.innerHTML = '';

    // Add the matching players to the player list
    matchingPlayers.forEach(function(player) {
        var playerItem = document.createElement('div');
        playerItem.textContent = player['name'];

        var selectButton = document.createElement('button');
        selectButton.textContent = 'Select';
        selectButton.addEventListener('click', function() {
            // When the select button is clicked, draw the spider chart for that player
            var playerName = player['name'];

            // Filter the data to only include the rows for the selected player
            filteredData = csvData.filter(function(row) {
                return row['name'] === playerName;
            });

            // Map the filtered data to the format expected by the drawSpiderChart function
            data = [
                {axis: 'assists', value: filteredData.map(function(row) {return parseInt(row['assists']);})[0]},
                {axis: 'goals_scored', value: filteredData.map(function(row) {return parseInt(row['goals_scored']);})[0]},
                {axis: 'expected_assists', value: filteredData.map(function(row) {return parseFloat(row['expected_assists']);})[0]},
                {axis: 'expected_goals', value: filteredData.map(function(row) {return parseFloat(row['expected_goals']);})[0]},
                {axis: 'bonus', value: filteredData.map(function(row) {return parseInt(row['bonus']);})[0]}
            ];

            // Call the drawSpiderChart function with the mapped data
            drawSpiderChart("#chart", data, config);
        });

        playerItem.appendChild(selectButton);
        playerList.appendChild(playerItem);
    });
  });
  
  // Create a function to draw the spider chart
  function drawSpiderChart(id, data, config) {

    d3.select(id).select("svg").remove();

    var allAxis = data.map(function(i, j){return i.axis}),
        total = allAxis.length,
        radius = Math.min(config.w/2, config.h/2),
        Format = d3.format('%'),
        angleSlice = Math.PI * 2 / total;
  
    // Create the spider chart SVG
    var svg = d3.select(id).append("svg")
      .attr("width",  config.w + config.ExtraWidthX)
      .attr("height", config.h)
      .append("g")
      .attr("transform", "translate(" + config.w/2 + "," + config.h/2 + ")");
  
    // Create a wrapper for the grid & axes
    var axisGrid = svg.append("g").attr("class", "axisWrapper");
  
    // Calculate maxValue
    var maxValue = Math.max(...data.map(function(d) { return d.value; }));

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

    // Add the values on the axis
    for(var j=0; j<config.levels; j++){
        var levelFactor = radius*((j+1)/config.levels);
        axisGrid.selectAll(".levels")
            .data(allAxis)
            .enter()
            .append("svg:text")
            .attr("x", function(d, i){return levelFactor*(1-Math.sin(i*angleSlice));})
            .attr("y", function(d, i){return levelFactor*(1-Math.cos(i*angleSlice));})
            .attr("class", "legend")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(((j+1)/config.levels)*maxValue);
    }

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
  
    // Create a wrapper for the radar areas
    var radarWrapper = svg.append("g").attr("class", "radarWrapper");
  
    // Append the backgrounds
    radarWrapper.append("path")
      .datum(data)
      .attr("class", "radarArea")
      .attr("d", radarLine)
      .style("fill", "#1a1a1a")
      .style("fill-opacity", 0.1)
      .style("stroke-width", "2px")
      .style("stroke", "#1a1a1a")
      .style("stroke-opacity", 0.7);
  }
  
  // Get the select element and the table body
  var select = document.getElementById('feature-select');
  var tableBody = document.getElementById('feature-table').getElementsByTagName('tbody')[0];

  // Function to update the table and the dropdown options
  function updateTableAndOptions() {
    // Clear the table
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    // Populate the table with the current features
    data.forEach(function(d) {
        var row = tableBody.insertRow();
        var cell = row.insertCell();
        cell.textContent = d.axis;
        cell = row.insertCell();
        var button = document.createElement('button');
        button.textContent = 'x';
        button.addEventListener('click', function() {
            // Remove the feature from the data
            data = data.filter(function(e) {
                return e.axis !== d.axis;
            });

            // Update the chart, the table, and the dropdown options
            drawSpiderChart("#chart", data, config);
            updateTableAndOptions();
        });
        cell.appendChild(button);
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
    var feature = select.value;

    // Add the feature to the data
    data.push({
        axis: feature,
        value: filteredData.map(function(row) {return parseInt(row[feature]);})
    });

    // Create a new div with the feature name
    var featureDiv = document.createElement('div');
    featureDiv.textContent = feature;

    // Add a click event listener to the feature div
    featureDiv.addEventListener('click', function() {
        // Remove the feature from the data
        data = data.filter(function(d) {
            return d.axis !== feature;
        });

        // Remove the feature div
        featureDiv.remove();

        // Update the chart and the dropdown options
        drawSpiderChart("#chart", data, config);
        updateTableAndOptions();
    });

    // Append the div to the features container
    document.getElementById('features-container').appendChild(featureDiv);

    // Update the chart, the table, and the dropdown options
    drawSpiderChart("#chart", data, config);
    updateTableAndOptions();
  });

  // Get the player boxes
  var playerBoxes = document.getElementsByClassName('player-box');

  // Add a click event listener to each player box
  for (var i = 0; i < playerBoxes.length; i++) {
    playerBoxes[i].addEventListener('click', function() {
        // Toggle the selected class
        this.classList.toggle('selected');

        // Update the chart
        updateChart();
    });
  }

  // Function to update the chart based on the selected players
  function updateChart() {
    // Get the selected players
    var selectedPlayers = [];
    for (var i = 0; i < playerBoxes.length; i++) {
        if (playerBoxes[i].classList.contains('selected')) {
            selectedPlayers.push(i);
        }
    }

    // Calculate the aggregated data for the selected players
    var aggregatedData = data.map(function(d) {
        var value = selectedPlayers.reduce(function(sum, i) {
            return sum + d.value[i];
        }, 0) / selectedPlayers.length;
        return {axis: d.axis, value: value};
    });

    // Find the maximum value across all features
    var maxValue = Math.max(...aggregatedData.map(function(d) { return d.value; }));

    // Normalize the aggregated data
    aggregatedData.forEach(function(d) {
      d.value = d.value / maxValue;
    });

    // Update the chart with the aggregated data
    drawSpiderChart("#chart", aggregatedData, config);

    // Get the data display div
  var dataDisplay = document.getElementById('data-display');

  // Convert the data to a string
  var dataString = JSON.stringify(data, null, 2);

  // Set the innerHTML of the data display div
  dataDisplay.innerHTML = '<pre>' + dataString + '</pre>';
  }

  // Draw the chart initially with all players
  window.onload = function() {
    updateChart();
    updateTableAndOptions();
  }


  