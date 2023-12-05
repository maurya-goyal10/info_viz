// Select the SVG element and get its dimensions
const el_svg = document.querySelector('svg');
const svg_width = +getComputedStyle(el_svg).getPropertyValue('width').slice(0, -2);
const svg_height = +getComputedStyle(el_svg).getPropertyValue('height').slice(0, -2);

// Create a D3 selection for the SVG element
const svg = d3.select("svg");

// Default value for selected x-axis and y-axis column
let selected_value_x = 'expected_goals';
let selected_value_y = 'goals_scored'

// Parameters for the plot
const margin = { top: 50, left: 250, right: 20, bottom: 70 };
const inner_width = svg_width - margin.left - margin.right;
const inner_height = svg_height - margin.top - margin.bottom;

const dropdownMargin = 20; // Margin between x-axis and dropdown
const dropdownWidth = 150; // Width of the dropdown
const dropdownHeight = 30;

// Dropdown position for the one in X axis
const dropdown1X = (inner_width - dropdownWidth) / 2 + dropdownMargin;
const dropdown1Y = inner_height + dropdownMargin + dropdownMargin;

// Dropdown position for the one in Y axis
const dropdown2X = -1 * dropdownWidth - dropdownMargin;
const dropdown2Y = (inner_height - dropdownWidth) / 2 + dropdownMargin;

// Tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

// mouse over function depending in the datapoint d
var mouseover = d => {
    tooltip.style("opacity", 1)
    .html(`${d.target.__data__.name} <br> 
        (${d.target.__data__.position}) <br>
        ${d.target.__data__.team}`)
    .style("left", (+d.pageX+20) + "px")
    .style("top", (d.pageY) + "px")
};

var mousemove = d => {
    // tooltip
    // .html(`${d.target.__data__.name} <br> 
    //     (${d.target.__data__.position}) <br>
    //     ${d.target.__data__.team}`)
    // .style("left", (+d.pageX+20) + "px")
    // .style("top", (d.pageY) + "px")
};

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = d => {
    tooltip
    .transition()
    .duration(1000)
    .style("opacity", 0)};


// Function to set up the initial plot
const setupPlot = (data) => {
    // Create the main plot area
    const g1 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales for X and Y axes
    const xscale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[selected_value_x])])
                    .range([0, inner_width]);
    const yscale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[selected_value_y])])
                    .range([inner_height, 0]);

    // Axis
    const xAxis = d3.axisBottom(xscale)
        .tickSize(-inner_height)

    const yAxis = d3.axisLeft(yscale)
        .tickSize(-inner_width)

    g1.append('g').attr('class', 'y-axis')
                  .call(yAxis);

    g1.append('g').attr('class', 'x-axis')
                .call(xAxis)
                .attr('transform', `translate(0,${inner_height})`);

    // Plot circles for data points
    var circles = g1.selectAll('dot')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => xscale(d[selected_value_x]))
        .attr('cy', d => yscale(d[selected_value_y]))
        .attr('r', 5)
        // for hover
        .on("mouseover", mouseover )
        .on("mousemove", mouseover )
        .on("mouseleave", mouseleave );

    // Add dropdown for selecting Y-axis column
    const dropdownForeignObjectY = g1.append('foreignObject')
        .attr('x', dropdown2X)
        .attr('y', dropdown2Y)
        .attr('width', dropdownWidth)
        .attr('height', dropdownHeight);

    const dropdownDivY = dropdownForeignObjectY.append('xhtml:div').style('display', 'inline-block');
    const dropdownSelectY = dropdownDivY.append('xhtml:select');

    // Get all available columns from the CSV data
    // make them the columns we need
    const columns = Object.keys(data[0]);

    dropdownSelectY.selectAll('option')
        .data(columns)
        .enter()
        .append('xhtml:option')
        .attr('value', d => d)
        .text(d => d);

    // Styling for the select element
    dropdownSelectY.style('width', '100%').style('padding', '4px').style('font-size', '14px');

    // Event listener for dropdown change
    dropdownSelectY.on('change', function() {
        selected_value_y = d3.select(this).property('value');
        updatePlot(data);

    });

    // Add dropdown for selecting X-axis column
    const dropdownForeignObjectX = g1.append('foreignObject')
        .attr('x', dropdown1X)
        .attr('y', dropdown1Y)
        .attr('width', dropdownWidth)
        .attr('height', dropdownHeight);

    const dropdownDivX = dropdownForeignObjectX.append('xhtml:div').style('display', 'inline-block');
    const dropdownSelectX = dropdownDivX.append('xhtml:select');


    dropdownSelectX.selectAll('option')
        .data(columns)
        .enter()
        .append('xhtml:option')
        .attr('value', d => d)
        .text(d => d);

    // Styling for the select element
    dropdownSelectX.style('width', '100%').style('padding', '4px').style('font-size', '14px');

    // Event listener for dropdown change
    dropdownSelectX.on('change', function() {
        selected_value_x = d3.select(this).property('value');
        updatePlot(data);
    });
};

// Function to update the plot based on new selection
const updatePlot = (data) => {

    ymin = Math.min(0,d3.min(data, d => d[selected_value_y]))

    const yscaleNew = d3.scaleLinear()
                        .domain([ymin,d3.max(data, d => d[selected_value_y])])
                        .range([inner_height, 0]);

    const xscaleNew = d3.scaleLinear()
                     .domain([Math.min(0,d3.min(data, d => d[selected_value_x]))
                        ,d3.max(data, d => d[selected_value_x])])
                     .range([0, inner_width]);

    const g1 = svg.select('g');

    // the axis
    const xAxis = d3.axisBottom(xscaleNew)
        .tickSize(-inner_height)

    const yAxis = d3.axisLeft(yscaleNew)
        .tickSize(-inner_width)
        
    g1.select('.x-axis')
        .transition()
        .call(xAxis)
        .duration(500)

    g1.select('.y-axis')
        .transition()
        .call(yAxis)
        .duration(500)          
        
    // Update circles
    var circles = g1.selectAll('circle')
        .data(data)
        .transition()
        .duration(500)
        .attr('cx', d => xscaleNew(d[selected_value_x]))
        .attr('cy', d => yscaleNew(d[selected_value_y]));
};

// Fetch CSV data and set up the initial plot
d3.csv('../data/players.csv')
    .then(data => {
        data.forEach(ele => {
            // Convert string values to numbers if needed
            Object.keys(ele).forEach(key => {
                if (!isNaN(ele[key])) {
                    ele[key] = +ele[key];
                }
            });
        });
        setupPlot(data); // Set up initial plot
    });
