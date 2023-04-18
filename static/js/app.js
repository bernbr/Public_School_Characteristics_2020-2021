// Get the samples.json endpoint
const url = "http://127.0.0.1:5000/api/v1.0/school_data";
// Fetch the JSON data within init function with d3.json within .then 
init = () => {d3.json(url).then((data) => {
    console.log('data: ', data);

    //use danco library to make dataframe
    df = new dfd.DataFrame(data);    
    console.log('df: ', df);

    let states = df["States/Territories"].unique().$data;

    for (let state in states)
        {d3.select("#selDataset").append("option").property("value", states[state]).text(states[state])};

});

}

init();


