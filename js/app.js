let urlTopology =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let urlEducation =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let width = 1000,
  height = 600,
  padding = 60;

let topologyData;
let educationalData;

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

let keys = ["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"];
let values = [
  "#dee7c1",
  "#c8d898",
  "#b4c288",
  "#a0ac79",
  "#78815b",
  "#646c4c",
  "#3c402d",
  "#14150f",
];

// Setup legend
let legend = svg.append("g").attr("class", "key").attr("id", "legend");

// Generate legend's rects
legend
  .selectAll("rects")
  .data(keys)
  .enter()
  .append("rect")
  .attr("x", (d, i) => 600 + i * 33)
  .attr("y", 30)
  .attr("width", 33)
  .attr("height", 20)
  .style("fill", (d, i) => values[i]);

// Generate legend's labels
legend
  .selectAll("labels")
  .data(keys)
  .enter()
  .append("text")
  .attr("x", (d, i) => 590 + i * 33)
  .attr("y", 65)
  .text((d) => d)
  .attr("class", "labels");

let drawMap = () => {
  svg
    .selectAll("path")
    .data(topologyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (d) => {
      // Fill maps with different colors depending on value of
      // bachelorsOrHigher
      let id = d.id;
      let county = educationalData.find((d) => d.fips === id);
      let edu = county.bachelorsOrHigher;
      if (edu <= 12) {
        return values[0];
      } else if (edu <= 21) {
        return values[1];
      } else if (edu <= 30) {
        return values[2];
      } else if (edu <= 39) {
        return values[3];
      } else if (edu <= 48) {
        return values[4];
      } else if (edu <= 57) {
        return values[5];
      } else if (edu <= 66) {
        return values[6];
      } else {
        return values[7];
      }
    })
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      let id = d.id;
      return educationalData.find((d) => d.fips === id).bachelorsOrHigher;
    })
    .on("mouseover", (d) => {
      let id = d.id;
      let data = educationalData.find((d) => d.fips === id);
      tooltip
        .html(
          data.area_name +
            ", " +
            data.state +
            ": " +
            data.bachelorsOrHigher +
            "%"
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .style("opacity", 0.9)
        .attr("data-education", data.bachelorsOrHigher);
    })
    .on("mouseout", (d) => {
      tooltip.style("opacity", 0);
    });
};

// Firstly, fetch topology data
d3.json(urlTopology).then((data, error) => {
  if (error) {
  } else {
    // Convert fetched object from topojson to geojson and select only the
    // features array from the fetched object
    topologyData = topojson.feature(data, data.objects.counties).features;

    // Secondly, fetch educational data
    d3.json(urlEducation).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationalData = data;
        drawMap();
      }
    });
  }
});
