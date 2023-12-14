
  // Create a function to draw the spider chart
  /* function drawSpiderChart(id, data, data2, config) {

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
    var maxValue = Math.max(...data.map(function(d) { return d.value; }), ...data2.map(function(d) { return d.value; }));
  
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
  
    // Draw the polygons for data
    // drawPolygon(data, "blue"); // Replace "blue" with the color you want for data
    var polygon = svg.selectAll(".radarArea")
          .data(data)
          .enter()
          .append("polygon")
          .attr("class", "radarArea")
          .attr("points", function(d) {
              var points = [];
              for (var i = 0; i < total; i++) {
                  var x = d[i].value * radius * Math.cos(angleSlice * i - Math.PI / 2);
                  var y = d[i].value * radius * Math.sin(angleSlice * i - Math.PI / 2);
                  points.push([x, y]);
              }
              return points.join(" ");
          })
          .style("fill", "blue")
          .style("fill-opacity", config.opacityArea)
          .on('mouseover', function (d, i){
              // Add interactivity
          })
          .on('mouseout', function(){
              // Add interactivity
      });
    // Draw the polygons for data2
    if (data2.length > 0) {
      // drawPolygon(data2, "red"); // Replace "red" with the color you want for data2
      var polygon2 = svg.selectAll(".radarArea")
          .data(data2)
          .enter()
          .append("polygon")
          .attr("class", "radarArea")
          .attr("points", function(d) {
              var points = [];
              for (var i = 0; i < total; i++) {
                  var x = d[i].value * radius * Math.cos(angleSlice * i - Math.PI / 2);
                  var y = d[i].value * radius * Math.sin(angleSlice * i - Math.PI / 2);
                  points.push([x, y]);
              }
              return points.join(" ");
          })
          .style("fill", "red")
          .style("fill-opacity", config.opacityArea)
          .on('mouseover', function (d, i){
              // Add interactivity
          })
          .on('mouseout', function(){
              // Add interactivity
          });
    }
  }
  
    function drawPolygon(data, color) {
      var polygon = svg.selectAll(".radarArea")
          .data(data)
          .enter()
          .append("polygon")
          .attr("class", "radarArea")
          .attr("points", function(d) {
              var points = [];
              for (var i = 0; i < total; i++) {
                  var x = d[i].value * radius * Math.cos(angleSlice * i - Math.PI / 2);
                  var y = d[i].value * radius * Math.sin(angleSlice * i - Math.PI / 2);
                  points.push([x, y]);
              }
              return points.join(" ");
          })
          .style("fill", color)
          .style("fill-opacity", config.opacityArea)
          .on('mouseover', function (d, i){
              // Add interactivity
          })
          .on('mouseout', function(){
              // Add interactivity
          });
    } */
  
  function drawSpiderChart(id, data, data2, config) {

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

      // Add the values on the axis
      /* for(var j=0; j<config.levels; j++){
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
      } */

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

      // Add the values on the axis
      /* for(var j=0; j<config.levels; j++){
          var levelFactor = radius2*((j+1)/config.levels);
          axisGrid.selectAll(".levels")
              .data(allAxis2)
              .enter()
              .append("svg:text")
              .attr("x", function(d, i){return levelFactor*(1-Math.sin(i*angleSlice2));})
              .attr("y", function(d, i){return levelFactor*(1-Math.cos(i*angleSlice2));})
              .attr("class", "legend")
              .style("font-family", "sans-serif")
              .style("font-size", "10px")
              .attr("fill", "#737373")
              .text(((j+1)/config.levels)*maxValue2);
      } */

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
  } 
  
  /*
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
            // Remove the feature from the data
            data2 = data2.filter(function(e) {
                return e.axis !== d.axis;
            });

            // Update the chart, the table, and the dropdown options
            drawSpiderChart("#chart", data, data2, config);
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
        value: filteredData.map(function(row) {return parseFloat(row[feature]);})
    });

    // Add the feature to the data
    data2.push({
      axis: feature,
      value: filteredData2.map(function(row) {return parseFloat(row[feature]);})
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
        // Remove the feature from the data
        data2 = data2.filter(function(d) {
          return d.axis !== feature;
      });

        // Remove the feature div
        featureDiv.remove();

        // Update the chart and the dropdown options
        drawSpiderChart("#chart", data, data2, config);
        updateTableAndOptions();
    });

    // Append the div to the features container
    document.getElementById('features-container').appendChild(featureDiv);

    // Update the chart, the table, and the dropdown options
    drawSpiderChart("#chart", data, data2, config);
    updateTableAndOptions();
  });
  */

  // Get the select element and the features list
var select = document.getElementById('feature-select');
var featuresList = document.getElementById('features-list');

// Function to update the list and the dropdown options
function updateListAndOptions() {
  // Clear the list
  while (featuresList.firstChild) {
      featuresList.removeChild(featuresList.firstChild);
  }

  // Populate the list with the current features
  data.forEach(function(d) {
      var listItem = document.createElement('li');
      listItem.textContent = d.axis;
      var button = document.createElement('button');
      button.textContent = 'x';
      button.addEventListener('click', function() {
          // Remove the feature from the data
          data = data.filter(function(e) {
              return e.axis !== d.axis;
          });
          // Remove the feature from the data
          data2 = data2.filter(function(e) {
              return e.axis !== d.axis;
          });

          // Update the chart, the list, and the dropdown options
          drawSpiderChart("#chart", data, data2, config);
          updateListAndOptions();
      });
      listItem.appendChild(button);
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
  var feature = select.value;

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
  var featureDiv = document.createElement('div');
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
      drawSpiderChart("#chart", data, data2, config);
      updateListAndOptions();
  });

  // Append the div to the features container
  document.getElementById('features-container').appendChild(featureDiv);

  // Update the chart, the list, and the dropdown options
  drawSpiderChart("#chart", data, data2, config);
  updateListAndOptions();
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
    drawSpiderChart("#chart", aggregatedData, aggregatedData2, config);

    // Get the data display div
  /* var dataDisplay = document.getElementById('data-display');

  if (data.length > 0) {
    // Convert the data to a string
    var dataString = JSON.stringify(data, null, 2);

    // Set the innerHTML of the data display div
    // dataDisplay.innerHTML = '<pre>' + dataString + '</pre>';
  }

  if (data2.length > 0) {
    // Convert the data to a string
    var dataString2 = JSON.stringify(data2, null, 2);

    // Set the innerHTML of the data display div
    // dataDisplay.innerHTML = '<pre>' + dataString2 + '</pre>';
  } */

  }

  // Draw the chart initially with all players
  window.onload = function() {
    updateChart();
    updateListAndOptions();
  }