const ctx = {
    w: 700,
    h: 500,
    data_loaded : [],
    width_barplot_generation : 700,
    height_barplot_generation : 400,
    width_treemap : 1000,
    heigth_treemap : 500
};
function loadData(){
    var pokemons = d3.csv("/data/pokemon.csv").then(
        function(data)
        {
            console.log(data);
            ctx.data_loaded = data;
            create_barchart_pokemon_distrib();
            create_treemap_primary_types();
        });
            
};
function create_barchart_pokemon_distrib()
{
    data = ctx.data_loaded;
    barplot_container = d3.select("#container_barplot_generation");

    console.log(barplot_container.property('id'));
    //data = ctx.data_loaded[ctx.i_pokemon];
    data_grouped =d3.groups(data,d =>d.generation);
   
    width_barplot = ctx.width_barplot_generation;
    height_barplot = ctx.height_barplot_generation;
    var barplot = barplot_container.append("svg").attr("width",ctx.w).attr("height",ctx.h)
    .append('g').attr("id",'barplot_base_stats').attr('transform','translate(70,0)').style('opacity','1');
// Parse the Data
    data_to_use = []
    for(let i = 0;i < data_grouped.length;i++)
    {
        data_to_use.push(
            {
                "title" : "Generation " + data_grouped[i][0],
                "value" : data_grouped[i][1].length
            }
        )
    }
   console.log(data_to_use);

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
    .domain(["Generation 1","Generation 2","Generation 3","Generation 4","Generation 5","Generation 6","Generation 7"])
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
    .attr("y", function(d) {return y(d.title) +27})
    .style("opacity", 0)
    .transition()
    .delay(1500)
    .duration(300)
    .style("opacity","1")
    .style("stroke","white");
}
function create_treemap_primary_types()
{
    data = ctx.data_loaded;
    primary_types = d3.groups(data,d => d.type1);
    treemap_container = d3.select('#treemap_primary_type');
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = ctx.width_treemap - margin.left - margin.right,
    height = ctx.heigth_treemap - margin.top - margin.bottom;
    primary_types.push(
        {
            '0' : "root",
            '1' : []
        }
    );
    primary_types.sort(function(a,b){ return b[1].length - a[1].length})
// append the svg object to the body of the page
    var svg = treemap_container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// Read data

    console.log(primary_types);
  // stratify the data: reformatting for d3.js
  var root = d3.stratify()
    .id(function(d) { return d[0]; })   // Name of the entity (column name is name in csv)
    .parentId(d => d[0] == "root" ? null : "root" )   // Name of the parent (column name is parent in csv)
    (primary_types);
  root.sum(function(d) { return +d[1].length})   // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

    console.log(root.leaves())
  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", "#69b3a2");

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return (d.x0+ d.x1) / 2 - 15})    // +10 to adjust position (more right)
      .attr("y", function(d){ return (d.y0+ d.y1) /2})    // +20 to adjust position (lower)
      .text(function(d){ return d.data[0]})
      .style("font-size", "15px")
      .style("fill", "white")
}
function createViz(){
    console.log("Using D3 v"+d3.version);
   // var svgEl = d3.select("#generation_pokemon").append("svg");
    //svgEl.attr("width", ctx.w);
    //svgEl.attr("height", ctx.h);
    d3.select('#tabulair_caract').style('margin-top',"150px").transition().duration(1000).style('margin-top',"10px");
    d3.select('#global_analysis').style('opacity',0).transition().delay(1000).duration(500).style('opacity',1);
    d3.select('#pokemon_distrib').style('margin-top',"300px").transition().delay(1000).duration(1000).style("margin-top","10px");
    loadData();
};