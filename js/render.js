/* =========================
   SKATER STATS
========================= */
function getSkaterSeasons(player) {
  if (player.stats && player.stats.length) return player.stats;
  if (player.statsPlayoffs && player.statsPlayoffs.length) return player.statsPlayoffs;
  return [];
}

function sumSkaterStats(player) {
  const totals = { gp: 0, g: 0, a: 0, pts: 0, hits: 0, pim: 0, shots: 0 };
  const seasons = getSkaterSeasons(player);
  
  seasons.forEach(s => {
    if (!s.gpSkater) return;
    const goals = (s.evG + s.shG + s.ppG)
    const assists = (s.evA + s.shA + s.ppA)
    const points = (goals + assists)
     
    totals.gp += s.gpSkater || 0;
    totals.g +=  goals || 0;
    totals.a += assists || 0;
    totals.pts += points || 0;
    totals.hits += s.hit || 0;
    totals.pim += s.pim || 0;
    totals.shots += s.s || 0;
  });

  return totals;
}


function getGoalieSeasons(player) {
  if (player.stats && player.stats.length) return player.stats;
  if (player.statsPlayoffs && player.statsPlayoffs.length) return player.statsPlayoffs;
  return [];
}

function sumGoalieStats(player) {
  let gp = 0;
  let w = 0;
  let l = 0;
  let otl = 0;
  let sv = 0;
  let ga = 0;
  let sa = 0;

  const seasons = getGoalieSeasons(player);

  seasons.forEach(s => {
    // Only count goalie seasons
    if (!s.gpGoalie || s.gpGoalie === 0) return;

    gp += s.gpGoalie || 0;
    w += s.gW || 0;
    l += s.gL || 0;
    otl += s.gOTL || 0;

    sv += s.sv || 0;
    ga += s.ga || 0;

    // Zen GM sometimes omits sa
    sa += s.sa ?? ((s.sv || 0) + (s.ga || 0));
  });

  const gaa = gp ? (ga / gp) : 0;
  const svp = sa ? (sv / sa) : 0;

  return {
    gp,
    w,
    l,
    otl,
    sv,
    ga,
    sa,
    gaa,
    svp
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
        <th>HITS</th>
        <th>PIM</th>
        <th>SHOTS</th>
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
        <td>${s.hits}</td>
        <td>${s.pim}</td>
        <td>${s.shots}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;

  makeTableSortable(container.querySelector("table"));
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
        <th>OTL</th>
        <th>SA</th>
        <th>SV</th>
        <th>GA</th>
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
        <td>${g.otl}</td>
        <td>${g.sa}</td>
        <td>${g.sv}</td>
        <td>${g.ga}</td>
        <td>${g.svp.toFixed(3)}</td>
        <td>${g.gaa.toFixed(2)}</td>
      </tr>
    `;
  });

  html += "</table>";
  container.innerHTML = html;
  makeTableSortable(container.querySelector("table"));
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
  makeTableSortable(container.querySelector("table"));
}

function makeTableSortable(table) {
  const headers = table.querySelectorAll("th");
  const tbody = table.querySelector("tbody") || table;

  headers.forEach((header, colIndex) => {
    let asc = false;

    header.style.cursor = "pointer";

    header.addEventListener("click", () => {
      asc = !asc;

      // Remove arrows from other headers
      headers.forEach(h => h.textContent = h.textContent.replace(" ▲", "").replace(" ▼", ""));

      header.textContent += asc ? " ▲" : " ▼";

      const rows = Array.from(tbody.querySelectorAll("tr")).slice(1);

      rows.sort((a, b) => {
        let A = a.children[colIndex].textContent.trim();
        let B = b.children[colIndex].textContent.trim();

        const numA = parseFloat(A.replace("%", ""));
        const numB = parseFloat(B.replace("%", ""));

        if (!isNaN(numA) && !isNaN(numB)) {
          return asc ? numA - numB : numB - numA;
        }

        return asc
          ? A.localeCompare(B)
          : B.localeCompare(A);
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });
}

