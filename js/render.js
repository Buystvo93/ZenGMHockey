/* =========================
   SKATER STATS
========================= */
function getSkaterSeasons(player) {
  if (player.stats && player.stats.length) return player.stats;
  if (player.statsPlayoffs && player.statsPlayoffs.length) return player.statsPlayoffs;
  return [];
}

function sumSkaterStats(player) {
  const totals = { gp: 0, g: 0, a: 0, pts: 0, pm: 0, pim: 0 };
  const seasons = getSkaterSeasons(player);

  seasons.forEach(s => {
    if (!s.gpSkater) return;

    totals.gp += s.gpSkater.gp || 0;
    totals.g += s.gpSkater.g || 0;
    totals.a += s.gpSkater.a || 0;
    totals.pts += s.gpSkater.pts || 0;
    totals.pm += s.gpSkater.pm || 0;
    totals.pim += s.gpSkater.pim || 0;
  });

  return totals;
}


function getGoalieSeasons(player) {
  if (player.stats && player.stats.length) return player.stats;
  if (player.statsPlayoffs && player.statsPlayoffs.length) return player.statsPlayoffs;
  return [];
}

function sumGoalieStats(player) {
  let gp = 0, w = 0, l = 0, sv = 0, gaa = 0, count = 0;
  const seasons = getGoalieSeasons(player);

  seasons.forEach(s => {
    if (!s.gpGoalie) return;

    gp += s.gpGoalie.gp || 0;
    w += s.gpGoalie.w || 0;
    l += s.gpGoalie.l || 0;
    sv += s.gpGoalie.svPct || 0;
    gaa += s.gpGoalie.gaa || 0;
    count++;
  });

  return {
    gp,
    w,
    l,
    svPct: count ? sv / count : 0,
    gaa: count ? gaa / count : 0
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

  const goalies = data.players.filter(p => p.pos === "G");

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
    const g = sumGoalieStats(p);

    

    html += `
      <tr>
        <td>${p.firstName} ${p.lastName}</td>
        <td>${team}</td>
        <td>${g.gp}</td>
        <td>${g.w}</td>
        <td>${g.l}</td>
        <td>${g.svPct.toFixed(3)}</td>
        <td>${g.gaa.toFixed(2)}</td>
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
        <td>${p.ratings?.ovr ?? "-"}</td>
        <td>${p.age}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
}
