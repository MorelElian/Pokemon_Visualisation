// Main file for the Pokedex Page - needs pokedex_update and pokedex_initial to work properly
const ctx = {
    w: 433,
    h: 600,
    w_compare : 500,
    h_compare : 800,
    data_loaded : [],
    img_width : 120,
    img_height : 120,
    svg_pokemon_1 : [],
    svg_compare : [],
    svg_pokemon_2 : [],
    data_against_first : [],
    
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
    alone : true,
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
    if(ctx.alone = true)
    {
        d3.select('#barplot_against').transition().duration(1000).style('opacity',0).on("end",function(){d3.select('#barplot_against').remove();
        create_barplot_against(ctx.svg_compare);});
        
        
    }
    else
    {
    update_barplot_against("1");  
    }      
    
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
    ctx.alone = false;
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