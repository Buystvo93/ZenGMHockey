function loadLeague(data) {
  document.getElementById("leagueName").textContent =
    data.meta?.name || "Zen GM League";

  renderStandings(data);
  renderPlayerStats(data);
}
