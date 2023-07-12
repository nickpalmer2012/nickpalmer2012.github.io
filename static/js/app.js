// Set up constant for JSON data url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Set up initial function to set up dropdown menu options and
// show default plot when page is opened
function init() {
    // Set up dropdown menu options
    let dropdownMenu = d3.select("#selDataset");

    //  load names list from the api called with the above link
    d3.json(url).then((data) => {

    let namesList = data.names;

    // iterate over names list and add each ID to the dropdown menu variable
    namesList.forEach(name => {
        // select the dropdownMenu variable that was initialized above
        dropdownMenu
        // each string in the "names" object will need to be appended as an <option> element
        .append("option")
        // each string will also need to have its own <value> attribute within the option element
        .attr("value", name)
        // each string will need to be added to the dropdown element,
        // so the user can select different IDs
        .text(name);
    })
  
 // Set up plots and Demographic Info box to show display data for first sample when page opens
 // Bar graph and Bubble Chart
 const firstPlotId = namesList[0];
 chartCreation(firstPlotId);

 //Demographic Info Box
 demographics(firstPlotId); 
})}

// Create function that creates charts using the data selected in the dropdown menu
function chartCreation(sample) {

    // Pull the array of samples from api using d3 and extract bar chart parameters from query
    d3.json(url).then((data) => {
        let samplesArray = data.samples;

        // Get bar chart parameters from api query of the selected ID from dropdown box

        // Isolate selected sample from samplesArray by filtering by selected sample ID
        let selectedSample = samplesArray.filter(sampleJSON => sampleJSON.id == sample);
        let result = selectedSample[0];

        // Isolate the sample_values from the result to a variable
        let sampleValues = result.sample_values;

        // Isolate otu_ids from the result to a variable
        let otuIds = result.otu_ids;

        // Isolate the otu_labels from the result to a variable
        let otuLabels = result.otu_labels;
        
        // Set up bar chart parameters and plot
        let traceBar = [
            {
                type: 'bar',
                x: sampleValues.slice(0,10).reverse(),
                y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
                text: otuLabels.slice(0,10).reverse(),
                orientation: 'h'
    
            }];
        // Create layout variable for bar chart
        let layoutBar = {
                title: 'Cultures Present in Naval Sample',
                xaxis: {
                    title: 'Sample Values'
                },
                yaxis: {
                    title: 'OTU ID'
                }
            };
         // Plot the bar chart within the "bar" div set up in the index.html file  
         Plotly.newPlot("bar", traceBar, layoutBar);

        // Set up bubble chart parameters for selected sample
        let traceBubble = [
            {
                x: otuIds,
                y: sampleValues,
                mode: 'markers',
                marker: {
                    size: sampleValues,
                    colorscale: 'RdBu',
                    color: otuIds
                },
                text: otuLabels
            }];

        // Create layout variable for bubble chart
        let layoutBubble = {
            title: 'Cultures Present in Naval Sample',
                xaxis: {
                    title: 'OTU ID'
                },
                yaxis: {
                    title: 'Sample Values'
                }
        }
        // Create plot with trace and layout arrays and put the chart in the "bubble" div set up in the index.html file
        Plotly.newPlot("bubble", traceBubble, layoutBubble);

        // Gauge chart variables
        // Get wash frequency from selected sample
        let metadataArray = data.metadata;

        // Isolate selected sample from metadataArray by filtering by selected sample ID
        let selectedSampleWash = metadataArray.filter(sampleJSON => sampleJSON.id == sample);
        let resultWash = selectedSampleWash[0];
        // Set wash frequency variable for selected sample
        let washFreq = resultWash.wfreq;

        // Set up gauge chart trace
        let traceGauge = [
            {
                domain: {x: [0,1], y: [0,1]},
                type: "indicator",
                title: {text: 'Belly Button Scrub Frequency Per Week'},
                mode: "gauge+number",
                value: washFreq,
                gauge: {
                    axis: {range: [null, 9]},
                    bgcolor: "white",
                    steps: [{range: [0, 1],color: 'ffffcc'},
                    {range: [1, 2], color: 'e8ffb5'},
                    {range: [2, 3], color: 'd9ffa6'},
                    {range: [3, 4], color: 'c9ff96'},
                    {range: [4, 5], color: 'baff87'},
                    {range: [5, 6], color: 'abff78'},
                    {range: [6, 7], color: '9cff69'},
                    {range: [7, 8], color: '8cff59'},
                    {range: [8, 9], color: '7dff4a'}],
                }
        }];

        // Create gauge within "gauge" division in index file
        Plotly.newPlot("gauge", traceGauge);

    })

}

// Create function that updates the demographic data in the "Demographic Info" box set up in the index file
function demographics(sample) {
    // Pull the array of samples from api using d3 and extract demographic info
    d3.json(url).then((data) => {
        let metadataArray = data.metadata;

        // Isolate selected sample from metadataArray by filtering by selected sample ID
        let selectedSample = metadataArray.filter(sampleJSON => sampleJSON.id == sample);
        let result = selectedSample[0];

        // fetch demographic box element using d3 library
        let demoBox = d3.select('#sample-metadata');

        //Clear any text that is in the box already
        demoBox.html("");

        // Slice the results object to individual key:value pairs
        let slicedResult = Object.entries(result); 

        // Push sample demographics to the demographics box
        // Loop through the sliced result and append the items to the demographic info box
        slicedResult.forEach(keyValue => {
            demoBox.append("h6")
            .text(`${keyValue[0]} : ${keyValue[1]}`);
        })
       
    })
}

// Create function that calls the above functions based on the sample selected in dropdown menu
function optionChanged(updatedSample) {
    chartCreation(updatedSample);
    demographics(updatedSample);
}

// Execute entire "init" function on page load
init();

