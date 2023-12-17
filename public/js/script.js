// Select the SVG element and get its dimensions
const svg1 = d3.select('#timeline_plot');
const timeline_svg_width = +getComputedStyle(svg1.node()).width.slice(0, -2);
const timeline_svg_height = +getComputedStyle(svg1.node()).height.slice(0, -2);

// Parameters for the plot
const timeline_margin = { top: 50, left: 50, right: 20, bottom: 90 };
const timeline_inner_width = timeline_svg_width - timeline_margin.left - timeline_margin.right;
const timeline_inner_height = timeline_svg_height - timeline_margin.top - timeline_margin.bottom;

// Features to plot on the timeline
let selected_features = ['xP', 'creativity'];
// Player names for whom the timeline plot is done
const player1 = 'Bernardo Veiga de Carvalho e Silva';
const player2 = 'Erling Haaland';

const player_list = [player1, player2];
let gameweek_list = [1, 2, 3, 4, 5,6,7, 8, 9, 10, 11, 12];
// Make g1 a global variable
let g1; 
let data;


// Select all checkboxes and initially check them
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.checked = true;
});

function showTooltip(d, player, mouseX, mouseY, scaleFunctions) {
    let tooltipWidth = 150;
    const tooltipHeight = 70;
    const tooltipXOffset = 10; // Offset from the mouse
    const tooltipYOffset = 10; // Offset from the mouse
    let tooltipX = mouseX + tooltipXOffset;
    let tooltipY = mouseY - tooltipHeight - tooltipYOffset;

    

    

    const texts = [`Player: ${player}`, `Gameweek: ${d.GW}`, `${d.feature}: ${scaleFunctions[d.feature].invert(d.number).toFixed(3)}`];
    const font = '12px Arial';

    const widths = getTextWidth(texts, font);
    const maxWidth = Math.max(...Object.values(widths));

    if (maxWidth > tooltipWidth) {
        tooltipWidth = maxWidth + 20; // Add some padding or offset
    }

    // Ensure the tooltip stays within the bounds of the plot
    if (tooltipX + tooltipWidth > timeline_inner_width) {
        tooltipX -= (tooltipX + tooltipWidth) - timeline_inner_width;
    }
    if (tooltipY < 0) {
        tooltipY = mouseY + tooltipYOffset;
    }

    const tooltip = g1.append('g')
        .attr('class', 'tooltip');

    tooltip.append('rect')
        .attr('x', tooltipX)
        .attr('y', tooltipY)
        .attr('width', tooltipWidth)
        .attr('height', tooltipHeight)
        .attr('fill', 'white')
        .attr('stroke', 'black');

    const tooltipText = tooltip.append('text')
        .attr('x', tooltipX + 10)
        .attr('y', tooltipY + 20)
        .style('font-size', '12px')
        .style('fill', 'black')
        .call(wrap, tooltipWidth - 20);

    tooltipText.append('tspan')
        .text(`Player: ${player}`);

    tooltipText.append('tspan')
        .attr('x', tooltipX + 10)
        .attr('dy', '1.5em')
        .text(`Gameweek: ${d.GW}`);

    tooltipText.append('tspan')
        .attr('x', tooltipX + 10)
        .attr('dy', '1.5em')
        .text(`${d.feature}: ${scaleFunctions[d.feature].invert(d.number).toFixed(3)}`);
}


// Function to get text width for a given font size
function getTextWidth(texts, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;

    const widths = {};
    texts.forEach((text, index) => {
        const width = context.measureText(text).width;
        widths[`text${index + 1}`] = width;
    });

    return widths;
}


// Function to wrap text
    function wrap(text, width) {
            text.each(function () {
                const node = d3.select(this),
                    words = node.text().split(/\s+/).reverse(),
                    lineHeight = 1.1,
                    y = node.attr('y'),
                    dy = parseFloat(node.attr('dy')) || 0,
                    tspan = node.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
    
                let line = [],
                    word,
                    lineNumber = 0;
    
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(' '));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(' '));
                        line = [word];
                        tspan = node.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
                    }
                }
            });
        }
    



// Function to set up the initial plot
const setup_timeline_Plot = (csvData) => {
    data = csvData;
    // Filter out relevant data for player1 and player2
    const filteredData = {};
    gameweek_list.forEach(gameweek => {
        filteredData[gameweek] = data.filter(d => (d.name === player_list[0] || d.name === player_list[1]) && d.GW === gameweek);
    });

    




    // Scale functions for each selected feature
    const scaleFunctions = {};
    selected_features.forEach(feature => {
        const maxVal = d3.max(data, d => d[feature]);
        const minVal = d3.min(data, d => d[feature]);
        const scale = d3.scaleLinear().domain([minVal, maxVal]).range([0, 1]);
        scaleFunctions[feature] = scale;
    });

    const player_data = {};

    player_list.forEach(player => {
        const scaledData = selected_features.map(feature => {
            const tempData = [];
            gameweek_list.forEach(gameweek => {
                filteredData[gameweek].forEach(d => {
                    if (d.name === player) {
                        const temp = {
                            GW: gameweek,
                            number: scaleFunctions[feature](d[feature]),
                            feature: feature
                        };
                        tempData.push(temp);
                    }
                });
            });
            return { key: feature, values: tempData };
        });
        player_data[player] = scaledData;
    });

    const color = d3.scaleOrdinal()
        .domain(selected_features)
        .range(['#e41a1c', '#377eb8', '#4daf4a']);

    g1 = svg1.append('g').attr('transform', `translate(${timeline_margin.left},${timeline_margin.top})`);

    const xScale = d3.scaleBand()
        .domain(gameweek_list)
        .range([0, timeline_inner_width])
        .padding(1);

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([timeline_inner_height, 0]);

    g1.append('g')
        .attr('transform', `translate(0, ${timeline_inner_height})`)
        .call(d3.axisBottom(xScale));

    g1.append('g')
        .call(d3.axisLeft(yScale).ticks(5));
    
    g1.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', timeline_inner_width / 2)
        .attr('y', timeline_inner_height + timeline_margin.bottom - 58)
        .text('Gameweeks')
        .style('font-weight', 'bold');

    // Create legends container div
    const legendsGroup = svg1.append('g')
                            .attr('class', 'legends-group')
                            .attr('transform', `translate(20, ${timeline_inner_height + timeline_margin.bottom - 20 })`); // Adjust positioning as needed

    // Create feature legend
    const legendFeature = legendsGroup.append('g')
                                    .attr('class', 'legend')
                                    .attr('transform', 'translate(0, 0)'); // Adjust positioning as needed

    const featureLegendItems = legendFeature.selectAll('.feature-legend-item')
                                            .data(selected_features)
                                            .enter()
                                            .append('g')
                                            .attr('class', 'feature-legend-item')
                                            .attr('transform', (d, i) => `translate(0, ${i * 20})`); // Adjust spacing

    featureLegendItems.append('rect') // Add rectangles as legend markers
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('fill', d => color(d)); // Use the color scale to fill based on feature

    featureLegendItems.append('text') // Add text for features in the legend
                    .attr('x', 15)
                    .attr('y', 8)
                    .text(d => d)
                    .style('font-size', '12px')
                    .style('fill', 'black');

    // Create player legend
    const legendPlayer = legendsGroup.append('g')
                                    .attr('class', 'legend')
                                    .attr('transform', 'translate(150, 0)'); // Adjust positioning as needed

    const playerLegendItems = legendPlayer.selectAll('.player-legend-item')
                                        .data(player_list)
                                        .enter()
                                        .append('g')
                                        .attr('class', 'player-legend-item')
                                        .attr('transform', (d, i) => `translate(0, ${i * 20})`); // Adjust spacing

    playerLegendItems.append('line') // Add lines as legend markers
                        .attr('x1', 0)
                        .attr('y1', 5)
                        .attr('x2', 20)
                        .attr('y2', 5)
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .attr('stroke-dasharray', (d, i) => i === 0 ? '5,5' : '0'); // Dashed line for first player, solid for others

    playerLegendItems.append('text') // Add text for players in the legend
                        .attr('x', 25)
                        .attr('y', 8)
                        .text(d => d)
                        .style('font-size', '12px')
                        .style('fill', 'black');


    
    
    // Dropdown to choose players
  
    const playerDropdown1 = g1.append('foreignObject')
        .attr('x', 10)
        .attr('y', 10)
        .attr('width', 120)
        .attr('height', 30)
        .append('xhtml:select')
        .attr('id', 'playerDropdown1');

    const playerDropdown2 = g1.append('foreignObject')
        .attr('x', 10)
        .attr('y', 50)
        .attr('width', 120)
        .attr('height', 30)
        .append('xhtml:select')
        .attr('id', 'playerDropdown2');

// Extract unique player names from the data
    const playerNames = Array.from(new Set(data.map(d => d.name)));

    playerDropdown1
        .selectAll('option')
        .data(playerNames)
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)
        .property('selected', d=> d === player_list[0]);

    playerDropdown2
        .selectAll('option')
        .data(playerNames)
        .enter()
        .append('option')
        .attr('value', d => d)
        .text(d => d)
        .property('selected', d=> d === player_list[1]);

    playerDropdown1.on('change', () => {
            player_list[0] = playerDropdown1.property('value');
            update_timeline_Plot(selected_features);
        });
    
    playerDropdown2.on('change', () => {
            player_list[1] = playerDropdown2.property('value');
            update_timeline_Plot(selected_features);
        });





    player_list.forEach(player => {

        g1.selectAll('.line')
            .data(player_data[player])
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', function (d) {
                return color(d.key);
            })
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', function () {
                return player == player_list[0] ? '5,5' : null;
            })
            .attr('d', function (d) {
                return d3.line()
                    .x(function (d) { return xScale(d.GW); })
                    .y(function (d) { return yScale(d.number); })
                    (d.values);
            });
        

        g1.append("g")
            .selectAll("dot")
            .data(player_data[player])
            .enter()
            .append("g")
            .selectAll('.dot')
            .data(d => d.values)
            .enter()
            .append('circle')
            .attr("cx", d => xScale(d.GW))
            .attr("cy", d => yScale(d.number))
            .attr("fill", (d, i, nodes) => {
                const feature = nodes[i].parentNode.__data__.key; // Get the feature from the parent node data
                return color(feature); // Coordinate circle color with the feature
            })
            .attr("r", 4)
            .on('mouseover', function (event, d) {
                const [mouseX, mouseY] = d3.pointer(event, this);
                showTooltip(d, player, mouseX, mouseY, scaleFunctions); // Pass the data 'd' to the showTooltip function
            })
            .on('mouseleave', function () {
                g1.selectAll('.tooltip').remove();
            });

    });

};


// Function to update the timeline plot
const update_timeline_Plot = (selectedFeatures) => {
        // Update the global selected_features list
        selected_features = selectedFeatures;
        
        // Clear the existing plot
        svg1.selectAll('*').remove();
        
        // Re-setup the plot with the updated data and features
        setup_timeline_Plot(data);
    };


// Function to extract unique feature names from CSV data
const extractFeatureNames = (csvData) => {
    const features = new Set();
    csvData.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key !== 'name' && !isNaN(row[key])) {
                features.add(key);
            }
        });
    });
    return Array.from(features);
};

// Function to populate the feature dropdown
const populateFeatureDropdown = (features) => {
    const featureDropdown = document.getElementById('featureDropdown');

    features.forEach(feature => {
        const option = document.createElement('option');
        option.text = feature;
        option.value = feature;
        featureDropdown.appendChild(option);
    });
};

// Add event listener to the feature dropdown for feature selection
const featureDropdown = document.getElementById('featureDropdown');
const selectedFeaturesDiv = document.getElementById('selectedFeatures');
const maxFeaturesMessage = document.getElementById('maxFeaturesMessage');

//let selectedFeatures = []; // Array to store selected features

// Modify the event listener for the feature dropdown to call update_timeline_Plot
featureDropdown.addEventListener('change', (event) => {
    const selectedFeature = event.target.value;

    if (selected_features.length >= 3) {
        maxFeaturesMessage.style.display = 'block';
        maxFeaturesMessage.style.fontSize = '12px';
        maxFeaturesMessage.style.margin = '5px';
        return;
    }

    if (!selected_features.includes(selectedFeature)) {
        selected_features.push(selectedFeature);
        maxFeaturesMessage.style.display = 'none';
        displaySelectedFeatures();

        // Call update_timeline_Plot whenever selected features change
        update_timeline_Plot(selected_features);
    }
});

// Function to display selected features as buttons
// Function to display selected features as buttons
const displaySelectedFeatures = () => {
    selectedFeaturesDiv.innerHTML = ''; // Clear previous content

    selected_features.forEach((feature) => {
        const featureButton = document.createElement('button');
        featureButton.textContent = feature + ' ❌'; // Show feature name and cross mark
        featureButton.classList.add('selectedFeature');

        featureButton.addEventListener('click', () => {
            selected_features = selected_features.filter((item) => item !== feature);
            displaySelectedFeatures(); // Call this function after removing the feature
            update_timeline_Plot(selected_features);
        });

        selectedFeaturesDiv.appendChild(featureButton);
    });

    // Apply CSS to handle button layout
    selectedFeaturesDiv.style.display = 'flex';
    selectedFeaturesDiv.style.flexWrap = 'wrap';
    selectedFeaturesDiv.style.gap = '5px'; // Adjust the gap between buttons as needed
};


displaySelectedFeatures();


// Fetch csv files
d3.csv('../data/individual_gw.csv')
    .then(csvData => {
        csvData.forEach(ele => {
            Object.keys(ele).forEach(key => {
                if (!isNaN(ele[key])) {
                    ele[key] = +ele[key];
                }
            });
        });
        setup_timeline_Plot(csvData);
        // Extract unique feature names
        const uniqueFeatures = extractFeatureNames(csvData);

        // Populate the feature dropdown with unique feature names
        populateFeatureDropdown(uniqueFeatures);
    });


    // Function to handle checkbox changes with access to 'data'
    function handleCheckboxChange(event) {
        const checkbox = event.target;
        const checkboxValue = parseInt(checkbox.id.split('checkbox')[1]);

        // Check if the checkbox is checked or unchecked
        if (checkbox.checked) {
            // If checked and not already in gameweek_list, add to the array
            if (!gameweek_list.includes(checkboxValue)) {
                gameweek_list.push(checkboxValue);
            }
        } else {
            // If unchecked, remove the corresponding element from the array
            gameweek_list = gameweek_list.filter(item => item !== checkboxValue);
        }
        gameweek_list.sort((a, b) => a - b);
        update_timeline_Plot(selected_features);

    }

    // Setup event listener for checkboxes using event delegation
    document.addEventListener('change', function(event) {
        if (event.target && event.target.matches('input[type="checkbox"]')) {
            handleCheckboxChange(event);
        }
    });