// ====== CONFIG ======
const API_URL = "https://script.google.com/macros/s/AKfycbybgjj0R1EDpKeGqYZzRpSbYwo35BwCLly385wT3Uu8MkRsGsGpKViHyfA-cEVXeK98/exec"; // <--- ton URL Apps Script (doGet/doPost)
const WRITE_KEY = "PrinceSecret2025"; // <--- doit être le même que SECRET_KEY côté Apps Script

// DOM references
const menuSection = document.getElementById("menu");
const menuNav = document.getElementById("menu-nav");
const popup = document.getElementById("popup");
const popupName = document.getElementById("popup-name");
const popupIngredients = document.getElementById("popup-ingredients");
const popupModel = document.getElementById("popup-model");
const closeBtn = document.querySelector(".close-btn");
const adminPanel = document.getElementById("admin-panel");
const addDishBtn = document.getElementById("add-dish-btn");
const ownerBtn = document.getElementById("owner-btn");

let dishes = []; // rempli depuis le serveur

// Helper: fetch list (GET)
async function loadDishesFromServer() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    if (json.status === "ok") {
      dishes = json.items || [];
      // ensure fields
      dishes = dishes.map(d => ({
        id: d.id + "",
        name: d.name || "",
        price: d.price || "",
        model: d.model || "",
        ingredients: d.ingredients || ""
      }));
      renderAll();
    } else {
      console.error("API GET error", json);
    }
  } catch (err) {
    console.error("Erreur fetch", err);
  }
}

// Helper: POST to server for add/edit/delete
async function postToServer(payload) {
  try {
    payload.key = WRITE_KEY;
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Erreur POST", err);
    return { status:"error", message: err.message };
  }
}

// Render UI (menu + buttons)
function renderAll() {
  renderMenu();
  updateMenuButtons();
}

// Render dishes grid
function renderMenu() {
  menuSection.innerHTML = "";
  dishes.forEach((dish, index) => {
    const div = document.createElement("div");
    div.className = "dish";
    div.style.animationDelay = `${index * 0.08}s`;
    div.innerHTML = `
      <h3>${escapeHtml(dish.name)}</h3>
      <model-viewer src="${escapeAttr(dish.model)}" camera-controls auto-rotate ar></model-viewer>
      <div class="price">${escapeHtml(dish.price)}</div>
    `;
    // si admin visible, on ajoutera les boutons (adminPanel possède classe 'active' quand on est admin)
    if (adminPanel.classList.contains("active")) {
      const adminBtns = document.createElement("div");
      adminBtns.className = "admin-dish-btns";
      adminBtns.innerHTML = `<button class="edit-btn">Éditer</button><button class="delete-btn">Supprimer</button>`;
      // edit
      adminBtns.querySelector(".edit-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        const name = prompt("Nom du plat :", dish.name) || dish.name;
        const price = prompt("Prix :", dish.price) || dish.price;
        const ingredients = prompt("Ingrédients :", dish.ingredients) || dish.ingredients;
        const model = prompt("Lien modèle 3D :", dish.model) || dish.model;
        const payload = { action: "edit", item: { id: dish.id, name, price, model, ingredients } };
        const res = await postToServer(payload);
        if (res.status === "ok") {
          await loadDishesFromServer();
        } else alert("Erreur édition : " + (res.message||""));
      });
      // delete
      adminBtns.querySelector(".delete-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        if (!confirm(`Supprimer ${dish.name} ?`)) return;
        const res = await postToServer({ action: "delete", id: dish.id });
        if (res.status === "ok") await loadDishesFromServer();
        else alert("Erreur suppression : " + (res.message||""));
      });
      div.appendChild(adminBtns);
    }

    // ouvrir popup
    div.addEventListener("click", () => openPopup(dish));
    menuSection.appendChild(div);
  });
}

// Popup open/close
function openPopup(dish) {
  popupName.textContent = dish.name;
  popupIngredients.textContent = "Ingrédients : " + (dish.ingredients || "Non spécifiés");
  popupModel.src = dish.model || "";
  popup.classList.remove("hidden");
}
closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

// Dynamic menu buttons
function updateMenuButtons() {
  menuNav.innerHTML = "";
  dishes.forEach((dish, index) => {
    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.textContent = dish.name;
    btn.dataset.dish = index;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const el = menuSection.children[index];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    menuNav.appendChild(btn);
  });
}

// Owner button behaviour (no prompt on load)
ownerBtn.classList.remove("hidden");
ownerBtn.addEventListener("click", async () => {
  const password = prompt("Entrer le mot de passe propriétaire :");
  if (password === WRITE_KEY) {
    adminPanel.classList.remove("hidden");
    adminPanel.classList.add("active");
    ownerBtn.classList.add("hidden");
    await loadDishesFromServer(); // reload to show admin buttons
  } else {
    alert("Mot de passe incorrect !");
  }
});

// Add dish (calls server)
addDishBtn?.addEventListener("click", async () => {
  const name = prompt("Nom du plat :");
  if (!name) return;
  const price = prompt("Prix :");
  const ingredients = prompt("Ingrédients :");
  const model = prompt("Lien modèle 3D :");
  if (!model) { alert("Il faut un lien .glb"); return; }
  const res = await postToServer({ action: "add", item: { name, price, model, ingredients } });
  if (res.status === "ok") await loadDishesFromServer();
  else alert("Erreur ajout : " + (res.message||""));
});

// Utils
function escapeHtml(s){ return String(s||"").replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }
function escapeAttr(s){ return (s||""); }

// Init
window.addEventListener("load", () => {
  loadDishesFromServer();
});
