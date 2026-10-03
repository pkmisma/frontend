import "./style.css";

const $ = (id) => document.getElementById(id);
let current = null;

async function api(path, options) {
  const res = await fetch(`/api${path}`, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function render(fact) {
  current = fact;
  $("emoji").textContent = fact.emoji;
  $("title").textContent = fact.title;
  $("text").textContent = fact.text;
  $("likes").textContent = fact.likes;
}

async function loadRandom() {
  try {
    render(await api("/facts/random"));
  } catch (err) {
    $("title").textContent = "Backend unreachable";
    $("text").textContent = `Could not load a fact (${err.message}).`;
  }
}

async function like() {
  if (!current) return;
  try {
    render(await api(`/facts/${current.id}/like`, { method: "POST" }));
  } catch (err) {
    console.error(err);
  }
}

// Shows which backend pod / version / environment served us - handy to see load balancing
async function loadInfo() {
  try {
    const info = await api("/info");
    $("dot").className = "dot ok";
    $("status-text").textContent = `Backend ${info.version} · env: ${info.environment} · pod: ${info.pod}`;
  } catch {
    $("dot").className = "dot bad";
    $("status-text").textContent = "Backend offline";
  }
}

$("like").addEventListener("click", like);
$("next").addEventListener("click", () => {
  loadRandom();
  loadInfo();
});

loadRandom();
loadInfo();
setInterval(loadInfo, 10000);
