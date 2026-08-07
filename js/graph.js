export function cumulativeXP(transactions) {

    let total = 0;

    return transactions.map(transaction => {

        total += transaction.amount;

        return total;

    });

}


export function calculatePoints(xp) {

    const width = 640;
    const height = 300;

    const offsetX = 40;
    const offsetY = 20;
    const maxXP = Math.max(...xp);

    const point = [];

    xp.forEach((value, index) => {
        const x = offsetX + (index / (xp.length - 1)) * width;

        const y = offsetY + height - (value / maxXP) * height;

        point.push({ x, y });

    });
    console.log(point);

    return point;
}

export function pointsToString(points) {

    return points
        .map(point => `${point.x},${point.y}`)
        .join(" ");

}


export function drawXPGraph(pointsString) {

    const svg = document.getElementById("xp-graph");

    const polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
    );

    polyline.setAttribute("points", pointsString);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#4f46e5");
    polyline.setAttribute("stroke-width", "3");

    svg.appendChild(polyline);

}


export function drawPoints(points) {

    const svg = document.getElementById("xp-graph");

    points.forEach((point, index) => {

        if (
            index === 0 ||
            index === points.length - 1 ||
            index % 10 === 0
        ) {

            const circle = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );

            circle.setAttribute("cx", point.x);
            circle.setAttribute("cy", point.y);
            circle.setAttribute("r", "4");
            circle.setAttribute("fill", "#4f46e5");

            svg.appendChild(circle);
        }
    });

}


export function drawAxes() {

    const svg = document.getElementById("xp-graph");

    // Y Axis
    const yAxis = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    yAxis.setAttribute("x1", 40);
    yAxis.setAttribute("y1", 20);
    yAxis.setAttribute("x2", 40);
    yAxis.setAttribute("y2", 320);

    yAxis.setAttribute("stroke", "#666");
    yAxis.setAttribute("stroke-width", "2");

    svg.appendChild(yAxis);

    // X Axis
    const xAxis = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    xAxis.setAttribute("x1", 40);
    xAxis.setAttribute("y1", 320);
    xAxis.setAttribute("x2", 680);
    xAxis.setAttribute("y2", 320);

    xAxis.setAttribute("stroke", "#666");
    xAxis.setAttribute("stroke-width", "2");

    svg.appendChild(xAxis);
}
