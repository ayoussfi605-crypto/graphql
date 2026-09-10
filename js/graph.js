export function cumulativeXP(transactions) {

    let total = 0;

    return transactions.map(transaction => {

        total += transaction.amount;

        return total;

    });

}


export function calculatePoints(xp) {
    // العرض والطول الوهمي ديال viewBox
    const width = 610;
    const height = 300;

    // حيدنا offsetX و offsetY باش الرسم يشد المساحة كاملة

    // كنقلبو على أعلى نقطة باش نحددو الارتفاع
    const maxXP = Math.max(...xp);

    const points = [];

    // حماية باش ما يوقعش خطأ إذا كان المصفوفة خاوية أو فيها عنصر واحد
    if (xp.length === 0) return { points, maxXP: 0 };
    if (xp.length === 1) return { points: [{ x: width / 2, y: height / 2 }], maxXP };

    xp.forEach((value, index) => {
        // X كيبدا من 0 وكيسالي فـ 610 (أقصى اليمين)
        const x = (index / (xp.length - 1)) * width;

        // Y كيبدا من التحت (300) وكيطلع على حساب النسبة ديال XP
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

    // ==========================================
    // 1. رسم الشبكة الخلفية (Grid / الكارويات)
    // ==========================================
    const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gridGroup.setAttribute("stroke", "#412D15"); // اللون البني الداكن ديالك
    gridGroup.setAttribute("stroke-width", "0.5"); // خط رقيق
    gridGroup.setAttribute("opacity", "0.5"); // شفاف شوية باش مايبرزطش العين

    // رسم 6 خطوط أفقية وعمودية
    for(let i = 0; i <= 6; i++) {
        // خطوط أفقية
        let y = i * (300 / 6);
        let hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hLine.setAttribute("x1", "0"); hLine.setAttribute("y1", y);
        hLine.setAttribute("x2", "610"); hLine.setAttribute("y2", y);
        gridGroup.appendChild(hLine);
        
        // خطوط عمودية
        let x = i * (610 / 6);
        let vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vLine.setAttribute("x1", x); vLine.setAttribute("y1", "0");
        vLine.setAttribute("x2", x); vLine.setAttribute("y2", "300");
        gridGroup.appendChild(vLine);
    }
    svg.appendChild(gridGroup);


    // ==========================================
    // 2. رسم الظل المتدفق (Flow / Gradient Area)
    // ==========================================
    
    // أ) تعريف التدرج اللوني (Gradient)
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "flow-gradient");
    gradient.setAttribute("x1", "0%"); gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%"); gradient.setAttribute("y2", "100%"); // التدرج غادي من الفوق لتحت
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#E1DCC9"); // اللون الكريمي
    stop1.setAttribute("stop-opacity", "0.5"); // شفافية خفيفة الفوق
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#1F150C"); // كيذوب في لون الخلفية البني
    stop2.setAttribute("stop-opacity", "0"); // شفاف كلياً لتحت
    
    gradient.appendChild(stop1); 
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // ب) رسم المساحة المعبأة (Polygon)
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    // كنزيدو نقطة في الأسفل يسار (0,300) ونقطة في الأسفل يمين (610,300) باش نسدو الشكل تحت الخط
    const areaPoints = `0,300 ${pointsString} 610,300`;
    polygon.setAttribute("points", areaPoints);
    polygon.setAttribute("fill", "url(#flow-gradient)");
    svg.appendChild(polygon);


    // ==========================================
    // 3. رسم الخط الرئيسي (Main Line)
    // ==========================================
    // الخط كيتكتب هو اللخر باش يجي باين الفوق وميغطيهش الظل
    const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polyline.setAttribute("points", pointsString);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#E1DCC9"); // اللون الكريمي الفخم
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
            circle.setAttribute("fill", "#1F150C");
            circle.setAttribute("stroke", "#E1DCC9");  
            circle.setAttribute("stroke-width", "2");

            svg.appendChild(circle);
        }
    });

}


export function drawAxes() {
    const svg = document.getElementById("xp-graph");

    // 1. محور Y (الخط العمودي ديال L - على اليسار)
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", "0"); // لاصق فاقصى اليسار
    yAxis.setAttribute("y1", "0");
    yAxis.setAttribute("x2", "0");
    yAxis.setAttribute("y2", "300"); // هابط تال القاع
    yAxis.setAttribute("stroke", "#412D15"); // لون الإطار
    yAxis.setAttribute("stroke-width", "3"); // غلضناه شوية باش يبرز على الكارويات

    // 2. محور X (الخط الأفقي ديال L - لتحت)
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", "0"); // بادي من القنت ديال اليسار
    xAxis.setAttribute("y1", "300"); // لاصق فالقاع
    xAxis.setAttribute("x2", "610"); // غادي تال اللخر ديال الكارويات فاليمن
    xAxis.setAttribute("y2", "300");
    xAxis.setAttribute("stroke", "#412D15");
    xAxis.setAttribute("stroke-width", "3");

    svg.appendChild(yAxis);
    svg.appendChild(xAxis);
}

export function drawYLabels(maxXP) {
    const svg = document.getElementById("xp-graph");
    const height = 300;
    const steps = 6; // 6 أقسام باش يجيو لاصقين مع الكارويات

    for (let i = 0; i <= steps; i++) {
        const value = maxXP - (i * (maxXP / steps));
        const y = i * (height / steps);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        text.setAttribute("x", "-15"); // كنبعدوه شوية على اليسار باش ما يدخلش فالكارو
        text.setAttribute("y", y);
        text.setAttribute("dy", "4"); // توسيط خفيف مع الخط
        text.setAttribute("text-anchor", "end"); // باش الأرقام يتقادو من جهة اليمين
        text.setAttribute("font-size", "12");
        text.setAttribute("fill", "#a39c87"); // اللون اللي اختاريتي

        text.textContent = formatGraphXP(value); // الدالة ديالك بقات كيما هي

        svg.appendChild(text);
    }
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
    const height = 300;
    const steps = 6; // 6 أقسام للتواريخ

    // كنجبدو أول وأخر تاريخ باش نوزعوهم بالتساوي
    const minDate = new Date(transactions[0].createdAt).getTime();
    const maxDate = new Date(transactions[transactions.length - 1].createdAt).getTime();
    const timeRange = maxDate - minDate || 1;

    for (let i = 0; i <= steps; i++) {
        // حيدنا offsetX باش يبدا من 0 ويسالي فـ 610
        const x = i * (width / steps); 
        
        const currentTime = minDate + (i * (timeRange / steps));
        const date = new Date(currentTime);
        const label = date.getDate() + "/" + (date.getMonth() + 1);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        text.setAttribute("x", x);
        text.setAttribute("y", height + 25); // هبطناه تحت الكارويات
        text.setAttribute("font-size", "12");
        text.setAttribute("fill", "#a39c87");
        text.setAttribute("text-anchor", "middle");

        text.textContent = label;

        svg.appendChild(text);
    }
}


export function drawSkillsChart(bestSkills) {
    const container = document.getElementById("skills-chart");
    container.innerHTML = ""; // كنمسحو أي حاجة قديمة باش مايتعاودش الرسم

    // 1. كنكرييو عنصر SVG (ضروري نخدمو بـ createElementNS مع الرابط ديال SVG)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    // 2. كنعطيو أبعاد وهمية للرسم باش يجي Responsive
    // العرض 500، والطول غنحسبوه على حساب شحال من مهارة عندنا (مثلاً 400)
    svg.setAttribute("viewBox", "0 0 500 400");
    svg.style.width = "100%";

    // ===> هنا غادي يجي الكود ديال الحلقة (Loop) باش نرسمو الأعمدة <===
    Object.entries(bestSkills).forEach(([name, value], index) => {
        
    });
    // 3. كنلوحو الـ SVG كامل وسط الـ div ديالنا في HTML
    container.appendChild(svg);
}