function populateDemoInfo(sample){
  var panel = d3.select('#sample-metadata');
  panel.html('');
  panel.append('p').text('id: ' + sample.id);
  panel.append('p').text('ethnicity: ' + sample.ethnicity);
  panel.append('p').text('gender: ' + sample.gender);
  panel.append('p').text('age: ' + sample.age);
  panel.append('p').text('location: ' + sample.location);
  panel.append('p').text('bbtype: ' + sample.bbtype);
  panel.append('p').text('wfreq: ' + sample.wfreq);
}

function plotGraphs(sample){
  //Bar
  yValues = sample['otu_ids'].slice(0,10).map(value => 'OTU ' + value)
  xValues = sample['sample_values'].slice(0, 10);
  textValues = sample['otu_labels'].slice(0, 10);

  var data = [{
          type: 'bar',
          x: xValues,
          y: yValues,
          text: textValues,
          orientation: 'h'
      }];
  
  var layout = {
      yaxis:{
          categoryorder: 'max ascending'
      }
  }

  Plotly.newPlot('bar', data, layout);

  //Bubble
  var trace = [{
      x: sample['otu_ids'],
      y: sample['sample_values'],
      text:  sample['otu_labels'],
      mode: 'markers',
      marker: {
        size: sample['sample_values'],
        color: sample['otu_ids'],
        colorscale: 'Viridis',
      }
    }];;
    
    Plotly.newPlot('bubble', trace);

}

function optionChanged(id){
  d3.json("samples.json").then(function(data){
      var metaData = data.metadata.filter(item => item.id == id)
      var sample = data.samples.filter(item => item.id ==  id)
      populateDemoInfo(metaData[0])
      plotGraphs(sample[0]);
  });
}

(async function(){
  var data = await d3.json("samples.json");   
  console.log(data); 
  var names = data.names;

  var select = d3.select('#selDataset');    
  select.selectAll('option')
  .data(names)
  .enter().append('option')
  .attr('value', d => { return d; })
  .text(d => { return d; });

  //Calls function against first item in select list. Decided to default first item.
  optionChanged(select.node().value);
  

})()