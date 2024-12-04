d3.csv("../data/plastic_waste.csv")
  .then(function (data) {
    const countries = [
      "China",
      "United States of America",
      "India",
      "Japan",
      "Germany",
      "Brasil",
      "Indonesia",
      "France",
      "United Kingdom",
      "Mexico",
      "Russia",
      "Canada"
    ];

    const filteredData = data.filter((d) => countries.includes(d.Country));

    const finalData = filteredData.map((d) => ({
      country: d.Country,
      totalPlasticWaste: +d.Total_Plastic_Waste_MT,
      recyclingRate: +d.Recycling_Rate
    }));

    const width = 1000;
    const height = 600;
    const margin = { top: 70, right: 50, bottom: 180, left: 100 };

    const svg = d3
      .select("#bar")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("style", "font-family: 'Roboto', sans-serif;");

    const x = d3
      .scaleBand()
      .domain(finalData.map((d) => d.country))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(finalData, (d) => d.totalPlasticWaste)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(["totalPlasticWaste", "recyclingRate"])
      .range(["#7dd3fc", "#fcd34d"]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(10))
      .selectAll("text")
      .style("font-size", "14px");

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y)
          .ticks(10)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#ddd");

    function wrapText(text, maxWidth) {
      const words = text.split(" ");
      let lines = [];
      let line = "";

      words.forEach(word => {
        if ((line + " " + word).length <= maxWidth) {
          line = line ? `${line} ${word}` : word;
        } else {
          lines.push(line);
          line = word;
        }
      });

      if (line) lines.push(line);
      return lines;
    }

    svg
      .selectAll(".bar-total")
      .data(finalData)
      .join("rect")
      .attr("class", "bar-total")
      .attr("x", (d) => x(d.country))
      .attr("y", (d) => y(d.totalPlasticWaste))
      .attr("height", (d) => y(0) - y(d.totalPlasticWaste))
      .attr("width", x.bandwidth() / 2)
      .attr("rx", 5)
      .attr("fill", color("totalPlasticWaste"));

    svg
      .selectAll(".bar-recycling")
      .data(finalData)
      .join("rect")
      .attr("class", "bar-recycling")
      .attr("x", (d) => x(d.country) + x.bandwidth() / 2)
      .attr("y", (d) => y((d.recyclingRate / 100) * d.totalPlasticWaste))
      .attr("height", (d) =>
        y(0) - y((d.recyclingRate / 100) * d.totalPlasticWaste)
      )
      .attr("width", x.bandwidth() / 2)
      .attr("rx", 5)
      .attr("fill", color("recyclingRate"));

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 200},${margin.top})`);

    const legendItems = ["Total Plastic Waste", "Recycling Rate"];
    legendItems.forEach((item, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 30})`);

      legendItem
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", color(item));

      legendItem
        .append("text")
        .attr("x", 30)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text(item)
        .style("font-size", "16px");
    });

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .text("Plastic Waste and Recycling Rates by Country");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", margin.left / 3)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .style("font-size", "18px")
      .text("Plastic Waste (MT)");

    // Étiquette axe X
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 3)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Country");

    svg
      .selectAll(".x-axis-label")
      .data(finalData)
      .join("text")
      .attr("class", "x-axis-label")
      .attr("x", (d) => x(d.country) + x.bandwidth() / 2)
      .attr("y", height - margin.bottom + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("dominant-baseline", "middle")
      .style("fill", "#333")
      .each(function (d) {
        const lines = wrapText(d.country, 10);
        const lineHeight = 14;
        lines.forEach((line, i) => {
          d3.select(this)
            .append("tspan")
            .attr("x", x(d.country) + x.bandwidth() / 2)
            .attr("dy", i === 0 ? 0 : lineHeight)
            .text(line);
        });
      });

    svg.selectAll(".tick text").remove();
  })
  .catch(function (error) {
    console.error("Error loading the CSV data: ", error);
  });
