function renderStandings(data) {
  const teams = data.teams;

  let html = `
    <table class="stats-table">
      <tr>
        <th>Team</th>
        <th>W</th>
        <th>L</th>
        <th>OT</th>
        <th>PTS</th>
      </tr>
  `;

  teams.forEach(t => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.won}</td>
        <td>${t.lost}</td>
        <td>${t.otl}</td>
        <td>${t.pts}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("standings").innerHTML = html;
}
