function initDropdown(data) {
  var subcategories = data.reduce(function(acc, item) {
    item.subcategories.forEach(function(s) {
      if (acc.indexOf(s.name) == -1) {
        acc.push(s.name);
      }
    })
    return acc;
  }, [])

  console.log(subcategories);
}

function initBarChart(data) {
  // Dropdown function - invokes update
  var select = document.getElementById('lineChartDropdown');
  select.addEventListener("change", function() {
      updateData(select.value);
  })

  // Dimensions of canvas/graph
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 650 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  var svg = d3.select("#bar-chart-wrapper")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.2);
  var y = d3.scaleLinear().rangeRound([height - 10, 0]);

  // Set domain for x and y variables
  x.domain(["2013", "2014", "2015", "2016", "2017"]);
  y.domain(d3.extent(data, function(d) {return d.total;}));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(3).tickFormat(d3.format("d")))
      .select(".domain");

  g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(5))
      .select(".domain")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", "0.71em")
      .text('hello, world');

  var bar = g.selectAll("rect")
      .data(data);

   bar.enter()
       .append("rect")
       .attr("x", function(d) { return x(d.year) })
       .attr("y", function(d) { return y(d.total) })
       .attr("width", x.bandwidth())
       .attr("height", function(d) { return height - y(d.total) })
       .attr("fill", "red");

  function updateData(val) {
      // change domain of y axis
      y.domain(d3.extent(data, function (d) {
          if (val == '0')
              return d.total;
          return d.subcategories[0].departments[val - 1].total;
      }));
      // update y axis
      svg.select('.y-axis')
        .transition()
        .duration(400)
        .ease(d3.easePolyInOut)
        .call(d3.axisLeft(y).ticks(5));
      // modify rect height
      svg.selectAll('rect')
        .transition()
        .duration(400)
        .ease(d3.easePolyInOut)
        .attr('y', function(d) {
            if (val == '0')
              return y(d.total);
            return y(d.subcategories[0].departments[val - 1].total);
        })
        .attr('height', function(d) {
            if (val == '0')
              return height - y(d.total);
            return height - y(d.subcategories[0].departments[val - 1].total)
        });
    }
}