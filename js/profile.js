import { graphqlRequest } from "./api.js";
import { logout } from "./logout.js";
import {
    cumulativeXP,
    calculatePoints,
    pointsToString,
    drawXPGraph,
    drawPoints,
    drawAxes,
    drawYLabels,
    drawXLabels,
    drawSkillsChart
} from "./graph.js";

export async function renderProfile() {

    const result = await graphqlRequest(`


query fetchMyDashboard {
  student: user {
    id
    login
    firstName
    lastName
    email
    auditRatio
    attrs
    timeline: events(where: {cohorts: {labelName: {_is_null: false}}}) {
      cohorts {
        labelName
      }
    }
  }
  
  skillList: transaction(
    where: {type: {_ilike: "%skill%"}}
    order_by: {amount: desc}
  ) {
    id
    type
    amount
  }
  
  xpProgress: transaction(
    where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
    order_by: {createdAt: asc}
  ) {
    amount
    createdAt
    path
  }
  
  levelAggr: transaction_aggregate(
    where: {type: {_eq: "level"}, event: {object: {name: {_eq: "Module"}}}}
  ) {
    aggregate {
      max {
        amount
      }
    }
  }
  
  xpAggr: transaction_aggregate(
    where: {type: {_eq: "xp"}, event: {object: {name: {_eq: "Module"}}}}
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }
}
  
`);

    const studentInfo = result.data.student[0];
    const firstName = studentInfo.firstName;
    const lastName = studentInfo.lastName;
    const email = studentInfo.email;
    const login = studentInfo.login;
    const avatar = studentInfo.attrs.avatarUrl;
    const auditRatio = studentInfo.auditRatio;
    const addressRegion = studentInfo.attrs.addressRegion;
    const addressStreet = studentInfo.attrs.addressStreet;
    const cin = studentInfo.attrs.cin;
    const cohort = studentInfo.timeline[0].cohorts[0].labelName;
    
    const totalXP = result.data.xpAggr.aggregate.sum.amount;
    const level = result.data.levelAggr.aggregate.max.amount;
    
    const skills = result.data.skillList;
    const bestSkills = getBestSkills(skills);
    
    const transactions = result.data.xpProgress;
    
    document.getElementById("avatar-container").innerHTML = `
        <img src="${avatar}" alt="Profile Picture" class="avatar">
    `;

    document.getElementById("user-info-container").innerHTML = `
        <p class="usrnm">Welcome back, ${login}</p>
        <p>Email: ${email}</p>
        <p>First Name: ${firstName}</p>
        <p>Last Name: ${lastName}</p>
        <p>CIN: ${cin}</p>
        <p>Address (Region): ${addressRegion}</p>
        <p>Address (Street): ${addressStreet}</p>
    `;
// بطاقة Audit Ratio
    document.getElementById("audit-card").innerHTML = `
        <div class="stat-header">
            <div class="icon-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a39c87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
                </svg>
                <h3>Audit Ratio</h3>
            </div>
            <span>${auditRatio.toFixed(1)}</span>
        </div>
    `;
    
    // بطاقة Total XP
    document.getElementById("xp-card").innerHTML = `
        <div class="stat-header">
            <div class="icon-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a39c87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                <h3>Total XP</h3>
            </div>
            <span>${formatXP(totalXP)}</span>
        </div>
    `;
    
    // بطاقة Current Level
    document.getElementById("level-card").innerHTML = `
        <div class="stat-header">
            <div class="icon-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a39c87" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
                <h3>Current Level</h3>
            </div>
            <span>${level}</span>
        </div>
    `;
      
    document.getElementById("cohort").innerHTML = `
    <p>${cohort}</p>
  `;

    const xp = cumulativeXP(transactions);
    
    const graphData = calculatePoints(xp);
    
    const points = graphData.points;
    const maxXP = graphData.maxXP;
    
    const pointsString = pointsToString(points);
    
    document.getElementById("xp-graph").innerHTML = "";
    document.getElementById("skills-chart").innerHTML = "";
    
    drawAxes();
    drawYLabels(maxXP);
    drawXPGraph(pointsString);
    drawPoints(points);
    drawXLabels(transactions);
    drawSkillsChart(bestSkills);
}

document.getElementById("logout-btn").addEventListener("click", logout);


function formatXP(xp) {
    if (xp >= 1000000) {
        return (xp / 1000000).toFixed(0) + " MB";
    }

    if (xp >= 1000) {
        return (xp / 1000).toFixed(0) + " kB";
    }

    return xp.toFixed(0) + " B";
}


function getBestSkills(skills) {
    const best = {};
    skills.forEach(skill => {

        if(
            !best[skill.type] ||
            skill.amount > best[skill.type]
        ){
            best[skill.type] = skill.amount;
        }

    });

    return best;
}

renderProfile();