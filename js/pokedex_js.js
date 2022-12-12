const ctx = {
    w: 1300,
    h: 600,
    w_compare : 500,
    h_compare : 600,
    data_loaded : [],
    img_width : 150,
    img_height : 150,
    svg_compare : [],
    svg_pokemon_2 : [],
    main_caracts : [
        {'title' : 'Name',
         'correspondance' : 'name',
        'type' : 'text'},
        {'title' : 'Japanese Name',
         'correspondance' : 'japanese_name',
        'type' : 'text'},
        {'title' : 'Abilities',
         'correspondance' : 'abilities',
        'type' : 'text'},
        {'title' : 'Primary Type',
         'correspondance' : 'type1',
        'type' : 'text'},
        {'title' : 'Secondary Type',
         'correspondance' : 'type2',
        'type' : 'text'},
        {'title' : 'Classification',
         'correspondance' : 'classfication',
        'type' : 'text'},
        {'title' : 'Legendary',
         'correspondance' : 'is_legendary',
        'type' : 'text'},
        {'title' : 'Generation',
         'correspondance' : 'generation',
        'type' : 'text'},
        {'title' : 'Capture Rate',
         'correspondance' : 'capture_rate',
        'type' : 'progress_bar',
        'x_upset' : 100,
        'min' : 0,
        'max' : 100},
        {'title' : 'Experience growth',
         'correspondance' : 'experience_growth',
        'type' : 'progress_bar',
        'x_upset' : 140,
        'min' : 600000,
        'max' : 1640000},
        {'title' : 'Base Happiness',
         'correspondance' : 'base_happiness',
        'type' : 'progress_bar',
        'x_upset' : 125,
        'min' : 0,
        'max' : 140}
        ],
    width_progress_bar : 100,
    height_progress_bar : 15,
    width_main_caracts : 370,
    height_against : 300,
    width_against : 300,
    width_barplot_stats : 200,
    height_barplot_stats : 200,
    i_pokemon : 0,
    update : 0,
    x_upset_barplot_against :85,
    y_upset_barplot_against : 250,
    x_upstet_barplot_stats : 125,
    x_upstet_radar : 125
    
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
      
    } while (currentDate - date < milliseconds);
  }
function loadData(){
    var pokemons = d3.csv("/data/pokemon.csv").then(
        function(data)
        {
            console.log(data);
            console.log(d3.select('#sampleTf').property("value"))
            for(let i = 0; i < data.length; i++)
            {
                console.log(data[i].name);
                if(data[i].name == d3.select('#sampleTf').property("value"))
                {
                    ctx.i_pokemon = i;
                    console.log(data[i]);
                    break;
                }
            }
            ctx.data_loaded = data;
            const svg = d3.select('svg')
            load_img(data,svg);
            load_main_cacact(svg);
            create_hexagon_chart(data,ctx.svg_compare);
            create_barplot_against(ctx.svg_compare);
            load_img(data,ctx.svg_pokemon_2);
            load_main_cacact(ctx.svg_pokemon_2);
            ctx.i_pokemon = 300;
            create_hexagon_chart(data,ctx.svg_compare);
            create_barplot_against(ctx.svg_compare);
            //create_barplot_base_stats(data,svg);
            
                }
            );
            
};
function updatePokemon()
{
    ctx.update = 1;
    d3.select('#barplot_against').remove();
    d3.select('#hexagon').remove();
    d3.select('#main_caract').remove();
    d3.select('#gif_pokemon').remove();
    loadData();
}
function load_img(data,svg)
{
    svg.append('g').append('image').attr('id','gif_pokemon').attr('href','/img/gifs/'+ctx.data_loaded[ctx.i_pokemon].name+'.gif').attr('width',ctx.img_width).attr('height',ctx.img_height)
    .attr('preserveAspectRatio','none');
    //img.append('rect').attr('width',700).attr('height',700)
    //.style('background-image', 'url(/img/pokemon_banner_v2.jpg').attr('fill','None');
    
}
function load_main_cacact(svg)
{
    data = ctx.data_loaded[ctx.i_pokemon]

    let main_caract = svg.append('g').attr('id','main_caract')
    .attr('transform','translate(' + ctx.img_width + ',20)');
    for(let i = 0; i < ctx.main_caracts.length; i ++)
    {
        if(ctx.main_caracts[i].type == "text")
        {
        main_caract.append('text').text(ctx.main_caracts[i].title +  ":" +  data[ctx.main_caracts[i].correspondance])
        .attr('transform', 'translate(0, ' +( i * 30 + (2 * (i-1)))+ ")" );
        }
        if(ctx.main_caracts[i].type == "progress_bar")
        {
            main_caract.append('text').text(ctx.main_caracts[i].title + " :")
            .attr('transform', 'translate(0, ' +( i * 30 + (2 * (i-1)))+ ")" )
            main_caract.append('rect')
		    .attr('class', 'bg-rect')
		    .attr('rx', 10)
		    .attr('ry', 10)
		    .attr('fill', 'gray')
		    .attr('height', 15)
		    .attr('width', ctx.width_progress_bar)
            .attr('x',ctx.main_caracts[i].x_upset)
		    .attr('y', i * 30 + (0.5 * (i-1)));
        var extent = ctx.main_caracts[i].max - ctx.main_caracts[i].min
        var color = d3.scaleLinear()
            .domain([ctx.main_caracts[i].min,ctx.main_caracts[i].min + extent /4, ctx.main_caracts[i].min + 1 * extent /2,ctx.main_caracts[i].min + extent * 3 /4,
        ctx.main_caracts[i].max])   
            .range([,"#215A3E",
                "#19955F",
                "#04DC8B",
                "#13E77B",
                "#26F06B"]);
        
        var progress_bar = d3.scaleLinear().domain([ctx.main_caracts[i].min,ctx.main_caracts[i].max]).range([0,ctx.width_progress_bar]);
        var progress = main_caract.append('rect')
            .attr('class', 'progress-rect')
            .attr('fill', 'red')
            .attr('height', 15)
            .attr('width', 0)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('x',ctx.main_caracts[i].x_upset)
            .attr('y', i * 30 + (0.5 * (i-1)));
        
        let capture_rate = main_caract.append('text').text("0").attr('transform', 'translate('+ ctx.main_caracts[i].x_upset + ','+ (i * 30 + (2 * (i-1))) + ')');
            // Animate the progress bar width
        progress.transition()
            .duration(1000)
            .attr('width', function(){
                return progress_bar(data[ctx.main_caracts[i].correspondance]);
                })
            .attr('fill',color(data[ctx.main_caracts[i].correspondance]));
            // Animate the srolling counter
        capture_rate.transition()
            .duration(1000)
            .attr('transform','translate(' + (ctx.main_caracts[i].x_upset + progress_bar(data[ctx.main_caracts[i].correspondance]))  + ',' + ( i * 30 + (2 * (i-1))) + ')')
            .tween("text", () => {
            const interpolator = d3.interpolateNumber(0, data[ctx.main_caracts[i].correspondance]);
            return function(t) {
            d3.select(this).text(Math.round(interpolator(t))) 
            }
      });
    }
    }
    
}
function create_barplot_against(svg)
{
    var margin = {top: 20, right: 0, bottom: 40, left: 0},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    data = ctx.data_loaded[ctx.i_pokemon];
// append the svg object to the body of the page
    width_barplot = ctx.width_against;
    height_barplot = ctx.height_against;
    //svg = d3.select('#contain-compar-1').append("svg").attr("width",500).attr("height",1000);
    var barplot = svg.append('g').attr("id",'barplot_against').attr('transform','translate('+ (ctx.x_upset_barplot_against) + ','+ctx.y_upset_barplot_against+')');
    // Parse the Data

  // Add X axis
  data_against = []
  for(let i = 0; i < Object.keys(data).length;i++)
  {
  
    if(Object.keys(data)[i].match('against_*'))
    {
        data_against.push({
            "title" : Object.keys(data)[i],
            "value" : data[Object.keys(data)[i]]
        })
    }
  }
  data_against.sort(function(a,b) {
    return a.value - b.value
});
 
  var x = d3.scaleLinear()
    .domain([0, data_against[data_against.length-1].value])
    .range([ 0, width_barplot]);
  barplot.append("g")
    .attr("transform", "translate(0," + height_barplot + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height_barplot ])
    .domain(data_against.map(function(d) { return d.title; }))
    .padding(.1);

  barplot.append("g")
    .call(d3.axisLeft(y));

  //Bars
  let bp_test = barplot.selectAll("myRect")
    .data(data_against);
    bp_test.exit().remove()
    bp_test
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.title); })
    .attr("height", y.bandwidth() )
    .transition()
    .duration(1000)
    .attr("width", function(d) { return x(d.value); })
    .attr("fill", "#69b3a2");
}
function create_hexagon_chart(data,svg)
{
    const r = 100
    var pokemonBaseStats = data;
    const margin = { left: 0, top: 30, right: 0, bottom: 30 };
    // Need to handle the view box carefully, to ensure the plot is centered, surrounded by margins
    
    svg.append('g').attr('id','hexagon').style('opacity',0);
    const hexagon = d3.select('g#hexagon').attr('transform','translate(' + (ctx.x_upstet_radar) + ',20)').attr('viewBox',
    `-${margin.left},
    -${margin.top},
    ${r * 2 + margin.left + margin.right},
    ${r * 2 + margin.bottom + margin.top}`);
    

     const dimensions = ['hp', 'attack', 'sp_attack', 'defense', 'sp_defense', 'speed'];    

// Line generator for radial lines
    const radialLine = d3.lineRadial();

// Radar chart is a circle, the length of each axis is the radius of the circle
// Mapping 0 - 255 to 0 - r
    const yScale = d3.scaleLinear()
    .range([0, r])
    .domain([0, 255]);

// The default tick marks is not ideal, override it with a customized one
    const ticks = [50, 100, 150, 200, 255];
// One axis for each dimension
    dimensions.forEach((dimension, i) => {
// We first build an axis at the origin, enclosed inside an "g" element
// then transform it to the right position and right orientation
    const g = hexagon.append('g')
    .attr('transform', `translate(${r}, ${r}) rotate(${i * 60})`)

// Combining a left oriented axis with a right oriented axis
// to make an axis with tick marks on both side
// Reminded that, these are "g" elements inside the outer "g" element
// and will be transformed to the right position with its parent element
    g.append('g')
    .call(d3.axisLeft(yScale).tickFormat('').tickValues(ticks))
    g.append('g')
    .call(d3.axisRight(yScale).tickFormat('').tickValues(ticks))

    // Add a text label for each axis, put it at the edge
    // Again, this "text" element is inside the outer "g" element,
    // and will be transformed to the right position with its parent element
    g.append('text')
    .text(dimension)
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(0, -${r + 10})`)
});

// Line for the base stats of Snorlax
    hexagon.transition().duration(500).style('opacity','1');
    hexagon.append('g').attr('id','path_radar')
    .selectAll('path')
    .data([pokemonBaseStats[ctx.i_pokemon]])
    .enter()
    .append('path')
    .attr('transform', `translate(${r}, ${r})`)
    .attr('stroke', '#69b3a2')
    .attr('stroke-width', 5)
    .attr('fill', 'rgba(105, 179, 162,0.3)')
    .attr('d', d =>
        radialLine([
        0,0,0,0,0,0,0 // hp again to close the loop
        ].map((v, i) => [Math.PI * 2 * i / 6 /* radian */, yScale(v) /* distance from the origin */])) 
    )
    .transition()
    .delay(500)
    .duration(1000)
    .attr('d', d=> radialLine(
        [d.hp,
            d.attack,
            d.sp_attack,
            d.defense,
            d.sp_defense,
            d.speed,
            d.hp
        ].map((v, i) => [Math.PI * 2 * i / 6 /* radian */, yScale(v) /* distance from the origin */])
    ));
    // Move to the center
    

// Gird lines for references
    hexagon.append('g')
    .selectAll('path')
    .data(ticks)
    .enter()
    .append('path')
    .attr('d', d => radialLine([0,1,2,3,4,5,6].map((v, i) => [Math.PI * 2 * i / 6, yScale(d)])))
    .attr('transform', `translate(${r}, ${r})`)
    .attr('stroke', 'grey')
    .attr('opacity', 0.5)
    .attr('fill', 'none');

};
function create_barplot_base_stats()
{

    svg = ctx.svg_compare;
    data = ctx.data_loaded[ctx.i_pokemon];

   
    width_barplot = ctx.width_barplot_stats;
    height_barplot = ctx.height_barplot_stats;
    var barplot = svg.append('g').attr("id",'barplot_base_stats').attr('transform','translate('+ (ctx.x_upstet_barplot_stats)  +',20)').style('opacity','0');
// Parse the Data
    var data_to_use = [
        {
            "title" : "hp",
            "value" : data.hp
        },
        {
            "title" : "defense",
            "value" : data.defense
        },
        {
            "title" : "sp_defense",
            "value" : data.sp_defense
        },
        {
            "title" : "sp_attack",
            "value" : data.sp_attack
        },
        {
            "title" : "attack",
            "value" : data.attack
        },
        {
            "title" : "speed",
            "value" : data.speed
        }
    ];

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 200])
    .range([ 0, width_barplot]);
  barplot.append("g")
    .attr("transform", "translate(0," + height_barplot + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height_barplot ])
    .domain(["hp","speed","defense","sp_defense","sp_attack","attack"])
    .padding(.1);

  barplot.append("g")
    .call(d3.axisLeft(y));

    barplot.transition().duration(500).delay(500).style('opacity','1').on("end",function(){
  //Bars
    barplot.selectAll("myRect")
    .data(data_to_use)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.title); })
    .attr("height", y.bandwidth() )
    .transition()
    .duration(1000)
    .attr("width", function(d) { return x(d.value); })
    .attr("fill", "#69b3a2")});

    barplot.selectAll("myRect")
    .data(data_to_use)
    .enter()
    .append("text")
    .text(d => d.value)
    .attr("x", d => x(d.value) + 10)
    .attr("y", function(d) {return y(d.title) +17})
    .style("opacity", 0)
    .transition()
    .delay(1500)
    .duration(300)
    .style("opacity","1");

    //barplot.transition().delay(700).duration(500).style('opacity','1');
}
function transition_radar_barplot()
{
    button_change = d3.select('#radar_barplot');
    console.log(button_change.node().value);
    if(button_change.node().value == "See Barplot")
    {
    button_change.attr('value',"See Radar Chart");
    d3.select('g#hexagon').transition().duration(1000).style('opacity',"0").on('end',function(){d3.select('g#hexagon').remove()});
    create_barplot_base_stats();
    }
    else if(button_change.node().value == "See Radar Chart")
    {
        button_change.attr('value',"See Barplot");
        d3.select('g#barplot_base_stats').transition().duration(1000).style('opacity',"0").on('end',function(){d3.select('g#braplot_base_stats').remove();create_hexagon_chart(ctx.data_loaded,ctx.svg_compare); });
        
    }
    
}
function createViz(){
    console.log("Using D3 v"+d3.version);
    var svgEl = d3.select("#contain-pokedex-1").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    ctx.svg_compare = d3.select('#contain-compar-1').append("svg").attr("width",ctx.w_compare).attr("height",ctx.h_compare);
    ctx.svg_pokemon_2 = d3.select('#contain-pokedex-2').append("svg").attr("width",ctx.w).attr("height",ctx.h);
    loadData(svgEl);
};