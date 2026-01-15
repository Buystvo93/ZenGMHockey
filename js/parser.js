function loadLeague(data) {
  if (!data || !data.players || !data.teams) {
    console.error("Invalid league file");
    return;
  }

  // Stats page
  renderSkaterStats(data);
  renderGoalieStats(data);

  // Teams page
  renderTeams(data);
}
