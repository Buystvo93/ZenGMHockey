const input = document.getElementById("leagueFile");

let leagueData = null;

if (input) {
  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      leagueData = JSON.parse(reader.result);
      loadLeague(leagueData);
    };
    reader.readAsText(file);
  });
}
