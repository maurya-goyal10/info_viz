el_svg = document.querySelector('svg');

var svg_width = getComputedStyle(el_svg).getPropertyValue('width');
svg_width = +svg_width.slice(0,svg_width.length-2);
var svg_height = getComputedStyle(el_svg).getPropertyValue('height');
svg_height = +svg_height.slice(0,svg_height.length-2);


var svg = d3.select("svg");

const render = data => {
    const yVal = d => d['goals_scored'];
    const xVal = d => d['expected_goals'];
    const margin = {top: 50, left: 250, right: 20, bottom: 70};
    const inner_width = svg_width - margin.left - margin.right;
    const inner_height = svg_height - margin.top - margin.bottom;

    var g1 = svg.append('g')
        .attr('transform',`translate(${margin.left},${margin.top})`);

    var xscale = d3.scaleLinear()
        .domain([0,d3.max(data,xVal)])
        .range([0,inner_width]);

    var yscale = d3.scaleLinear()
        .domain([0,d3.max(data,yVal)])
        .range([inner_height,0]);

    g1.append('g').call(d3.axisLeft(yscale))
    g1.append('g').call(d3.axisBottom(xscale))
        .attr('transform',`translate(0,${inner_height})`)

    g1.selectAll('dot').data(data)
    .enter().append('circle')
        .attr('cx',d => xscale(xVal(d)))
        .attr('cy',d => yscale(yVal(d)))
        .attr('r',2.5);
    }

// const render = data => {
//     const yVal = d =>  d.country;
//     const xVal = d => d['2023_last_updated'];
//     const margin = {top: 50, left: 250, right: 20, bottom: 70};
//     const inner_width = svg_width - margin.left - margin.right;
//     const inner_height = svg_height - margin.top - margin.bottom;

//     var g1 = svg.append('g')
//         .attr('transform',`translate(${margin.left},${margin.top})`);

//     const xscale = d3.scaleLinear()
//         .domain([0,d3.max(data,d => d['2023_last_updated'])])
//         .range([0,inner_width])

//     const yscale = d3.scaleBand()
//         .domain(data.map(d => d.country))
//         .range([0,inner_height])
//         .padding(0.3)

//     const xAxisTickFormat = d3.axisBottom(xscale)
//         .tickFormat(number => d3.format(".2s")(number).replaceAll("G","B"))
//         .tickSize(-inner_height)

//     g1.append('g')
//         .call(d3.axisLeft(yscale))
//         .selectAll('.domain, .tick line').remove();

//     const xAxis = g1.append('g').call(xAxisTickFormat)
//         .attr('transform',`translate(0,${inner_height})`) // to bring down
    
//     xAxis.selectAll('.domain').remove();
//     xAxis.append('text')
//         .attr('x',inner_width/2)
//         .attr('y',50)
//         .attr('fill','black')
//         .text("Population"); 

//     g1.selectAll('rect').data(data)
//     .enter().append('rect')
//         .attr('y',d => yscale(yVal(d)))
//         .attr('width',d => xscale(xVal(d)))
//         .attr('height',yscale.bandwidth());

//     g1.append('text')
//         .attr('y',-10)
//         .text("Top 10 Most Popular Countries");
// }

d3.csv('/data/players.csv')
.then(data => {
    data.forEach(ele => {
        // ele['2023_last_updated'] = +ele['2023_last_updated']
        //     .replaceAll(",","");
        // Object.keys(ele).forEach(e => {
        //     if (!(e == 'iso_code' || e == 'country' 
        //         || e =='2023_last_updated')){
        //         delete ele[e];
        //     }
        // })
        
        ele['id'] = +ele['id']
        ele['now_cost'] = +ele['now_cost']
        ele['expected_goals_conceded'] = +ele['expected_goals_conceded']
        ele['minutes'] = +ele['minutes']
        ele['points_per_game'] = +ele['points_per_game']
        ele['starts'] = +ele['starts']
        ele['form'] = +ele['form']
        ele['expected_goal_involvements'] = +ele['expected_goal_involvements']
        ele['assists'] = +ele['assists']
        ele['goals_conceded'] = +ele['goals_conceded']
        ele['bonus'] = +ele['bonus']
        ele['influence_rank'] = +ele['influence_rank']
        ele['expected_goals'] = +ele['expected_goals']
        ele['chance_of_playing_next_round'] = +ele['chance_of_playing_next_round']
        ele['goals_scored'] = +ele['goals_scored']
        ele['ict_index'] = +ele['ict_index']
        ele['influence'] = +ele['influence']
        ele['threat'] = +ele['threat']
        ele['clean_sheets'] = +ele['clean_sheets']
        ele['total_points'] = +ele['total_points']
        ele['saves'] = +ele['saves']
        ele['bps'] = +ele['bps']
        ele['expected_assists'] = +ele['expected_assists']
        ele['red_cards'] = +ele['red_cards']
        ele['creativity'] = +ele['creativity']
        console.log(ele['expected_goals'])

        // name,position,team,web_name,news,status,news_added
        // expected_goals_conceded_per_90,value_season,ep_next,chance_of_playing_this_round,form_rank,saves_per_90,expected_assists_per_90,
        // influence_rank,creativity_rank,penalties_missed,event_points,penalties_order,value_form,transfers_in,in_dreamteam,now_cost_rank,
        // ep_this,selected_rank,ict_index_rank,transfers_in_event,transfers_out_event,cost_change_start_fall,transfers_out,
        // expected_goals_per_90,creativity_rank_type,now_cost_rank_type,penalties_saved,threat_rank,clean_sheets_per_90,
        // dreamteam_count,starts_per_90,cost_change_event_fall,form_rank_type,
        // cost_change_event,expected_goal_involvements_per_90,goals_conceded_per_90,
        // ict_index_rank_type,points_per_game_rank,direct_freekicks_order,cost_change_start
        // threat_rank_type,influence_rank_type


    });
    render(data);
    // render(data.slice(0,9));
})