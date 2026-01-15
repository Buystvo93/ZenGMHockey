function loadLeague(data) {
  document.getElementById("leagueName").textContent =
    data.meta?.name || "Zen GM League";

  const saved = localStorage.getItem("leagueData");
  if (saved) {
    loadLeague(JSON.parse(saved));
  }

  renderStandings(data);
  renderPlayerStats(data);
}
