// Charger les données CSV
d3.csv('../data/plastic_waste.csv').then(function(data) {
    data = data.filter(d => d.Total_Plastic_Waste_MT !== null && d.Total_Plastic_Waste_MT > 0);

    const continentColor = d3.scaleSequential(d3.interpolateRainbow)
      .domain([0, data.length]);

    const width = 800;
    const height = 800;
    const margin = 1;

    const format = d3.format(",d");

    const pack = d3.pack()
      .size([width - margin * 2, height - margin * 2])
      .padding(3);

    const root = pack(d3.hierarchy({children: data.map((d, i) => ({
      id: d.Country,
      value: +d.Total_Plastic_Waste_MT,
      continent: d.Continent,
      colorIndex: i
    }))})
      .sum(d => d.value));

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height + 50)
      .attr("viewBox", [-margin, -margin, width, height + 50])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

    const node = svg.append("g")
      .selectAll(".node")
      .data(root.leaves())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("title")
      .text(d => `${d.data.id}\n${format(d.value)} tons`);

    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => continentColor(d.data.colorIndex))
      .attr("fill-opacity", 1);

    node.append("text")
      .filter(d => d.r > 15)
      .style("font-size", d => `${Math.max(d.r / 5, 8)}px`)
      .selectAll("tspan")
      .data(d => {
        const maxCharsPerLine = Math.floor((d.r * 1.5) / 10);
        const words = d.data.id.split(/\s+/);
        let lines = [];
        let line = "";

        words.forEach(word => {
          if ((line + " " + word).length <= maxCharsPerLine) {
            line = line ? `${line} ${word}` : word;
          } else {
            lines.push(line);
            line = word;
          }
        });
        if (line) lines.push(line);
        return lines;
      })
      .enter()
      .append("tspan")
      .attr("x", 0)
      .attr("y", (line, i, lines) => `${i - lines.length / 2 + 0.8}em`)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-family", "'Roboto', sans-serif")
      .text(line => line);

    node.append("text")
      .attr("x", 0)
      .attr("y", d => (d.r > 70 ? 45 : 15))
      .style("font-size", d => `${Math.max(d.r / 5, 8)}px`)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("fill", "white")
      .style("font-family", "'Roboto', sans-serif")
      .attr("fill-opacity", 0.7)
      .text(d => (d.r > 15 ? d.value : ""));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("font-family", "'Roboto', sans-serif")
      .style("fill", "white")
      .text("Répartition de la production de déchets plastiques par pays (en tonnes)");

    document.getElementById("bubble").appendChild(svg.node());
});
