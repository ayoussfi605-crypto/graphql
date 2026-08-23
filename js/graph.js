export function cumulativeXP(transactions) {

    let total = 0;

    return transactions.map(transaction => {

        total += transaction.amount;

        return total;

    });

}


export function calculatePoints(xp) {

    const width = 610;
    const height = 300;

    const offsetX = 70;
    const offsetY = 20;
    const maxXP = Math.max(...xp);

    const points = [];

    xp.forEach((value, index) => {
        const x = offsetX + (index / (xp.length - 1)) * width;

        const y = offsetY + height - (value / maxXP) * height;

        points.push({ x, y });

    });

     return {
        points,
        maxXP
    };
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
            circle.setAttribute("fill", "#83e14d");

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

    yAxis.setAttribute("x1", 70);
    yAxis.setAttribute("y1", 20);
    yAxis.setAttribute("x2", 70);
    yAxis.setAttribute("y2", 320);

    yAxis.setAttribute("stroke", "#666");
    yAxis.setAttribute("stroke-width", "2");

    svg.appendChild(yAxis);

    // X Axis
    const xAxis = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    xAxis.setAttribute("x1", 70);
    xAxis.setAttribute("y1", 320);
    xAxis.setAttribute("x2", 680);
    xAxis.setAttribute("y2", 320);

    xAxis.setAttribute("stroke", "#666");
    xAxis.setAttribute("stroke-width", "2");

    svg.appendChild(xAxis);
}

export function drawYLabels(maxXP) {
    const svg = document.getElementById("xp-graph");

    const values = [
        maxXP,
        maxXP * 0.75,
        maxXP * 0.5,
        maxXP * 0.25,
        0
    ];

    values.forEach((value, index) => {

        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        const y = 20 + (index / 4) * 300;

        text.setAttribute("x", 0);
        text.setAttribute("y", y + 5);

        text.setAttribute("font-size", "12");
        text.setAttribute("fill", "#666");

        text.textContent = formatGraphXP(value);

        svg.appendChild(text);
    });
}

function formatGraphXP(xp) {

    if (xp >= 1000000) {
        return (xp / 1000000).toFixed(1) + " MB";
    }

    if (xp >= 1000) {
        return (xp / 1000).toFixed(1) + " kB";
    }

    return Math.round(xp) + " B";
}


export function drawXLabels(transactions) {
    const svg = document.getElementById("xp-graph");

    const width = 610;
    const offsetX = 70;

    const indexes = [
        0,
        Math.floor((transactions.length - 1) * 0.25),
        Math.floor((transactions.length - 1) * 0.50),
        Math.floor((transactions.length - 1) * 0.75),
        transactions.length - 1
    ];

    indexes.forEach(index => {

        const transaction = transactions[index];

        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        const x =
            offsetX +
            (index / (transactions.length - 1)) * width;

        const date = new Date(transaction.createdAt);

        const label =
            date.getDate() +
            "/" +
            (date.getMonth() + 1);

        text.setAttribute("x", x);
        text.setAttribute("y", 345);

        text.setAttribute("font-size", "12");
        text.setAttribute("fill", "#666");
        text.setAttribute("text-anchor", "middle");

        text.textContent = label;

        svg.appendChild(text);
    });
}


export function drawSkillsChart(bestSkills) {
    const container = document.getElementById("skills-chart");

    Object.entries(bestSkills).forEach(([name, value]) => {

        const skill = document.createElement("div");
        skill.classList.add("skill");

        const label = document.createElement("span");
        label.textContent = name.replace("skill_", "");

        const barContainer = document.createElement("div");
        barContainer.classList.add("skill-bar");

        const bar = document.createElement("div");
        bar.classList.add("skill-value");

        bar.style.width = value + "%";

        const number = document.createElement("span");
        number.textContent = value;

        barContainer.appendChild(bar);
        barContainer.appendChild(number);

        skill.appendChild(label);
        skill.appendChild(barContainer);

        container.appendChild(skill);
    });
}