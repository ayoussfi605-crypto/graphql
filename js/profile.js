import { graphqlRequest } from "./api.js";
import { logout } from "./logout.js";
import { isAuthenticated } from "./auth.js";
import {
    cumulativeXP,
    calculatePoints,
    pointsToString,
    drawXPGraph,
    drawPoints,
    drawAxes,
} from "./graph.js";

async function renderProfile() {

if (!isAuthenticated()) {
    window.location.href = "index.html";
}
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
 

    document.getElementById("profile").innerHTML = `
<div class="profile-header">

    <img src="${avatar}" alt="Profile Picture" class="avatar">

    <div>
        <h2>Welcome back,</h2>
        <h1>${user.login}</h1>
        <p>${cohort}</p>
    </div>

</div>

<div class="cards">

    <div class="card">
        <h3>Audit Ratio</h3>
        <span>${auditRatio.toFixed(1)}</span>
    </div>

    <div class="card">
        <h3>Total XP</h3>
        <span>${formatXP(totalXP)}</span>
    </div>

    <div class="card">
        <h3>Level</h3>
        <span>${level}</span>
    </div>

</div>

<div class="graphs">

    <div class="graph-card">
    

    <h2>XP Progress</h2>
    
        <svg id="xp-graph" width="700" height="350"></svg>

    </div>

    <div class="graph-card">
        <h2>Skills</h2>

        <svg id="skills-graph" width="700" height="350"></svg>
    </div>

</div>
`;

   const xp = cumulativeXP(transactions);
    const points = calculatePoints(xp)
    const pointsString = pointsToString(points);
    drawAxes();
    drawXPGraph(pointsString);
    drawPoints(points);
       

}

document.getElementById("logout-btn").addEventListener("click", logout);

renderProfile();