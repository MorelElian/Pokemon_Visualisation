const ctx = {
    w: 500,
    h: 200,
};
function loadData(){
    var pokemons = d3.csv("/data/pokemon.csv").then(
        function(data)
        {
            console.log(data);
            create_barchar_nb_poke(data);
        });
            
};

function createViz(){
    console.log("Using D3 v"+d3.version);
   // var svgEl = d3.select("#generation_pokemon").append("svg");
    //svgEl.attr("width", ctx.w);
    //svgEl.attr("height", ctx.h);
    
    loadData(svgEl);
};