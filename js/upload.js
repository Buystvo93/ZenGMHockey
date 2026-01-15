const input = document.getElementById("leagueFile");

if (input) {
  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("leagueData", reader.result);
      loadLeague(JSON.parse(reader.result));
    };
    reader.readAsText(file);
  });
}

// Auto-load if already uploaded
const saved = localStorage.getItem("leagueData");
if (saved) {
  loadLeague(JSON.parse(saved));
}
