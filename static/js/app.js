// Get the samples.json endpoint
const url = "http://127.0.0.1:5000/api/v1.0/school_data";
// Fetch the JSON data within init function with d3.json within .then 
init = () => {d3.json(url).then((data) => {
    // console.log('data: ', data);

    //use danfo library to make dataframe
    df = new dfd.DataFrame(data);    
    // console.log('df: ', df);
    //   df.print()

    // Define states to populate drop down bar
    let states = df["States_Territories"].unique().$data.sort();

    // Use d3. to define state to select for every row
    for (let state in states)
        {d3.select("#selDataset").append("option").property("value", states[state]).text(states[state])};
    
    //Initially assign Minnesota as the selection
    graphs(data, "Minnesota")//sent to graphs on load
    //To assign new selected state value to the graphs function
    optionChanged = state =>{
      graphs(data, state);
    };

});

}

//Start Graphs function 
function graphs(data, state){

d3.select("#selDataset").property("value", state) ;//loads state sent on load to dropdown
let Sfilter=   data.filter(ds => ds.States_Territories == (state))[0];
// console.log('Sfilter: ', Sfilter);

// Define dictionary and ensure the values returned are greater than 0
dict = Object.fromEntries(Object.entries(Sfilter).sort(([,a],[,b]) => a-b).filter(([k,v])=>v>0));


d3.select("#sample-metadata").html('');//clear data from panel before optionchanged
//.entries in javascript is like .items in python
for (let item in dict)

    {d3.select("#sample-metadata").append("h6").text(`${item}: ${dict[item]}`);};//populate demographics panel body appending h6 row for every value
  
  //Console.log to explore referencing keys and values for graphs
    // console.log('dict: ', dict);
    // console.log('dict: ', Object.values(dict));
    // console.log('dict.keys: ', Object.keys(dict));

  //Define columns to be used in bar graph and reference their dictionary
    let bar = [{
          x: ["Total Students Virtual", "Total Students Not Virtual", "Total Students Supp. Virtual", "Total Virtual with Face to Face",
          "PreK-5th Virtual", "PreK-5th Not Virtual", "PreK-5th Supp. Virtual", "PreK-5th Virtual with Face to Face",
          "6th-8th Virtual", "6th-8th Not Virtual", "6th-8th Supp. Virtual", "6th-8th Virtual with Face to Face",
          "9th-13th Virtual", "9th-13th Not Virtual", "9th-13th Supp. Virtual", "9th-13th Virtual with Face to Face"],
          y: [dict.TS_FullVirtual_Sum, dict.TS_NotVirtual_Sum, dict.TS_SupplementalVirtual_Sum, dict.TS_VirtualFFOptions_Sum,
            dict.PK_FullVirtual_Sum, dict.PK_NotVirtual_Sum, dict.PK_SupplementalVirtual_Sum, dict.PK_VirtualFFOptions_Sum,
            dict.MS_FullVirtual_Sum, dict.MS_NotVirtual_Sum, dict.MS_SupplementalVirtual_Sum, dict.MS_VirtualFFOptions_Sum,
            dict.HS_FullVirtual_Sum, dict.HS_NotVirtual_Sum, dict.HS_SupplementalVirtual_Sum, dict.HS_VirtualFFOptions_Sum],
  //Define graph type        
        type: 'bar',  
        }];
  //Define layout - "automargin: true" to expand x axis labels      
        let layout = {
          autosize: false,
          width: 500,
          height: 500,
          xaxis: {
            automargin: true,
          }}; 
    //Plot bar graph

      Plotly.newPlot('bar', bar, layout);
    //Define columns to be used in pie chart and reference their dictionary
      let pie = [{
        values: [dict.TS_FullVirtual_Sum, dict.TS_NotVirtual_Sum, dict.TS_VirtualFFOptions_Sum, dict.TS_SupplementalVirtual_Sum],
        labels: ["Total Students Virtual", "Total Students Not Virtual", "Total Students Virtual with Face to Face options", "Total Students Supplemental Virtual"],
        type: 'pie'
      }];
      

    //Plot pie chart  
      Plotly.newPlot('pie', pie);



      
}
// console.log('statesData: ', statesData);


const map = L.map("map", {
  center: [
    33, -100
  ],
  zoom: 4,
  maxBounds: [[-20.499550, -172.276413], //Southwest
              [73.162102, -52.233040]  //Northeast
],
  layers: [L.tileLayer.provider('Esri.WorldStreetMap')]
});

function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
      weight: 5,
      color: 'yellow',
      dashArray: '',
      fillOpacity: .02
  });

  layer.bringToFront();
  info.update(layer.feature.properties);
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

  function resetHighlight(e) {
    geogson.resetStyle(e.target);
}
let info = L.control()
info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};
//borrowed from https://leafletjs.com/examples/choropleth/example.html
info.update = function (props) {
  const contents = props ? `<b>${props.name}</b><br />${props.Learning_Platform_Majority} ` : 'Hover over a state';
  this._div.innerHTML = `<h4>US Learning Platforms</h4>${contents}`;
};

info.addTo(map);
    

geogson = L.geoJson(statesData, {
  onEachFeature: function(feature, layer) {
  // console.log('feature: ', feature.properties);
  // layer.bindPopup(`<h6>State Name:  ${feature.properties.name}<br/> ${feature.properties.Learning_Platform_Majority} </h6> `);
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
});},

style: {
  
  color: "green",
  fillOpacity: 0,
  
}
 
}).addTo(map);

d3.json("http://127.0.0.1:5000/api/v1.0/more_data").then((data) => {
  // console.log(data);
  features = data.features
  console.log('data.features: ', data.features[0].properties);
  let markers = L.markerClusterGroup();
  for (let i in features) {

    // Set the features geometry property to a variable.
    let geometry = features[i].geometry;
    // Check for the geometry property.
    if (geometry) {
   

      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([geometry.coordinates[1], geometry.coordinates[0]])
        .bindPopup(`<h6>${Object.entries(features[i].properties).map(e => '<br>'+e.join(':  ')).join('')} </h6>`));
    }
  }
  map.addLayer(markers);
});
init();


