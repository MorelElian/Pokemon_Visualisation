const ctx = {
    w: 433,
    h: 600,
    w_compare : 500,
    h_compare : 800,
    data_loaded : [],
    img_width : 150,
    img_height : 150,
    svg_pokemon_1 : [],
    svg_compare : [],
    svg_pokemon_2 : [],
    data_against : [],
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
        'max' : 250},
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
    i_pokemon_2 : 0,
    update : 0,
    x_upset_barplot_against :85,
    y_upset_barplot_against : 250,
    x_upstet_barplot_stats : 125,
    x_upstet_radar : 125,
    group_barplot : 0,
    palette :
        {  'water' : '#6991F0', 'normal' :'#A8AA79', 'grass': '#7AC852',
        'bug' : '#A7B822',
        'psychic' : '#F85887',
        'fire' : '#EF812E',
        'rock' : '#B99F38',
        'electric':'#F6D030',
        'poison' : '#A0429F',
        'ground' :  '#BCA23B',
        'dark' : '#6D5947',
        'fighting' : '#C12F27',
        'ghost' : '#70589A',
        'dragon' : '#6B3EE3',
        'steel' : '#B6B8D0',
        'ice' : '#9AD7D9',
        'fairy' : '#FF65D5',
        'flying' : '#A991F0'}
    
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
            
            
                }
            );
            
};
function updatePokemon()
{
    ctx.update = 1;
    //d3.select('#barplot_against').remove();
    for(let i = 0; i < ctx.data_loaded.length; i++)
            {
                console.log(ctx.data_loaded[i].name);
                if(ctx.data_loaded[i].name == d3.select('#sampleTf').property("value"))
                {
                    ctx.i_pokemon = i;
                    break;
                }
            }
    d3.select('#path_radar1').remove();
    d3.select('#main_caract1').remove();
    d3.select('#gif_pokemon1').remove();
    
    load_img(ctx.data_loaded,ctx.svg_pokemon_1,"1");
    add_radial_chart(ctx.svg_compare,"1");
    load_main_cacact(ctx.svg_pokemon_1,"1")
    update_barplot_against("1");        
    
}
function load_img(data,svg, poke = "1")
{
    if(poke == "2")
    {
        i_poke = ctx.i_pokemon_2;
    }
    else
    {
        i_poke = ctx.i_pokemon;
    }
    svg.append('g').append('image').attr('id','gif_pokemon'+poke).attr('href','/img/gifs/'+ctx.data_loaded[i_poke].name+'.gif').attr('width',ctx.img_width).attr('height',ctx.img_height)
    .attr('preserveAspectRatio','none');
    //img.append('rect').attr('width',700).attr('height',700)
    //.style('background-image', 'url(/img/pokemon_banner_v2.jpg').attr('fill','None');
    
}
function load_main_cacact(svg,poke = "1")
{
    if(poke == "2")
    {
        i_poke = ctx.i_pokemon_2;
    }
    else
    {
        i_poke = ctx.i_pokemon;
    }
    data = ctx.data_loaded[i_poke]

    let main_caract = svg.append('g').attr('id','main_caract'+poke)
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
 ctx.data_against = data_against;
  var x = d3.scaleLinear()
    .domain([0, 4.0])
    .range([ 0, width_barplot]);
  barplot.append("g")
    .attr("transform", "translate(0," + height_barplot + ")")
    .attr('id','x_axis_barplot_against')
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
    .call(d3.axisLeft(y))
    .attr('id','y_axis_barplot_against');

  //Bars
  let bp_test = barplot.selectAll("myRect1")
    .data(data_against);
    bp_test.exit().remove()
    bp_test
    .enter()
    .append("rect").attr('class','rect_against1')
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.title); })
    .attr("height", y.bandwidth() )
    .transition()
    .duration(1000)
    .attr("width", function(d) { return x(d.value); })
    .attr("fill", ctx.palette[ctx.data_loaded[i_poke].type1]);
}
function update_barplot_against(poke)
{ 
    if(poke == "1")
    {
        i_poke = ctx.i_pokemon;
    }
    else{
        i_poke = ctx.i_pokemon_2;
    }
    data_against_1 = create_against(ctx.data_loaded[ctx.i_pokemon])
    data_against_2 = create_against(ctx.data_loaded[ctx.i_pokemon_2])
    data_against = create_against(ctx.data_loaded[i_poke]);
    if(ctx.group_barplot == 0)
    {
        if(poke != "1")
        {   
            d3.select('#y_axis_barplot_against')
            .transition()
            .duration(1000)
            .attr('transform','scale(1 1.5)');

            d3.select('#x_axis_barplot_against')
            .transition()
            .duration(1000)
            .attr("transform", "translate(0," + (1.5 * height_barplot) + ")")
            var x = d3.scaleLinear()
            .domain([0, 4.0])
            .range([ 0, ctx.width_against]);
            var y = d3.scaleBand()
                .range([ 0, 1.5 * height_barplot])
                .domain(data_against_1.map(function(d) { return d.title; }))
                .padding(.1);
            
            d3.select('#barplot_against').selectAll('rect')
            .transition()
            .duration(1000)
            .attr('y',function(d) { return y(d.title) +  y.bandwidth()/6; })
            .attr('height', y.bandwidth()/3);

            d3.select('#barplot_against').selectAll("myRect2")
            .data(data_against_2)
            .enter()
            .append("rect")
            .attr("class","rect_against2")
            .attr("x", x(0) )
            .attr("y", function(d) { return y(d.title) + y.bandwidth()/2; })
            .attr("height", y.bandwidth()/3 )
            .style("fill", ctx.palette[ctx.data_loaded[ctx.i_pokemon_2].type1])
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("width", d => x(d.value));
        }
        else{
            var x = d3.scaleLinear()
                .domain([0, 4.0])
                .range([ 0, ctx.width_against]);
            var y = d3.scaleBand()
                .range([ 0, 1 * height_barplot])
                .domain(data_against_1.map(function(d) { return d.title; }))
                .padding(.1);

            d3.select('#barplot_against').selectAll(".rect_against"+poke)
            .transition()
            .duration(1000)
            .attr("width",0).on("end", function (){d3.select('#barplot_against').selectAll(".rect_against"+poke).remove();
            d3.select('#barplot_against').selectAll("myRect"+poke)
            .data(data_against)
            .enter()
            .append("rect")
            .attr("class","rect_against"+poke)
            .attr("x", x(0) )
            .attr("y", function(d) { return y(d.title);})
            .attr("height", y.bandwidth())
            .style("fill", ctx.palette[ctx.data_loaded[i_poke].type1])
            .transition()
            .duration(1000)
            .attr("width", d => x(d.value));
        });
        }
    }
    else
    {
        var x = d3.scaleLinear()
        .domain([0, 4.0])
        .range([ 0, ctx.width_against]);
        var y = d3.scaleBand()
            .range([ 0, 1.5 * height_barplot])
            .domain(data_against_1.map(function(d) { return d.title; }))
            .padding(.1);

        d3.select('#barplot_against').selectAll(".rect_against"+poke)
        .transition()
        .duration(1000)
        .attr("width",0).on("end", function (){d3.select('#barplot_against').selectAll(".rect_against"+poke).remove();

        
        d3.select('#barplot_against').selectAll("myRect"+poke)
        .data(data_against)
        .enter()
        .append("rect")
        .attr("class","rect_against"+poke)
        .attr("x", x(0) )
        .attr("y", function(d) { 
            if(poke == "1")
            {
                return y(d.title) + y.bandwidth()/6;
            }
            else{
                return y(d.title) + y.bandwidth()/2;} })
        .attr("height", y.bandwidth()/3 )
        .style("fill", ctx.palette[ctx.data_loaded[i_poke].type1])
        .transition()
        .duration(1000)
        .attr("width", d => x(d.value));
    });

        
    }
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
    hexagon.append('g').attr('id','path_radar1')
    .selectAll('path')
    .data([pokemonBaseStats[ctx.i_pokemon]])
    .enter()
    .append('path') 
    .attr('transform', `translate(${r}, ${r})`)
    .attr('stroke', ctx.palette[ctx.data_loaded[ctx.i_pokemon].type1])
    .attr('stroke-width', 5)
    .attr('fill', ctx.palette[ctx.data_loaded[ctx.i_pokemon].type1])
    .attr('fill-opacity',0.3)
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
function add_radial_chart(svg,n_poke)
{
    if(n_poke == "1")
    {
        i_poke = ctx.i_pokemon;
    }
    else
    {
        i_poke = ctx.i_pokemon_2;
    }
    console.log(i_poke);
    console.log(ctx.data_loaded[i_poke]);
    const r = 100;
    const radialLine = d3.lineRadial();
    const yScale = d3.scaleLinear()
    .range([0, r])
    .domain([0, 255]);
    hexagon = d3.select('g#hexagon');
    hexagon.append('g').attr('id','path_radar'+n_poke)
    .selectAll('path')
    .data([ctx.data_loaded[i_poke]])
    .enter()
    .append('path')
    .attr('transform', `translate(${r}, ${r})`)
    .attr('stroke', ctx.palette[ctx.data_loaded[i_poke].type1])
    .attr('stroke-width', 5)
    .attr('fill', ctx.palette[ctx.data_loaded[i_poke].type1 ])
    .attr('fill-opacity',0.3)
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

}
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
  .attr("id","y_axis_barplot_stats")
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
    .attr("fill", ctx.palette[data.type1])});

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
function change_pokemon()
{
    
    console.log(d3.select('#another_pokemon').node());
    d3.select('#another_pokemon').transition().duration(400).style("opacity",0);
    d3.select('#another_pokemon').transition().delay(400).duration(1).text("Pokemon n°2");
    d3.select('#another_pokemon').transition().delay(400).duration(400).style("opacity",1).on("end", function(){
    pokemon = d3.select('#pokemon_2').property("value");
    for(let i = 0; i < ctx.data_loaded.length; i++)
            {
                if(ctx.data_loaded[i].name == pokemon)
                {
                    console.log(ctx.i_pokemon);
                    ctx.i_pokemon_2 = i;
                    console.log(ctx.i_pokemon);
                    break;
                }
            }
    ctx.svg_pokemon_2.select("image").remove();
    ctx.svg_pokemon_2.select('#main_caract2').remove();
    ctx.svg_compare.select('#path_radar2').remove();
    load_img(data,ctx.svg_pokemon_2,"2");
    load_main_cacact(ctx.svg_pokemon_2,"2");
    add_radial_chart(ctx.svg_pokemon_2,"2");
    update_barplot_against("2");
    ctx.group_barplot = 1;

        });
}
function createViz(){
    console.log("Using D3 v"+d3.version);
    ctx.svg_pokemon_1 = d3.select("#contain-pokedex-1").append("svg");
    ctx.svg_pokemon_1.attr("width", ctx.w);
    ctx.svg_pokemon_1.attr("height", ctx.h);
    ctx.svg_compare = d3.select('#contain-compar-1').append("svg").attr("width",ctx.w_compare).attr("height",ctx.h_compare);
    ctx.svg_pokemon_2 = d3.select('#contain-pokedex-2').append("svg").attr("width",ctx.w).attr("height",ctx.h);
    loadData(ctx.svg_pokemon_1);
};