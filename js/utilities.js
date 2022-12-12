function create_against(data)
{
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
  return data_against;
}