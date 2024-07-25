async function rudeConcentration() {
    fetch('../asd.json')
        .then(data => data.json())
        .then(data => data.sklads[0].children[0].children[0].dataPoz)
        .then(data => {
            let newData = data.concentration;

            const width = 1400;
            const height = 800;
            const marginTop = 20;
            const marginRight = 20;
            const marginBottom = 30;
            const marginLeft = 40;

            const range = d3.scaleLinear().domain([10, 11]).range([0, 1]);
            const color = d3.piecewise(d3.interpolateRgb, ["green", "yellow", "orange", "red"]);

            const xAxis = d3.scaleLinear()
                .domain([-10, 10])
                .range([marginLeft, width - marginRight])

            const yAxis = d3.scaleLinear()
                .domain([-10, 10])
                .range([height - marginBottom, marginTop]);

            console.log([d3.min(data.z), d3.max(data.z)]);

            const zAxis = d3.scaleLinear()
                .domain([-10, 11])
                .range([height - marginBottom, marginTop]);

            const rudeModal = d3.select('.rudeConcentration');

            const svg = rudeModal.append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(xAxis));

            // Add the y-axis.
            svg.append("g")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(yAxis));



            svg.selectAll("rect")
                .data(newData)
                .join("rect")
                .attr('x', (d, i) => {
                    return xAxis(data.x[i]);
                })
                .attr('y', (d, i) => yAxis(data.y[i]))
                // .attr('r', 5)
                .attr("width", 50)
                .attr("height", 50)
                .attr('fill', d => color(range(d)));

        })
}