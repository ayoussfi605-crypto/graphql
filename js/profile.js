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


    const studentInfo = result?.data?.student?.[0];
    const totalXP = result?.data?.xpAggr?.aggregate?.sum?.amount ?? 0;
    const timeline = studentInfo?.timeline || [];
    if(totalXP === null || studentInfo.timeline.length === 0 ){
      emptydata(studentInfo.login)
      return
    }

    const firstName = studentInfo.firstName;
    const lastName = studentInfo.lastName;
    const email = studentInfo.email;
    const login = studentInfo.login;
    const avatar = studentInfo.attrs.avatarUrl;
    const auditRatio = studentInfo.auditRatio;
    const addressRegion = studentInfo.attrs.addressRegion;
    const addressStreet = studentInfo.attrs.addressStreet;
    const cin = studentInfo.attrs.cin;
    const cohort = studentInfo?.timeline?.[0]?.cohorts?.[0]?.labelName ?? "N/A";
    const level = result?.data?.levelAggr?.aggregate?.max?.amount ?? 0;
    const skills = result?.data?.skillList || [];

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
};

function emptydata(username){
    
        document.getElementById("profile-section").innerHTML = `
            <div class="dashboard" style="width: 80%; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; padding-top: 20px;">
                <header class="header">
                    <div class="logo"><svg width="24" height="24" viewBox="0 0 24 24" fill="#a39c87" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.051 2.751l4.935 2.85c.816-.859 2.173-.893 3.032-.077.148.14.274.301.377.477.589 1.028.232 2.339-.796 2.928-.174.1-.361.175-.558.223v5.699c1.146.273 1.854 1.423 1.58 2.569-.048.204-.127.4-.232.581-.592 1.023-1.901 1.374-2.927.782-.196-.113-.375-.259-.526-.429l-4.905 2.832c.372 1.124-.238 2.335-1.361 2.706-.217.071-.442.108-.67.108-1.181.001-2.139-.955-2.14-2.136 0-.205.029-.41.088-.609l-4.936-2.847c-.816.854-2.171.887-3.026.07-.854-.816-.886-2.171-.07-3.026.283-.297.646-.506 1.044-.603l.001-5.699c-1.15-.276-1.858-1.433-1.581-2.584.047-.198.123-.389.224-.566.592-1.024 1.902-1.374 2.927-.782.177.101.339.228.48.377l4.938-2.85C9.613 1.612 10.26.423 11.39.088 11.587.029 11.794 0 12 0c1.181-.001 2.139.954 2.14 2.134.001.209-.03.418-.089.617zm-.515.877c-.019.021-.037.039-.058.058l6.461 11.19c.026-.009.056-.016.082-.023V9.146c-1.145-.283-1.842-1.442-1.558-2.588.006-.024.012-.049.019-.072l-4.946-2.858zm-3.015.059l-.06-.06-4.946 2.852c.327 1.135-.327 2.318-1.461 2.645-.026.008-.051.014-.076.021v5.708l.084.023 6.461-11.19-.002.001zm2.076.507c-.39.112-.803.112-1.192 0l-6.46 11.189c.294.283.502.645.6 1.041h12.911c.097-.398.307-.761.603-1.044L12.597 4.194zm.986 16.227l4.913-2.838c-.015-.047-.027-.094-.038-.142H5.542l-.021.083 4.939 2.852c.388-.404.934-.653 1.54-.653.627 0 1.19.269 1.583.698z"></path>
                    </svg>graph-QL</div>
                    <button id="logout-btn">Sign Out</button>
                </header>
                <div style="background: #1F150C; border: 1px solid #412D15; border-radius: 12px; padding: 50px; text-align: center; color: #E1DCC9;">
                    <h2>Welcome ${username}! 👋</h2>
                    <p style="color: #a39c87; margin-top: 10px;">No data or Project found in your account</p>
                </div>
            </div>
        `;
        document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/"; 
    });    
};
