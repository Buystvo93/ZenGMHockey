/* =========================
   SKATER STATS
========================= */
function renderSkaterStats(data) {
  const container = document.getElementById("skaterStats");
  if (!container) return;

  const players = data.players.filter(p => !p.gpG); // skaters only

  let html = `
    <table class="stats-table">
      <tr>
        <th>Player</th>
        <th>Team</th>
        <th>GP</th>
        <th>G</th>
        <th>A</th>
        <th>PTS</th>
        <th>+/-</th>
        <th>PIM</th>
      </tr>
  `;

  players.forEach(p => {
    const team = data.teams[p.tid]?.abbrev || "FA";

    html += `
      <tr>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${team}</td>
        <td>${p.stats.gp}</td>
        <td>${p.stats.gpSkater?.g || 0}</td>
        <td>${p.stats.gpSkater?.a || 0}</td>
        <td>${p.stats.gpSkater?.pts || 0}</td>
        <td>${p.stats.gpSkater?.pm || 0}</td>
        <td>${p.stats.gpSkater?.pim || 0}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
}

/* =========================
   GOALIE STATS
========================= */
function renderGoalieStats(data) {
  const container = document.getElementById("goalieStats");
  if (!container) return;

  const goalies = data.players.filter(p => p.gpG);

  let html = `
    <table class="stats-table">
      <tr>
        <th>Player</th>
        <th>Team</th>
        <th>GP</th>
        <th>W</th>
        <th>L</th>
        <th>SV%</th>
        <th>GAA</th>
      </tr>
  `;

  goalies.forEach(p => {
    const team = data.teams[p.tid]?.abbrev || "FA";

    html += `
      <tr>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${team}</td>
        <td>${p.stats.gp}</td>
        <td>${p.stats.gpGoalie?.w || 0}</td>
        <td>${p.stats.gpGoalie?.l || 0}</td>
        <td>${(p.stats.gpGoalie?.svPct || 0).toFixed(3)}</td>
        <td>${(p.stats.gpGoalie?.gaa || 0).toFixed(2)}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
}

/* =========================
   TEAMS GRID
========================= */
function renderTeams(data) {
  const grid = document.getElementById("teamGrid");
  if (!grid) return;

  grid.innerHTML = "";

  data.teams.forEach(team => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.textContent = team.name;

    card.onclick = () => renderTeamRoster(data, team.tid);

    grid.appendChild(card);
  });
}

/* =========================
   TEAM ROSTER
========================= */
function renderTeamRoster(data, tid) {
  const container = document.getElementById("teamRoster");
  const title = document.getElementById("teamName");
  if (!container || !title) return;

  const team = data.teams[tid];
  const players = data.players.filter(p => p.tid === tid);

  title.textContent = team.name;

  let html = `
    <table class="stats-table">
      <tr>
        <th>Player</th>
        <th>Pos</th>
        <th>OVR</th>
        <th>Age</th>
      </tr>
  `;

  players.forEach(p => {
    html += `
      <tr>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${p.pos}</td>
        <td>${p.ratings.ovr}</td>
        <td>${p.age}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
}
