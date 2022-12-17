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
            .range([ 0, 1.5 * height_barplot])
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