// This file handle all the update for the "against" barplot and the radial chart
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
            .attr("transform", "translate(0," + (1.5 * ctx.height_against) + ")")
            var x = d3.scaleLinear()
            .domain([0, 4.0])
            .range([ 0, ctx.width_against]);
            var y = d3.scaleBand()
                .range([ 0, 1.5 * ctx.height_against])
                .domain(ctx.data_against_first.map(function(d) { return d.title; }))
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
                .range([ 0, 1 * ctx.height_against])
                .domain(ctx.data_against_first.map(function(d) { return d.title; }))
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
            .range([ 0, 1.5 * ctx.height_against])
            .domain(ctx.data_against_first.map(function(d) { return d.title; }))
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
function update_barplot_base_stats(i_pokemon)
{
    svg = ctx.svg_compare;
    data = ctx.data_loaded[ctx.i_pokemon];
    if(ctx.alone == false)
    {
        data_2 = ctx.data_loaded[ctx.i_pokemon_2];
    }
   
    width_barplot = ctx.width_barplot_stats;
    height_barplot = ctx.height_barplot_stats;
    var barplot = d3.select('#barplot_base_stats');
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
    if(ctx.alone == false)
    {
    var data_to_use_2 = [
        {
            "title" : "hp",
            "value" : data_2.hp
        },
        {
            "title" : "defense",
            "value" : data_2.defense
        },
        {
            "title" : "sp_defense",
            "value" : data_2.sp_defense
        },
        {
            "title" : "sp_attack",
            "value" : data_2.sp_attack
        },
        {
            "title" : "attack",
            "value" : data_2.attack
        },
        {
            "title" : "speed",
            "value" : data_2.speed
        }
    ];
    }
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 200])
    .range([ 0, width_barplot]);
  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height_barplot ])
    .domain(["hp","speed","defense","sp_defense","sp_attack","attack"])
    .padding(.1);
    if(i_pokemon == "1")
    {

        barplot.selectAll('.rect_base_stats1').remove();
        barplot.selectAll("myRecta")
        .data(data_to_use)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr('class','rect_base_stats1')
        .attr("y", function(d) { return y(d.title) + y.bandwidth()/2; })
        .attr("height", y.bandwidth()/2 )
        .transition()
        .duration(1000)
        .attr("width", function(d) { return x(d.value); })
        .attr("fill", ctx.palette[data.type1]);

        barplot.selectAll('.text_base_stats1').remove();
        barplot.selectAll("myRecta")
        .data(data_to_use)
        .enter()
        .append("text")
        .text(d => d.value)
        .attr('class','text_base_stats1')
        .attr("x", d => x(d.value) + 10)
        .attr("y", function(d) {return y(d.title) + y.bandwidth()/2 +12})
        .style("opacity", 0)
        .transition()
        .delay(1500)
        .duration(300)
        .style("opacity","1");
    }
    else
    {
        barplot.selectAll('.rect_base_stats2').remove();
        barplot.selectAll("myRect22")
        .data(data_to_use_2)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr('class','rectbase_stats2')
        .attr("y", function(d) { return y(d.title); })
        .attr("height", y.bandwidth()/2 )
        .transition()
        .duration(1000)
        .attr("width", function(d) { return x(d.value); })
        .attr("fill", ctx.palette[data_2.type1]);
    
        barplot.selectAll('.text_base_stats2').remove();
        barplot.selectAll("myRect22")
        .data(data_to_use_2)
        .enter()
        .append("text")
        .attr('class','text_base_stats2')
        .text(d => d.value)
        .attr("x", d => x(d.value) + 10)
        .attr("y", function(d) {return y(d.title) +12})
        .style("opacity", 0)
        .transition()
        .delay(1500)
        .duration(300)
        .style("opacity","1");
    }
}