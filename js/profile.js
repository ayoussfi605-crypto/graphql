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


{
  user {
    login
      attrs
    auditRatio

    cohort: events(
      where: {
        cohorts: {
          labelName: {
            _is_null: false
          }
        }
      }
    ) {
      cohorts {
        labelName
      }
    }
  }

  totalXP: transaction_aggregate(
    where: {
      type: { _eq: "xp" }
      event: { object: { name: { _eq: "Module" } } }
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }

  lvl: transaction_aggregate(
    where: {
      type: { _eq: "level" }
      event: { object: { name: { _eq: "Module" } } }
    }
  ) {
    aggregate {
      max {
        amount
      }
    }
  }
    skills: transaction(
  where: {
    type: { _ilike: "%skill%" }
  }
  order_by: {
    amount: desc
  }
) {
  type
  amount
}
  transactions: transaction(
  where: {
    type: { _eq: "xp" }
    event: {
      object: {
        name: { _eq: "Module" }
      }
    }
  }
  order_by: {
    createdAt: asc
  }
) {
  amount
  createdAt
}
}
  
`);


    const user = result.data.user[0];
    const avatar = user.attrs.avatarUrl;
    const totalXP = result.data.totalXP.aggregate.sum.amount;
    const level = result.data.lvl.aggregate.max.amount;
    const cohort = user.cohort[0].cohorts[0].labelName;
    const auditRatio = user.auditRatio;
    const skills = result.data.skills;
    const bestSkills = getBestSkills(result.data.skills);
    
    const transactions = result.data.transactions;
    
    
    document.getElementById("avatar-container").innerHTML = `
        <img src="${avatar}" alt="Profile Picture" class="avatar">
    `;

      
    document.getElementById("user-info-container").innerHTML = `
        <h2>Welcome back,</h2>
        <h1>${user.login}</h1>
        <p>${cohort}</p>
    `;

    document.getElementById("audit-card").innerHTML = `
        <h3>Audit Ratio</h3>
        <span>${auditRatio.toFixed(1)}</span>
    `;
    
    document.getElementById("xp-card").innerHTML = `
        <h3>Total XP</h3>
        <span>${formatXP(totalXP)}</span>
    `;
    
    document.getElementById("level-card").innerHTML = `
        <h3>Level</h3>
        <span>${level}</span>
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
        return (xp / 1000000).toFixed(2) + " MB";
    }

    if (xp >= 1000) {
        return (xp / 1000).toFixed(2) + " kB";
    }

    return xp + " B";
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