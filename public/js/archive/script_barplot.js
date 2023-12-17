// Select the SVG element and get its dimensions
const svg1 = d3.select('#timeline_plot');
const timeline_svg_width = +getComputedStyle(svg1.node()).width.slice(0, -2);
const timeline_svg_height = +getComputedStyle(svg1.node()).height.slice(0, -2);



// Parameters for the plot
const timeline_margin = { top: 20, left: 40, right: 20, bottom: 20 };
const timeline_inner_width = timeline_svg_width - timeline_margin.left - timeline_margin.right;
const timeline_inner_height = timeline_svg_height - timeline_margin.top - timeline_margin.bottom;

// Features to plot on the timeline
const selected_features = ['xP', 'value', 'element'];
// Player names for whom the timeline plot is done
const player1 = 'Ivan Toney';
const player2 = 'Eddie Nketiah';

const player_list = [player1, player2];
const gameweek_list = [1, 2, 3, 5];

// Function to set up the initial plot
const setup_timeline_Plot = (data) => {
    // Filter out relevant data for player1 and player2
    const filteredData = {};
    gameweek_list.forEach(gameweek => {
        filteredData[gameweek] = data.filter(d => ((d.name === player1 || d.name === player2) && d.GW === gameweek))
    });

    // Scale functions for each selected feature
    const scaleFunctions = {};
    selected_features.forEach(feature => {
        const maxVal = d3.max(data, d => d[feature]);
        const minVal = d3.min(data, d => d[feature]);
        const scale = d3.scaleLinear().domain([minVal, maxVal]).range([0, 1]);
        scaleFunctions[feature] = scale;
    });

    // Log scaled values for player1 and player2
    const scaledData = {};
    gameweek_list.forEach(gameweek => {
        scaledData[gameweek] = {};
        selected_features.forEach(feature => {
            scaledData[gameweek][feature] = {};
            filteredData[gameweek].forEach(d => {
                scaledData[gameweek][feature][d.name] = scaleFunctions[feature](d[feature]);
            });
        });
    });

    console.log(scaledData);

    const g1 = svg1.append('g').attr('transform', `translate(${timeline_margin.left},${timeline_margin.top})`);

    // Define X axis where the domain are the gameweeks
    const xscale = d3.scaleBand()
        .domain(gameweek_list)
        .range([0, timeline_inner_width])
        .padding(0.09);

    // Scale for the y-axis
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([timeline_inner_height, 0]);

    // Scale for subgroup within the domain with selected features
    const xSubgroupScale = d3.scaleBand()
        .domain(selected_features)
        .range([0, xscale.bandwidth()]);

    // Further divide the feature subgroup into each player    
    const xSubgroupScale_players = d3.scaleBand()
        .domain(player_list)
        .range([0, xSubgroupScale.bandwidth()]);

    // Create bars for each player and feature at respective gameweek positions
    gameweek_list.forEach((gameweek, i) => {
        const x = xscale(gameweek);

        selected_features.forEach((feature, j) => {
            let xFeature = x + xSubgroupScale(feature);

            Object.entries(scaledData[gameweek][feature]).forEach(([player, value]) => {
                console.log(value);
                let barY = yScale(value);
                let barHeight = timeline_inner_height - barY; // Adjusted bar Y position

                g1.append("rect")
                    .attr("x", xFeature + xSubgroupScale_players(player))
                    .attr("y", barY)
                    .attr("width", xSubgroupScale_players.bandwidth()/1.5)
                    .attr("height", barHeight)
                    .attr("fill", player === player1 ? "blue" : "red"); // Change color based on player
            });
        });
    });

    // Add X and Y axes
    g1.append("g")
        .attr("transform", "translate(0," + timeline_inner_height + ")")
        .call(d3.axisBottom(xscale));

    g1.append("g")
        .call(d3.axisLeft(yScale));
};

// Fetch csv files
d3.csv('../data/individual_gw.csv')
    .then(data => {
        data.forEach(ele => {
            // Convert string values to numbers if needed
            Object.keys(ele).forEach(key => {
                if (!isNaN(ele[key])) {
                    ele[key] = +ele[key];
                }
            });
        });
        // call the setup_timeline_plot function
        setup_timeline_Plot(data);
    });