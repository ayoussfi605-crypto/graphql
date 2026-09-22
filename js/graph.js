// Audit ratio graph
export function drawAuditChart(studentInfo) {

    const svg = document.getElementById("audit-chart");

    if (!svg) return;

    // Get total UP and make sure it is a number
    const totalUp = studentInfo.totalUp ;
    
    const totalDown = studentInfo.totalDown ;

    const ratio = studentInfo.auditRatio ;

    // Add UP and DOWN to get the total audits
    const total = totalUp + totalDown;


    // Calculate the UP percentage
    // Example: 80 / 100 = 0.8 = 80%
    const upPercentage = totalUp / total;


    // Set the SVG size
    const svgSize = 200;

    // Find the center of the SVG
    // 200 / 2 = 100
    const centerPoint = svgSize / 2;

    const radius = 70;

    // Calculate the full length of the circle
    // Formula: 2 × PI × radius
    const circleCircumference = 2 * Math.PI * radius;

    // Calculate how much of the circle is used for UP
    // Example: 80% × circle length
    const upDashLength = upPercentage * circleCircumference;

    svg.innerHTML = "";

    // Set the SVG coordinate system
    // It goes from 0 to 200 on X and Y
    svg.setAttribute("viewBox", `0 0 ${svgSize} ${svgSize}`);

    // Add a label for accessibility
    // Example: "Audit ratio 4.0"
    svg.setAttribute("aria-label", `Audit ratio ${ratio.toFixed(1)}`);


    // Create the background circle
    const background = `
        <circle
            cx="${centerPoint}"
            cy="${centerPoint}"
            r="${radius}"
            fill="none"
            stroke="#D10056"
            stroke-width="18"
        />
    `;


    // Create the UP progress circle
    const progress = `
        <circle
            cx="${centerPoint}"
            cy="${centerPoint}"
            r="${radius}"
            fill="none"
            stroke="#FFFC8C"
            stroke-width="18"
            // Show only the UP part of the circle
            stroke-dasharray="${upDashLength} ${circleCircumference}"

            // Start the progress from the top
            transform="rotate(-90 ${centerPoint} ${centerPoint})"
        />
    `;


    // Create the text inside the circle
    const label = `
        <text
            x="${centerPoint}"
            y="${centerPoint + 10}"
            fill="#E1DCC9"
            font-size="36"
            font-weight="700"
            text-anchor="middle"
        >
            ${ratio.toFixed(1)}
        </text>
    `;

    svg.innerHTML += background;
    svg.innerHTML += progress;
    svg.innerHTML += label;
}

// Skills graph
export function drawSkillsChart(bestSkills) {
    const svg = document.getElementById("skills-chart");

    if (!svg) return;


    // Convert the skills object into an array
    // Example: [["skill_go", 80], ["skill_js", 70]]
    const entries = Object.entries(bestSkills);

    // Count the total number of skills
    const totalSkills = entries.length;

    // Calculate the SVG height
    // Each skill needs 40px of height
    const svgHeight = totalSkills * 40;


    // Set the SVG coordinate system
    svg.setAttribute("viewBox", `0 0 500 ${svgHeight}`);

    svg.innerHTML = "";

    // Store all SVG elements before adding them to the SVG
    let svgContent = "";

    // Create a row for each skill
    entries.forEach(([name, value], index) => {

        // Calculate the vertical position of the skill
        const yPosition = index * 40;

        // Calculate the width of the progress bar
        // Example: 80% of 350 = 280px
        const barWidth = (value / 100) * 350;

        // Remove "skill_" from the skill name
        // Example: "skill_go" becomes "go"
        const cleanName = name.replace("skill_", "");


        // Add the skill name
        svgContent += `
            <!-- Skill Name -->
            <text x="0" y="${yPosition + 15}" fill="#cccbc7" font-size="16px">
                ${cleanName}
            </text>

            <!-- Background Bar -->
            <rect x="100" y="${yPosition}" width="350" height="22" fill="#22201f" rx="5" />

            <!-- Value Progress Bar -->
            <rect x="100" y="${yPosition}" width="${barWidth}" height="22" fill="#e7d59e" rx="5" />

            <!-- Percentage Text -->
            <text x="460" y="${yPosition + 16}" fill="#e7d59e" font-size="13px" font-weight="bold" text-anchor="start">
                ${value}%
            </text>
        `;
    });

    svg.innerHTML = svgContent;
}