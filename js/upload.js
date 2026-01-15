document.getElementById("leagueFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const leagueData = JSON.parse(reader.result);
    window.leagueData = leagueData;
    loadLeague(leagueData);
  };
  reader.readAsText(file);
});
