let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;


let svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



d3.csv("data/data.csv").then(function(data) {

    
    data.forEach(data => {
      data.state = +data.state;
      data.poverty = +data.poverty;
    }
    )
    

    let xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(data, data => data.state)])
      .range([0, width]);

    let yLinearScale = d3.scaleLinear()
      .domain([20, d3.max(data, data => data.poverty)])
      .range([height, 0]);



    let xAxis = d3.axisBottom(xLinearScale);
    let yAxis = d3.axisLeft(yLinearScale); 




    chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append('g')
    .call(yAxis);
   
    let circlesGroup = chartGroup.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', data => xLinearScale(data.state))
      .attr('cy', data => yLinearScale(data.poverty))
      .attr('r', '15')
      .attr('fill', 'pink')
      .attr('opacity', '.9');






   

    let toolTip = d3.tip()
      .attr('class', 'toolTip')
      .offset([80, -60])
      .html(function(data){
        return `${data.rockband}<br />Hair Length: ${data.state} <br /> Hits: ${data.poverty}`;
      });









    chartGroup.call(toolTip);




   

    circlesGroup.on('click', function(data){
      toolTip.show(data, this);
    }

    )

      .on('mouseout', function(data){
        toolTip.hide(data);
      });


   
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("State");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty");
  }).catch(function(error) {
    console.log(error);
  });