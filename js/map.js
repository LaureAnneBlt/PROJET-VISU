d3.csv("../data/plastic_waste.csv").then(function (plasticData) {
  d3.json("../content/countries-50m.json").then(function (world) {
    const countries = topojson.feature(world, world.objects.countries);

    const plasticWasteMap = new Map(
      plasticData
        .filter((d) => !isNaN(+d.Total_Plastic_Waste_MT))
        .map((d) => [d.Country, +d.Total_Plastic_Waste_MT]),
    );

    const width = 1400;
    const marginTop = 46;
    const height = width / 2 + marginTop;

    const projection = d3.geoEqualEarth().fitExtent(
      [
        [2, marginTop + 2],
        [width - 2, height],
      ],
      { type: "Sphere" },
    );
    const path = d3.geoPath(projection);

    const customColors = ["#f0f9ff", "#7dd3fc"];

    const color = d3
      .scaleSequential()
      .domain(d3.extent(Array.from(plasticWasteMap.values())))
      .range(customColors);

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const legendWidth = 260;
    const legendHeight = 20;

    const legendGroup = svg.append("g").attr("transform", "translate(20,0)");

    legendGroup
      .append("text")
      .attr("x", legendWidth / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text("Total Plastic Waste (MT)");

    legendGroup
      .append("defs")
      .append("linearGradient")
      .attr("id", "color-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data(
        color.ticks(5).map((d, i, arr) => ({
          offset: `${(i / (arr.length - 1)) * 100}%`,
          color: color(d),
        })),
      )
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    const legendScale = d3
      .scaleLinear()
      .domain(d3.extent(Array.from(plasticWasteMap.values())))
      .range([0, legendWidth]);

    const ticks = legendScale.ticks(5);
    const tickGroup = legendGroup
      .append("g")
      .attr("transform", `translate(0, ${legendHeight})`);

    legendGroup
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#color-gradient)");

    svg
      .append("g")
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("fill", (d) => {
        const countryName = d.properties.name;
        return plasticWasteMap.has(countryName)
          ? color(plasticWasteMap.get(countryName))
          : "#ccc";
      })
      .attr("d", path)
      .append("title")
      .text((d) => {
        const countryName = d.properties.name;
        const wasteAmount = plasticWasteMap.get(countryName);
        return wasteAmount
          ? `${countryName}\n${wasteAmount} MT`
          : `${countryName}\nNo data`;
      });

    const countrymesh = topojson.mesh(
      world,
      world.objects.countries,
      (a, b) => a !== b,
    );
    svg
      .append("path")
      .datum(countrymesh)
      .attr("fill", "none")
      .attr("stroke", "#7dd3fc")
      .attr("d", path);

    tickGroup
      .selectAll("line")
      .data(ticks)
      .enter()
      .append("line")
      .attr("x1", (d) => legendScale(d))
      .attr("x2", (d) => legendScale(d))
      .attr("y1", 0)
      .attr("y2", 5)
      .attr("stroke", "black");

    tickGroup
      .selectAll("text")
      .data(ticks)
      .enter()
      .append("text")
      .attr("x", (d) => legendScale(d))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .text((d) => d3.format(".2s")(d));

    document.getElementById("chart").appendChild(svg.node());
  });
});
