import { graphqlRequest } from "./api.js";
import { logout } from "./logout.js";
import {
    drawAuditChart,
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
    // Get the best skills from the list of skills
    const bestSkills = getBestSkills(skills);

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
    
 // Total XP
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
    
    // Current Level
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
    document.getElementById("skills-chart").innerHTML = "";
    drawAuditChart(auditRatio);
    drawSkillsChart(bestSkills);
}

document.getElementById("logout-btn").addEventListener("click", logout);

// Function to format the XP value into a more readable format
function formatXP(xp) {
    if (xp >= 1000000) {
        return (xp / 1000000).toFixed(0) + " MB";
    }

    if (xp >= 1000) {
        return (xp / 1000).toFixed(0) + " kB";
    }

    return xp.toFixed(0) + " B";
}

// Function to get the best skills from the list of skills
function getBestSkills(skills) {
    const best = {};
    skills.forEach(skill => {
      // Check if the skill type is not already in the best object or if the current skill amount is greater than the existing one
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