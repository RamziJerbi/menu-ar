let plats = [];
let currentSelected = null;
const OWNER_PASSWORD = "Prince2025"; // mot de passe simple

async function loadMenu() {
  try {
    const res = await fetch("data.json");
    const json = await res.json();
    const localPlats = JSON.parse(localStorage.getItem("platsAjoutes")) || [];
    plats = [...json, ...localPlats];
    renderMenu();
  } catch (e) {
    console.error("Erreur chargement menu", e);
  }
}

function renderMenu() {
  const nav = document.getElementById("menu-nav");
  const menu = document.getElementById("menu-container");
  nav.innerHTML = "";
  menu.innerHTML = "";

  plats.forEach((p, index) => {
    const btn = document.createElement("button");
    btn.textContent = p.nom;
    btn.addEventListener("click", () => selectPlat(p, btn));
    nav.appendChild(btn);

    const div = document.createElement("div");
    div.className = "plat-card";
    div.innerHTML = `
      <h3>${p.nom}</h3>
      <p>${p.description}</p>
      <p><strong>${p.prix} DT</strong></p>
      <button onclick="viewModel(${index})">Voir en 3D</button>
    `;
    menu.appendChild(div);
  });
}

function selectPlat(plat, button) {
  const viewerSection = document.getElementById("viewer");
  viewerSection.classList.remove("hidden");
  document.getElementById("platName").textContent = plat.nom;

  const viewer = document.getElementById("modelViewer");
  viewer.src = plat.model;
  if (plat.ios_model) viewer.setAttribute("ios-src", plat.ios_model);

  viewerSection.scrollIntoView({ behavior: "smooth" });

  document.querySelectorAll("#menu-nav button").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
}

function viewModel(index) {
  const plat = plats[index];
  document.getElementById("platName").textContent = plat.nom;
  const viewer = document.getElementById("modelViewer");
  viewer.src = plat.model;
  if (plat.ios_model) viewer.setAttribute("ios-src", plat.ios_model);
  document.getElementById("viewer").classList.remove("hidden");
  document.getElementById("viewer").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("viewer").classList.add("hidden");
  document.querySelectorAll("#menu-nav button").forEach(b => b.classList.remove("active"));
});

document.getElementById("login-btn").addEventListener("click", () => {
  const pass = prompt("Mot de passe propriétaire :");
  if (pass === OWNER_PASSWORD) {
    alert("Bienvenue propriétaire !");
    document.getElementById("add-plat-section").classList.remove("hidden");
  } else {
    alert("Mot de passe incorrect !");
  }
});

document.getElementById("add-plat-form").addEventListener("submit", e => {
  e.preventDefault();
  const newPlat = {
    nom: document.getElementById("plat-nom").value,
    description: document.getElementById("plat-desc").value,
    prix: parseFloat(document.getElementById("plat-prix").value),
    ingredients: document.getElementById("plat-ingredients").value.split(",").map(i => i.trim()),
    model: document.getElementById("plat-model").value,
    ios_model: document.getElementById("plat-model-ios").value
  };
  const localPlats = JSON.parse(localStorage.getItem("platsAjoutes")) || [];
  localPlats.push(newPlat);
  localStorage.setItem("platsAjoutes", JSON.stringify(localPlats));
  plats.push(newPlat);
  renderMenu();
  alert("Plat ajouté avec succès !");
  e.target.reset();
});
