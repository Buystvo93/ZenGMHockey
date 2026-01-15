/* =========================
   SKATER STATS
========================= */
function sumSkaterStats(player) {
  const totals = { gp: 0, g: 0, a: 0, pts: 0, pm: 0, pim: 0 };

  if (!player.stats) return totals;

  player.stats.forEach(season => {
    if (!season.gpSkater) return;

    totals.gp += season.gpSkater.gp || 0;
    totals.g += season.gpSkater.g || 0;
    totals.a += season.gpSkater.a || 0;
    totals.pts += season.gpSkater.pts || 0;
    totals.pm += season.gpSkater.pm || 0;
    totals.pim += season.gpSkater.pim || 0;
  });

  return totals;
}

function sumGoalieStats(player) {
  const totals = { gp: 0, w: 0, l: 0, sv: 0, gaa: 0, seasons: 0 };

  if (!player.stats) return totals;

  player.stats.forEach(season => {
    if (!season.gpGoalie) return;

    totals.gp += season.gpGoalie.gp || 0;
    totals.w += season.gpGoalie.w || 0;
    totals.l += season.gpGoalie.l || 0;
    totals.sv += season.gpGoalie.svPct || 0;
    totals.gaa += season.gpGoalie.gaa || 0;
    totals.seasons++;
  });

  return {
    gp: totals.gp,
    w: totals.w,
    l: totals.l,
    svPct: totals.seasons ? totals.sv / totals.seasons : 0,
    gaa: totals.seasons ? totals.gaa / totals.seasons : 0
  };
}


function renderSkaterStats(data) {
  const container = document.getElementById("skaterStats");
  if (!container) return;

  const players = data.players.filter(p => p.pos !== "G");

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
    const s = sumSkaterStats(p);

    if (s.gp === 0) return;

    html += `
      <tr>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${team}</td>
        <td>${s.gp}</td>
        <td>${s.g}</td>
        <td>${s.a}</td>
        <td>${s.pts}</td>
        <td>${s.pm}</td>
        <td>${s.pim}</td>
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
