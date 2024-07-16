async function getD3Data(url, num) {
    await fetch(url)
        .then((data) => data.json())
        .then((data) => data[num])
        .then((data) => {

            // console.log(data, num);
            // console.log(data.children);

            const width = 1000;
            const height = 700;

            // Create the color scale.
            const color = d3.scaleOrdinal(
                d3.quantize(d3.interpolateRainbow, data.children.length + 1)
            );

            // Compute the layout.
            const hierarchy = d3
                .hierarchy(data)
                .sum((d) => d.value)
                .sort((a, b) => b.height - a.height || b.value - a.value);

            // console.log(hierarchy);

            const root = d3
                .partition() // добавляет координаты x1,x2,y1,y2 по size
                .size([height, ((hierarchy.height + 1) * width) / 3]) // меняя число можно делать колонки
                (hierarchy); // эта строка равносильна root = root(hierarchy) если бы у root был бы let вместо const

            // Create the SVG container.
            const warehouse = d3.select(".closeModal");

            const svg = warehouse.append("svg")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

            // console.log(root);
            console.log(root.descendants());

            // Append cells.
            const cell = svg
                .selectAll("g")
                .data(root.descendants())
                .join("g")
                .attr("transform", (d) => `translate(${d.y0},${d.x0})`);


            const rect = cell
                .append("rect")
                .attr("width", (d) => d.y1 - d.y0 - 1)
                .attr("height", (d) => rectHeight(d))
                .attr("fill-opacity", 0.6)
                .attr("fill", (d) => {
                    if (!d.depth) return "#ccc";
                    while (d.depth > 1) d = d.parent;
                    return color(d.data.name);
                })
                .style("cursor", "pointer")
                .on("click", clicked);

            const text = cell
                .append("text")
                .style("user-select", "none")
                .attr("pointer-events", "none")
                .attr("x", 4)
                .attr("y", 13)
                .attr("fill-opacity", (d) => +labelVisible(d));

            text.append("tspan").text((d) => d.data.name);

            const format = d3.format(",d");
            const tspan = text
                .append("tspan")
                .attr("fill-opacity", (d) => labelVisible(d) * 0.7)
                .text((d) => ` ${format(d.value)}`);

            cell.append("title").text(
                (d) =>
                    `${d
                        .ancestors()
                        .map((d) => d.data.name)
                        .reverse()
                        .join("/")}\n${format(d.value)}
                    `
            );

            // On click, change the focus and transitions it into view.
            let focus = root;
            function clicked(event, p) {
                focus = focus === p ? (p = p.parent) : p;

                root.each((d) => {
                    d.target = {
                        x0: ((d.x0 - p.x0) / (p.x1 - p.x0)) * height,
                        x1: ((d.x1 - p.x0) / (p.x1 - p.x0)) * height,
                        y0: d.y0 - p.y0,
                        y1: d.y1 - p.y0,
                    };
                });

                const t = cell
                    .transition()
                    .duration(750)
                    .attr(
                        "transform",
                        (d) => `translate(${d.target.y0},${d.target.x0})`
                    );

                rect.transition(t).attr("height", (d) => rectHeight(d.target));
                text.transition(t).attr(
                    "fill-opacity",
                    (d) => +labelVisible(d.target)
                );
                tspan
                    .transition(t)
                    .attr("fill-opacity", (d) => labelVisible(d.target) * 0.7);
            }

            function rectHeight(d) {
                return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
            }

            function labelVisible(d) {
                return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
            }
        });
}
