const STARTING_BERRIES = 1000;
const COST_ONE = 100;
const COST_TEN = 900;

const upgrades = [
  { name: "Étincelle", rarity: "Commun", tier: "common", chance: 50, icon: "✨", description: "Une petite étincelle de puissance." },
  { name: "Vent léger", rarity: "Rare", tier: "rare", chance: 25, icon: "🌬️", description: "Un souffle qui accélère ta baguette." },
  { name: "Bouclier marin", rarity: "Épique", tier: "epic", chance: 15, icon: "🛡️", description: "Une protection venue des profondeurs." },
  { name: "Foudre du Nouveau Monde", rarity: "Légendaire", tier: "legendary", chance: 8, icon: "⚡", description: "Une énergie rare et impressionnante." },
  { name: "Volonté du Roi", rarity: "Mythique", tier: "mythic", chance: 2, icon: "👑", description: "Un pouvoir réservé aux plus chanceux." }
];

let berries = load("berryGachaBerries", STARTING_BERRIES);
let inventory = load("berryGachaInventory", {});
let history = load("berryGachaHistory", []);
let latestResults = [];
let sortDescending = true;

const $ = (id) => document.getElementById(id);
const save = () => {
  localStorage.setItem("berryGachaBerries", String(berries));
  localStorage.setItem("berryGachaInventory", JSON.stringify(inventory));
  localStorage.setItem("berryGachaHistory", JSON.stringify(history));
};
function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch { return fallback; }
}
function formatBerry(value) { return `${value.toLocaleString("fr-FR")} ฿`; }

function render() {
  $("balance").textContent = formatBerry(berries);
  $("rates").innerHTML = upgrades.map(u => `
    <div class="rate"><b class="${u.tier}">${u.rarity}</b><small>${u.chance}%</small></div>
  `).join("");

  const entries = Object.entries(inventory).filter(([, qty]) => qty > 0);
  entries.sort((a, b) => {
    const ua = upgrades.find(u => u.name === a[0]);
    const ub = upgrades.find(u => u.name === b[0]);
    return sortDescending ? upgrades.indexOf(ub) - upgrades.indexOf(ua) : upgrades.indexOf(ua) - upgrades.indexOf(ub);
  });
  $("inventoryCount").textContent = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const inv = $("inventory");
  inv.classList.toggle("empty", entries.length === 0);
  inv.innerHTML = entries.length ? entries.map(([name, qty]) => {
    const u = upgrades.find(x => x.name === name);
    return `<div class="item"><div class="item-icon">${u.icon}</div><div class="item-info"><strong class="${u.tier}">${u.name}</strong><small>${u.rarity} · ${u.description}</small></div><span class="item-qty">×${qty}</span></div>`;
  }).join("") : "Tes améliorations apparaîtront ici après tes invocations.";

  const hist = $("history");
  hist.classList.toggle("empty", history.length === 0);
  hist.innerHTML = history.length ? history.slice(0, 8).map(h =>
    `<div class="history-item"><span>${h.icon} <strong class="${h.tier}">${h.name}</strong></span><small>${h.date}</small></div>`
  ).join("") : "Aucun tirage pour le moment.";
}
function randomUpgrade() {
  const roll = Math.random() * 100;
  let total = 0;
  for (const upgrade of upgrades) {
    total += upgrade.chance;
    if (roll < total) return upgrade;
  }
  return upgrades[0];
}
function draw(count) {
  const cost = count === 10 ? COST_TEN : COST_ONE;
  if (berries < cost) {
    alert(`Pas assez de Berrys ! Il te manque ${formatBerry(cost - berries)}.`);
    return;
  }
  berries -= cost;
  latestResults = Array.from({ length: count }, randomUpgrade);
  latestResults.forEach(u => {
    inventory[u.name] = (inventory[u.name] || 0) + 1;
    history.unshift({ name: u.name, icon: u.icon, tier: u.tier, date: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) });
  });
  history = history.slice(0, 30);
  save();
  render();
  showResults();
}
function showResults() {
  $("results").innerHTML = latestResults.map(u => `
    <div class="result-card"><span class="big-icon">${u.icon}</span><strong class="${u.tier}">${u.name}</strong><small>${u.rarity}</small></div>
  `).join("");
  $("resultTitle").textContent = latestResults.length === 1 ? "Nouvelle amélioration !" : `${latestResults.length} découvertes !`;
  $("modal").hidden = false;
}
$("drawOne").addEventListener("click", () => draw(1));
$("drawTen").addEventListener("click", () => draw(10));
$("addBerry").addEventListener("click", () => {
  berries += 500;
  save();
  render();
});
$("sortInventory").addEventListener("click", () => { sortDescending = !sortDescending; render(); });
$("clearHistory").addEventListener("click", () => {
  if (confirm("Effacer tout l'historique des tirages ?")) { history = []; save(); render(); }
});
$("closeModal").addEventListener("click", () => { $("modal").hidden = true; });
$("claimResults").addEventListener("click", () => { $("modal").hidden = true; });
$("modal").addEventListener("click", e => { if (e.target === $("modal")) $("modal").hidden = true; });
render();
