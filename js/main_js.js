const ctx = {
    w: 700,
    h: 500,
    data_loaded : [],
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
        'flying' : '#A991F0'},
    types : ['water','bug','psychic','fire','rock','electric','poison','ground','dark','fighting','ghost','dragon','steel','ice','fairy','flying'],
    width_barplot_generation : 700,
    height_barplot_generation : 400,
    width_treemap : 1000,
    heigth_treemap : 500,
    width_stacked_barplot_types : 700
};
function loadData(){
    var pokemons = d3.csv("/data/pokemon.csv").then(
        function(data)
        {
            console.log(data);
            ctx.data_loaded = data;
            create_barchart_pokemon_distrib();
            create_treemap('1');
            create_treemap('2');
            create_stacked_barplot_types();
        });
            
};
function create_barchart_pokemon_distrib()
{
    data = ctx.data_loaded;
    barplot_container = d3.select("#container_barplot_generation");

    //console.log(barplot_container.property('id'));
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
  // console.log(data_to_use);

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
function create_treemap(type)
{
    data = ctx.data_loaded;
    if(type == "2")
    {
    data = data.filter(d => d.type2 != "");
    }
    primary_types = d3.groups(data,d => d['type'+type]);
    
    treemap_container = d3.select('#treemap_'+type+'_type');
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

    //console.log(primary_types);
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

    //console.log(root.leaves())
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
      .style("fill", d => ctx.palette[d.id]);

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return (d.x0+ d.x1) / 2 - 30})    // +10 to adjust position (more right)
      .attr("y", function(d){ return (d.y0+ d.y1) /2 + 5})    // +20 to adjust position (lower)
      .text(function(d){ return d.data[0] + " : " + d.value})
      .style("font-size", "15px")
      .style("fill", "white")
}
function create_stacked_barplot_types()
{
    data =ctx.data_loaded;
    processed_data =[];
    for(let i = 0; i< data.length;i++)
    {
        processed_data.push(
            {
                'pokemon' : data[i].name,
                'type' : data[i].type1,
                'kind_type' : "Primary Type"
            }
        )
        if(data[i].type2 != "")
        {
            processed_data.push(
                {
                'pokemon' : data[i].name,
                'type' : data[i].type2,
                'kind_type' : "Secondary Type"
                }
            )
        }
    }
    processed_data = d3.flatGroup(processed_data, d => d.type, d=>d.kind_type);
    processed_data.sort(function(a,b) {return b[2].length - a[2].length})
    //console.log(processed_data);
    processed_data.sort(function(a,b){
        //if(a[1] == b[1]) { return b[2].length - a[2].length;}
        //else {
           return a[1].length - b[1].length}
    //}
    );


    console.log(processed_data);
    chart = StackedBarChart(processed_data, {
        x: d => d[2].length,
        y: d => d[0],
        z: d => d[1],
        xLabel: ["Primary Type","Secondary Type"],
        //yDomain: d3.groupSort(processed_data, D => d3.sum(D, d => d[2].length), d => d[0]), // sort y by x
        //zDomain: ctx.types,
        colors: d3.schemeSpectral[ctx.types.length],
        width : ctx.width_stacked_barplot_types
      })
}

function StackedBarChart(data, {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yDomain, // array of y-values
    yRange, // [bottom, top]
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    colors = d3.schemeTableau10, // array of colors
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);
    //console.log(X);
    //console.log(Y);
    //console.log(Z);
    // Compute default y- and z-domains, and unique them.
    if (yDomain === undefined) yDomain = Y;
    if (zDomain === undefined) zDomain = Z;
    yDomain = new d3.InternSet(yDomain);
    zDomain = new d3.InternSet(zDomain);
  
    // Omit any data not present in the y- and z-domains.
    const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));
  
    // If the height is not specified, derive it from the y-domain.
    if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];
  
    // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
    // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique y- and z-value.
    const series = d3.stack()
        .keys(zDomain)
        .value(([, I], z) => X[I.get(z)])
        .order(order)
        .offset(offset)
      (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
      .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
  
    // Compute the default x-domain. Note: diverging stacks can be negative.
    if (xDomain === undefined) xDomain = d3.extent(series.flat(2));
  
    // Construct scales, axes, and formats.
    const xScale = xType(xDomain, xRange);
    const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
  
    // Compute titles.
    if (title === undefined) {
      const formatValue = xScale.tickFormat(100, xFormat);
      title = i => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
    } else {
      const O = d3.map(data, d => d);
      const T = title;
      title = i => T(O[i], i, data);
    }
  
    const svg = d3.select('#stacked_barplot_types').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - marginRight)
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
    //console.log(series);
    const bar = svg.append("g")
      .selectAll("g")
      .data(series)
      .join("g")
        .attr("fill", ([{i}]) => color(Z[i]))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
        .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
        .attr("y", ({i}) => yScale(Y[i]))
        .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
        .attr("height", yScale.bandwidth());
  
    if (title) bar.append("title")
        .text(({i}) => title(i));
  
    svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis);
  
    return Object.assign(svg.node(), {scales: {color}});
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