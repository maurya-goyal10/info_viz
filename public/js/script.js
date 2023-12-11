// Select the SVG element and get its dimensions
const el_svg = document.querySelector('.one');
const svg_width = +getComputedStyle(el_svg).getPropertyValue('width').slice(0, -2);
const svg_height = +getComputedStyle(el_svg).getPropertyValue('height').slice(0, -2);

// Create a D3 selection for the SVG element
const svg = d3.select("svg");

// Default value for selected x-axis and y-axis column
var selected_value_x = 'expected_goals';
var selected_value_y = 'goals_scored';
var selected_value_z = 'now_cost';

// Parameters for the plot
const margin = { top: 50, left: 250, right: 20, bottom: 70 };
const inner_width = svg_width - margin.left - margin.right;
const inner_height = svg_height - margin.top - margin.bottom;

const dropdownMargin = 20; // Margin between x-axis and dropdown
const dropdownWidth = 200; // Width of the dropdown
const dropdownHeight = 30;

// Dropdown position for the one in X axis
const dropdown1X = (inner_width - dropdownWidth) / 2 + dropdownMargin;
const dropdown1Y = inner_height + dropdownMargin + dropdownMargin;

// Dropdown position for the one in Y axis
const dropdown2X = -1 * dropdownWidth - dropdownMargin;
const dropdown2Y = (inner_height - dropdownWidth) / 2 + dropdownMargin;

// Dropdown position for the one in Z axis
const dropdown3X = (inner_width - dropdownWidth) / 2 + dropdownMargin;
const dropdown3Y = -dropdownHeight-10;

var filter_minutes = document.querySelector('.minutes_filter')
var filter_position = document.querySelector('.position_filter')

const colorScale = d3.scaleOrdinal()
        .domain(['FWD','DEF','MID','GKP'])
        .range(['#d7191c','#fdae61','#abdda4','#2b83ba'])

// Tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

// mouse over function depending in the datapoint d
var mouseover = d => {
    d.target.style.stroke = "black";
    tooltip.style("opacity", 1)
    .html(`${d.target.__data__.web_name} <br> 
        (${d.target.__data__.position}) <br>
        ${d.target.__data__.team} <br>
        ${selected_value_x}: ${d.target.__data__[selected_value_x]} <br>
        ${selected_value_y}: ${d.target.__data__[selected_value_y]} <br>
        ${selected_value_z}: ${d.target.__data__[selected_value_z]} <br>`)
    .style("left", (+d.pageX+20) + "px")
    .style("top", (d.pageY) + "px")
};

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = d => {
    d.target.style.stroke = "none";
    tooltip
    .transition()
    .duration(500)
    .style("opacity", 0)};


// Function to set up the initial plot
const setupPlot = (data) => {
    // filtering condition
    filter_minutes.addEventListener('change', (e) => {
        filtered_data = data.filter((f) => {
            return f.minutes > e.target.value;
        })
        updatePlot(filtered_data);
    });

    filter_position.addEventListener('change', (e) => {
        var positions =  Array.from(e.target.options).filter(option => option.selected)
                            .map(option => option.value)
        filtered_data = data.filter((f) => {
            return positions.includes(f.position);
        })
        updatePlot(filtered_data);
    })


    // Create the main plot area
    const g1 = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales for X and Y axes
    const xscale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[selected_value_x])])
                    .range([0, inner_width]);
    const yscale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d[selected_value_y])])
                    .range([inner_height, 0]);
    const zscale = d3.scaleLinear()
                    .domain([d3.min(data, d=>d[selected_value_z]),d3.max(data, d=>d[selected_value_z])])
                    // .range(["#bcdfeb","#0c2026"]);
                    .range([4,12]);

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
        .attr('r',d => zscale(d[selected_value_z]))
        .attr('fill',d => colorScale(d['position']))
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

    const dropdownDivY = dropdownForeignObjectY.append('xhtml:div')
    .style('display', 'inline-block')
    const dropdownSelectY = dropdownDivY.html("Y Axis:&nbsp")
    .append('xhtml:select');

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
    dropdownSelectY.select(`option[value=${selected_value_y}]`).attr('selected',"selected")
   
    dropdownSelectY.style('width', '70%').style('padding', '4px').style('font-size', '14px');

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
        .attr('height', dropdownHeight)

    const dropdownDivX = dropdownForeignObjectX.append('xhtml:div')
    .style('display', 'inline-flex')
    .style('align-items', 'center');
    
    const dropdownSelectX = dropdownDivX.html("X Axis:&nbsp").append('xhtml:select');

    dropdownSelectX.selectAll('option')
    .data(columns)
    .enter()
    .append('xhtml:option')
    .attr('value', d => d)
    .text(d => d);
    
    dropdownSelectX.select(`option[value=${selected_value_x}]`).attr('selected',"selected")

    // Styling for the select element
    dropdownSelectX.style('width', '70%').style('padding', '4px').style('font-size', '14px');

    // Event listener for dropdown change
    dropdownSelectX.on('change', function() {
        selected_value_x = d3.select(this).property('value');
        updatePlot(data);
    });

    // Add dropdown for selecting Z-axis column
    const dropdownForeignObjectZ = g1.append('foreignObject')
        .attr('x', dropdown3X)
        .attr('y', dropdown3Y)
        .attr('width', dropdownWidth)
        .attr('height', dropdownHeight);

    const dropdownDivZ = dropdownForeignObjectZ.append('xhtml:div')
    .style('display', 'inline-flex')
    .style('align-items', 'center');
    const dropdownSelectZ = dropdownDivZ.html("Area:&nbsp").append('xhtml:select');

    dropdownSelectZ.selectAll('option')
        .data(columns)
        .enter()
        .append('xhtml:option')
        .attr('value', d => d)
        .text(d => d);

    dropdownSelectZ.select(`option[value=${selected_value_z}]`).attr('selected',"selected")

    // Styling for the select element
    dropdownSelectZ.style('width', '100%').style('padding', '4px').style('font-size', '14px');

    // Event listener for dropdown change
    dropdownSelectZ.on('change', function() {
        selected_value_z = d3.select(this).property('value');
        updatePlot(data);
    });
};

// Function to update the plot based on new selection
const updatePlot = (data) => {
    data =  data.filter((f) => {
        return f.minutes > filter_minutes.value;
    })
    
    data = data.filter((f) => {
        return Array.from(filter_position.options)
            .filter(option => option.selected)
            .map(option => option.value)
            .includes(f.position)
    })

    ymin = Math.min(0,d3.min(data, d => d[selected_value_y]))

    const yscaleNew = d3.scaleLinear()
                        .domain([ymin,d3.max(data, d => d[selected_value_y])])
                        .range([inner_height, 0]);

    const xscaleNew = d3.scaleLinear()
                     .domain([Math.min(0,d3.min(data, d => d[selected_value_x]))
                        ,d3.max(data, d => d[selected_value_x])])
                     .range([0, inner_width]);

    const zscaleNew = d3.scaleLinear()
                    .domain([d3.min(data, d=>d[selected_value_z]),d3.max(data, d=>d[selected_value_z])])
                    // .range(["#bcdfeb","#0c2026"]);
                    .range([4,12]);


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
        .data(data);

    circles.transition()
        .duration(500)
        .attr('cx', d => xscaleNew(d[selected_value_x]))
        .attr('cy', d => yscaleNew(d[selected_value_y]))
        .attr('r', d => zscaleNew(d[selected_value_z]))
        .attr('fill',d => colorScale(d['position']))

    circles.enter().append('circle')        
    .attr('cx', d => xscaleNew(d[selected_value_x]))
    .attr('cy', d => yscaleNew(d[selected_value_y]))
    .attr('r',d => zscaleNew(d[selected_value_z]))
    .attr('fill',d => colorScale(d['position']))
    // for hover
    .on("mouseover", mouseover )
    .on("mousemove", mouseover )
    .on("mouseleave", mouseleave );
    
    circles.exit().remove()
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



