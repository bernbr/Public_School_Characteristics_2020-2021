// Get the samples.json endpoint
const url = "http://127.0.0.1:5000/api/v1.0/school_data";
// Fetch the JSON data within init function with d3.json within .then 
init = () => {d3.json(url).then((data) => {
    console.log('data: ', data.length);

    //use danco library to make dataframe
    df = new dfd.DataFrame(data);    
    console.log('df: ', df);

    let states = df["States_Territories"].unique().$data;

    for (let state in states)
        {d3.select("#selDataset").append("option").property("value", states[state]).text(states[state])};


optionChanged = state =>{
    // visuals(df, state);
    let Sfilter=   data.filter(ds => ds.States_Territories == (state))[0];
console.log('Sfilter: ', Sfilter);
// statesData = new dfd.DataFrame(Sfilter);

// console.log('statesData: ', statesData);
// print(statesData);
dict = Object.fromEntries(Object.entries(Sfilter).filter(([k,v])=>v>0));
// dict = Object.entries(Sfilter)
//.map(e => e.join(': '));
d3.select("#sample-metadata").html('');
//.entries in javascript is like .items in python
for (let item in dict)
    {d3.select(".panel-body").append("h6").text(dict[item])};//populate demographics panel body appending h6 row for every value
    };
});

}

init();


