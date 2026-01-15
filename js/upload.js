document.getElementById("leagueFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
  localStorage.setItem("leagueData", reader.result);
  loadLeague(JSON.parse(reader.result));
  };

  reader.readAsText(file);
});
