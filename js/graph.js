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

    const maxXP = Math.max(...xp);

    const points = [];

    if (xp.length === 0) return { points, maxXP: 0 };
    if (xp.length === 1) return { points: [{ x: width / 2, y: height / 2 }], maxXP };

    xp.forEach((value, index) => {
        const x = (index / (xp.length - 1)) * width;

        const y = height - ((value / maxXP) * height);

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

    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gridGroup.setAttribute("stroke", "#412D15"); 
    gridGroup.setAttribute("stroke-width", "0.5");  
    gridGroup.setAttribute("opacity", "0.5");

    for(let i = 0; i <= 6; i++) {
        let y = i * (300 / 6);
        let hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hLine.setAttribute("x1", "0"); hLine.setAttribute("y1", y);
        hLine.setAttribute("x2", "610"); hLine.setAttribute("y2", y);
        gridGroup.appendChild(hLine);
        
        let x = i * (610 / 6);
        let vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vLine.setAttribute("x1", x); vLine.setAttribute("y1", "0");
        vLine.setAttribute("x2", x); vLine.setAttribute("y2", "300");
        gridGroup.appendChild(vLine);
    }
    svg.appendChild(gridGroup);


    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "flow-gradient");
    gradient.setAttribute("x1", "0%"); gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%"); gradient.setAttribute("y2", "100%"); 
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#E1DCC9"); 
    stop1.setAttribute("stop-opacity", "0.5"); 
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#1F150C"); 
    stop2.setAttribute("stop-opacity", "0"); 
    
    gradient.appendChild(stop1); 
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    const areaPoints = `0,300 ${pointsString} 610,300`;
    polygon.setAttribute("points", areaPoints);
    polygon.setAttribute("fill", "url(#flow-gradient)");
    svg.appendChild(polygon);


    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", pointsString);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#E1DCC9"); 
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
            circle.setAttribute("r", "3");
            circle.setAttribute("fill", "#000000");
            circle.setAttribute("stroke", "#E1DCC9");  
            circle.setAttribute("stroke-width", "1");

            svg.appendChild(circle);
        }
    });

}


export function drawAxes() {
    const svg = document.getElementById("xp-graph");

    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", "0"); 
    yAxis.setAttribute("y1", "0");
    yAxis.setAttribute("x2", "0");
    yAxis.setAttribute("y2", "300"); 
    yAxis.setAttribute("stroke", "#412D15"); 
    yAxis.setAttribute("stroke-width", "3"); 

    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "0"); 
    xAxis.setAttribute("y1", "300"); 
    xAxis.setAttribute("x2", "610"); 
    xAxis.setAttribute("y2", "300");
    xAxis.setAttribute("stroke", "#412D15");
    xAxis.setAttribute("stroke-width", "3");

    svg.appendChild(yAxis);
    svg.appendChild(xAxis);
}

export function drawYLabels(maxXP) {
    const svg = document.getElementById("xp-graph");
    const height = 300;
    const steps = 6; 

    for (let i = 0; i <= steps; i++) {
        const value = maxXP - (i * (maxXP / steps));
        const y = i * (height / steps);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        text.setAttribute("x", "-15"); 
        text.setAttribute("y", y);
        text.setAttribute("dy", "4"); 
        text.setAttribute("text-anchor", "end"); 
        text.setAttribute("font-size", "12");
        text.setAttribute("fill", "#a39c87"); 

        text.textContent = formatGraphXP(value); 

        svg.appendChild(text);
    }
}

function formatGraphXP(xp) {

    if (xp >= 1000000) {
        return (xp / 1000000).toFixed(0) + " MB";
    }

    if (xp >= 1000) {
        return (xp / 1000).toFixed(0) + " kB";
    }

    return Math.round(xp) + " B";
}


export function drawXLabels(transactions) {
    const svg = document.getElementById("xp-graph");
    const width = 610;
    const height = 300;
    const steps = 6; 

    const minDate = new Date(transactions[0].createdAt).getTime();
    const maxDate = new Date(transactions[transactions.length - 1].createdAt).getTime();
    const timeRange = maxDate - minDate || 1;

    for (let i = 0; i <= steps; i++) {
        const x = i * (width / steps); 
        
        const currentTime = minDate + (i * (timeRange / steps));
        const date = new Date(currentTime);
        const label = date.getDate() + "/" + (date.getMonth() + 1);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        text.setAttribute("x", x);
        text.setAttribute("y", height + 25); 
        text.setAttribute("font-size", "12");
        text.setAttribute("fill", "#a39c87");
        text.setAttribute("text-anchor", "middle");

        text.textContent = label;

        svg.appendChild(text);
    }
}


export function drawSkillsChart(bestSkills) {
    const svg = document.getElementById("skills-chart");
    svg.innerHTML = ""; 

    const totalSkills = Object.keys(bestSkills).length;
    const svgHeight = totalSkills * 40; 
    
    
    svg.setAttribute("viewBox", `0 0 500 ${svgHeight}`);

    
    Object.entries(bestSkills).forEach(([name, value], index) => {
        const yPosition = index * 40; 


        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", "0"); 
        label.setAttribute("y", yPosition + 15); 
        label.setAttribute("fill", "#cccbc7"); 
        label.setAttribute("font-size", "16px");
        label.textContent = name.replace("skill_", "");
        svg.appendChild(label);

        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("x", "100"); 
        bgRect.setAttribute("y", yPosition);
        bgRect.setAttribute("width", "350"); 
        bgRect.setAttribute("height", "22");
        bgRect.setAttribute("fill", "#1F150C"); 
        bgRect.setAttribute("rx", "5");
        svg.appendChild(bgRect);

        const valueRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        valueRect.setAttribute("x", "100");
        valueRect.setAttribute("y", yPosition);
        const barWidth = (value / 100) * 350; 
        valueRect.setAttribute("width", barWidth); 
        valueRect.setAttribute("height", "22");
        valueRect.setAttribute("fill", "#e7d59e"); 
        valueRect.setAttribute("rx", "5");
        svg.appendChild(valueRect);

        const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        percentText.setAttribute("x", "460"); 
        percentText.setAttribute("y", yPosition + 16); 
        percentText.setAttribute("fill", "#e7d59e"); 
        percentText.setAttribute("font-size", "13px");
        percentText.setAttribute("font-weight", "bold");
        percentText.setAttribute("text-anchor", "start"); 
        percentText.textContent = value + "%";
        svg.appendChild(percentText);
    });
}