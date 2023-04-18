// Get the samples.json endpoint
const url = "http://127.0.0.1:5000/api/v1.0/school_data";
// Fetch the JSON data within init function with d3.json within .then 
init = () => {d3.json(url).then((data) => {
    console.log('data: ', data);

    //use danfo library to make dataframe
    df = new dfd.DataFrame(data);    
    console.log('df: ', df.sum(axis=1));
    //   df.print()

    let states = df["States_Territories"].unique().$data.sort();

    for (let state in states)
        {d3.select("#selDataset").append("option").property("value", states[state]).text(states[state])};

    graphs(data, "Minnesota")//sent to graphs on load
optionChanged = state =>{
    graphs(data, state);
    };

});

}

function graphs(data, state){

d3.select("#selDataset").property("value", state) ;//loads state sent on load to dropdown
let Sfilter=   data.filter(ds => ds.States_Territories == (state))[0];
// console.log('Sfilter: ', Sfilter);
statesData = new dfd.DataFrame([Sfilter]).dropNa({ axis: 0}) ;

// console.log('statesData: ', statesData);
// statesData.print();
dict = Object.fromEntries(Object.entries(Sfilter).sort(([,a],[,b]) => a-b).filter(([k,v])=>v>0));

// dict = Object.entries(Sfilter)

d3.select("#sample-metadata").html('');//clear data from panel before optionchanged
//.entries in javascript is like .items in python
for (let item in dict)

    {d3.select(".panel-body").append("h6").text(`${item}: ${dict[item]}`);};//populate demographics panel body appending h6 row for every value
    
    

    console.log('dict: ', dict);
    // console.log('dict: ', Object.values(dict));
    // console.log('dict.keys: ', Object.keys(dict));

    
    let bar = [
        {
          x: Object.keys(dict),
 
          y: Object.values(dict),
          type: 'bar'
        }
      ];
      Plotly.newPlot('bar', bar);

      let pie = [{
        values: Object.values(dict),
        labels: Object.keys(dict),
        type: 'pie'
      }];
      

      
      Plotly.newPlot('pie', pie);

      // statesData.loc({ columns: Object.keys(dict)}).plot("map").bar()

      
}
console.log('statesData: ', statesData);


let map = L.map("map", {
  center: [
    33, -100
  ],
  zoom: 4,
  maxBounds: [[5.499550, -167.276413], //Southwest
              [73.162102, -52.233040]  //Northeast
],
  layers: [L.tileLayer.provider('Esri.WorldStreetMap')]
});

L.geoJson(statesData, {
  onEachFeature: function(feature, layer) {
  // console.log('feature: ', feature.properties);
  layer.bindPopup(`<h6>State Name:  ${feature.properties.name} </h6>`);

}
  
}).addTo(map);

init();


