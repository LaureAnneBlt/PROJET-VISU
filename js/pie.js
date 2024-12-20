d3.csv("../data/plastic_waste.csv")
  .then(function (data) {
    const groupedData = {};

    function normalizeCategory(category) {
      if (
        category.includes("Packaging_Industrial") ||
        category.includes("Industrial_Packaging")
      ) {
        return "Industrial Packaging";
      }
      if (
        category.includes("Packaging_Consumer") ||
        category.includes("Consumer_Packaging")
      ) {
        return "Consumer Packaging";
      }
      if (
        category.includes("Packaging_Electronics") ||
        category.includes("Electronics_Packaging")
      ) {
        return "Electronics Packaging";
      }
      if (category.includes("Consumer_Goods")) {
        return "Consumer Goods";
      }
      if (category.includes("Automotive_Packaging")) {
        return "Automobile Packaging";
      }
      if (category.includes("Food_Packaging")) {
        return "Food Packaging";
      }
      if (category.includes("Industrial_Consumer")) {
        return "Industrial Consumer";
      }
      return category;
    }

    data.forEach((d) => {
      const normalizedCategory = normalizeCategory(d.Main_Sources);
      const value = +d.Total_Plastic_Waste_MT;

      if (groupedData[normalizedCategory]) {
        groupedData[normalizedCategory] += value;
      } else {
        groupedData[normalizedCategory] = value;
      }
    });

    const finalData = Object.keys(groupedData).map((key) => ({
      Main_Sources: key,
      Total_Plastic_Waste_MT: groupedData[key],
    }));

    const width = 900;
    const height = Math.min(width, 500);
    // const height = 600;

    const color = d3
      .scaleOrdinal()
      .domain(finalData.map((d) => d.Main_Sources))
      .range(
        finalData.map((d, i) => d3.interpolateRainbow(i / finalData.length)),
      );

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.Total_Plastic_Waste_MT);

    const arc = d3
      .arc()
      .innerRadius(Math.min(width, height) / 3.5)
      .outerRadius(Math.min(width, height) / 2 - 1);

    const labelRadius = arc.outerRadius()() * 1.2;

    const arcs = pie(finalData);

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 3.5, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")


    const path = svg
      .append("g")
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("fill", (d) => color(d.data.Main_Sources))
      .attr("d", arc);

    // Ajouter une légende
    const legend = svg.append("g").attr("transform", "translate(300,-130)");

    finalData.forEach((d, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 40})`);

      legendItem
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(d.Main_Sources));

      legendItem
        .append("text")
        .attr("x", 25)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(d.Main_Sources)
        .style("fill", "#7dd3fc")
        .style("font-size", "24px")
        .style("font-family", "Roboto, sans-serif");
    });

    // svg.append("text")
    //   .attr("x", width/5)
    //   .attr("y", height/2)
    //   .attr("text-anchor", "middle")
    //   .style("font-size", "26px")
    //   .style("font-family", "'Roboto', sans-serif")
    //   .style("font-weight", "bold")
    //   .style("fill", "red")
    //   .text("Distribution of plastic waste production by country (in tonnes)");

    document.getElementById("pie").appendChild(svg.node());
  })
  .catch(function (error) {
    console.error("Error loading the CSV data: ", error);
  });
