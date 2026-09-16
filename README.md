# GraphQL Profile — Zone01 Oujda

A single-page web app that authenticates against the Zone01 Oujda platform and displays a personal student profile — XP, level, audit ratio, skills and a cumulative XP graph — built entirely with **vanilla JavaScript** (no frameworks, no charting libraries) and the platform's **GraphQL** API.

## ✨ Features

- **Login** with username/email + password (Basic Auth → JWT)
- **Session persistence** via `localStorage`, with logout
- **Profile overview**: avatar, name, email, cohort, level, total XP
- **Stat cards**: Total XP, Current Level, Audit Ratio
- **Custom SVG graphs** (hand-drawn with the DOM API, no library):
  - Cumulative XP over time (line + area chart, with axes and labels)
  - Best skills chart
- Responsive layout (login card + dashboard) down to mobile

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Markup / Styling | HTML5, CSS3 (custom, no framework) |
| Logic | Vanilla JavaScript (ES Modules) |
| Data | [GraphQL](https://graphql.org/) |
| Auth | JWT (Basic Auth signin → Bearer token) |
| Graphs | Native SVG, built manually |

## 📁 Project Structure

```
.
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js        # auth check / page routing
    ├── login.js        # login form handling
    ├── auth.js          # signin request + isAuthenticated()
    ├── api.js            # graphqlRequest() helper
    ├── profile.js         # fetches user data, renders profile + stat cards
    ├── graph.js             # SVG XP/skills graph rendering
    └── logout.js               # clears session
```

## 🔌 API

- **Auth (signin):** `POST https://learn.zone01oujda.ma/api/auth/signin`
  Basic Auth header (`identifier:password`, base64) → returns a JWT.

- **GraphQL endpoint:** `POST https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql`
  Bearer token in the `Authorization` header. Single query fetches:
  - `user` (login, email, name, avatar, auditRatio, cohort)
  - `totalXP` — aggregated XP transactions
  - `lvl` — max level transaction
  - `skills` — skill-type transactions
  - `transactions` — XP history (for the graph)

## 🚀 Getting Started

1. Clone the repo.
2. No build step required — pure static site.
3. Serve the folder with any static server (e.g. VS Code **Live Server**):
   ```bash
   # or with Python
   python3 -m http.server 5500
   ```
4. Open `http://127.0.0.1:5500/index.html`.
5. Log in with your Zone01 Oujda credentials.

## 🔒 Notes

- The JWT is stored in `localStorage` under the `token` key.
- On logout, the token is removed and the app redirects back to the login screen.
- All GraphQL queries are read-only (no mutations).

## 👤 Author

Built by **aelyoussef** .