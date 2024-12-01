d3.csv("../data/plastic_waste.csv")
  .then(function (data) {
    const groupedData = {};

    function normalizeCategory(category) {
      if (
        category.includes("Packaging_Industrial") ||
        category.includes("Industrial_Packaging")
      ) {
        return "Emballage industriel";
      }
      if (
        category.includes("Packaging_Consumer") ||
        category.includes("Consumer_Packaging")
      ) {
        return "Emballage Consommateurs";
      }
      if (
        category.includes("Packaging_Electronics") ||
        category.includes("Electronics_Packaging")
      ) {
        return "Emballage électronique";
      }
      if (category.includes("Consumer_Goods")) {
        return "Biens de consommation";
      }
      if (category.includes("Automotive_Packaging")) {
        return "Emballage automobile";
      }
      if (category.includes("Food_Packaging")) {
        return "Emballage alimentaire";
      }
      if (category.includes("Industrial_Consumer")) {
        return "Consommation industrielle";
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
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

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
        .style("fill", "white")
        .style("font-size", "20px")
        .style("font-family", "Roboto, sans-serif");
    });

    document.getElementById("pie").appendChild(svg.node());
  })
  .catch(function (error) {
    console.error("Error loading the CSV data: ", error);
  });
