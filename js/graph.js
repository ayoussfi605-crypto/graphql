
// Audit ration graph
export function drawAuditChart(auditRatio) {
    const svg = document.getElementById("audit-chart");
    if (!svg) return;

    const numericRatio = Number.isFinite(Number(auditRatio)) ? Number(auditRatio) : 0;
    
    const maxRatio = 3.0; 
    const safeRatio = Math.min(Math.max(numericRatio, 0), maxRatio) / maxRatio;

    const size = 260;
    const center = size / 2;
    const radius = 95; 
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - safeRatio);

    svg.innerHTML = "";
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("aria-label", `Audit ratio ${numericRatio.toFixed(1)}`);

    // Background Circle
    // const backgroundCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // backgroundCircle.setAttribute("cx", String(center));
    // backgroundCircle.setAttribute("cy", String(center));
    // backgroundCircle.setAttribute("r", String(radius));
    // backgroundCircle.setAttribute("fill", "none");
    // backgroundCircle.setAttribute("stroke", "#D10056");
    // backgroundCircle.setAttribute("stroke-width", "18"); 
    const backgroundCircle = `
    <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#D10056" stroke-width="18" />
    `

    // Progress Circle
    // const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // progressCircle.setAttribute("cx", String(center));
    // progressCircle.setAttribute("cy", String(center));
    // progressCircle.setAttribute("r", String(radius));
    // progressCircle.setAttribute("fill", "none");
    // progressCircle.setAttribute("stroke", "#FFFC8C");
    // progressCircle.setAttribute("stroke-width", "18");
    // progressCircle.setAttribute("stroke-linecap", "round");
    // progressCircle.setAttribute("stroke-dasharray", `${circumference} ${circumference}`);
    // progressCircle.setAttribute("stroke-dashoffset", String(dashOffset));
    // progressCircle.setAttribute("transform", `rotate(-90 ${center} ${center})`);
    const progressCircle = `
    <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#FFFC8C" stroke-width="18" stroke-linecap="round" 
    stroke-dasharray="${circumference} ${circumference}" stroke-dashoffset="${dashOffset}" transform="rotate(-90 ${center} ${center})" />
    `
    // Center Text 
    // const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    // text.setAttribute("x", String(center));
    // text.setAttribute("y", String(center + 10));
    // text.setAttribute("fill", "#E1DCC9");
    // text.setAttribute("font-size", "36"); 
    // text.setAttribute("font-weight", "700");
    // text.setAttribute("text-anchor", "middle");
    // text.textContent = numericRatio.toFixed(1);
    const text = `
        <text x=${center} y=${center+10} fill="#E1DCC9" font-size="36" font-weight="700" text-anchor="middle">${numericRatio.toFixed(1)}<text/>
    `
    svg.innerHTML += (backgroundCircle);
    svg.innerHTML += (progressCircle);
    svg.innerHTML += (text);
}

// skils graph
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
        bgRect.setAttribute("fill", "#22201f"); 
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