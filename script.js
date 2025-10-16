const adminPassword = "Prince1987";
let userRole = "";

// Charger le menu depuis le localStorage ou valeurs par défaut
let dishes = JSON.parse(localStorage.getItem("dishes")) || [
  { name: "Salata Mechouia", price: "5 DT", model: "models/salata-mechouia.glb" },
  { name: "Rouz", price: "7 DT", model: "models/rouz.glb" },
  { name: "Lasagne", price: "9 DT", model: "models/lasagne.glb" },
  { name: "Plat Mixte", price: "12 DT", model: "models/plat-mixte.glb" }
];

function showMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  dishes.forEach((dish, index) => {
    const div = document.createElement("div");
    div.className = "dish";

    let adminControls = "";
    if (userRole === "admin") {
      adminControls = `
        <button class="btn" onclick="editDish(${index})">Modifier</button>
        <button class="btn" onclick="deleteDish(${index})">Supprimer</button>
      `;
    }

    div.innerHTML = `
      <h3>${dish.name}</h3>
      <model-viewer src="${dish.model}" camera-controls auto-rotate ar></model-viewer>
      <div class="price">${dish.price}</div>
      ${adminControls}
    `;
    menu.appendChild(div);
  });
}

// Connexion client / propriétaire
function login(role) {
  if (role === "client") {
    userRole = "client";
    document.getElementById("login-section").style.display = "none";
    document.getElementById("menu").style.display = "flex";
    showMenu();
  } else if (role === "admin") {
    const pwd = document.getElementById("admin-password").value;
    if (pwd === adminPassword) {
      userRole = "admin";
      document.getElementById("login-section").style.display = "none";
      document.getElementById("admin-login").style.display = "none";
      document.getElementById("admin-section").style.display = "block";
      showMenu();
    } else {
      alert("Mot de passe incorrect !");
    }
  }
}

function showAdminLogin() {
  document.getElementById("admin-login").style.display = "block";
}

// Ajouter un plat
function addDish() {
  if (userRole !== "admin") return alert("Accès refusé");
  const name = document.getElementById("dish-name").value.trim();
  const price = document.getElementById("dish-price").value.trim();
  const model = document.getElementById("dish-model").value.trim();

  if (!name || !price || !model) return alert("Veuillez remplir tous les champs !");
  
  dishes.push({ name, price, model });
  localStorage.setItem("dishes", JSON.stringify(dishes));
  showMenu();

  document.getElementById("dish-name").value = "";
  document.getElementById("dish-price").value = "";
  document.getElementById("dish-model").value = "";
}

// Supprimer un plat
function deleteDish(index) {
  if (!confirm("Voulez-vous vraiment supprimer ce plat ?")) return;
  dishes.splice(index, 1);
  localStorage.setItem("dishes", JSON.stringify(dishes));
  showMenu();
}

// Modifier un plat
function editDish(index) {
  const dish = dishes[index];
  const newName = prompt("Nom du plat :", dish.name);
  if (!newName) return;
  const newPrice = prompt("Prix du plat :", dish.price);
  if (!newPrice) return;
  const newModel = prompt("Lien .glb :", dish.model);
  if (!newModel) return;

  dishes[index] = { name: newName, price: newPrice, model: newModel };
  localStorage.setItem("dishes", JSON.stringify(dishes));
  showMenu();
}

// Affichage initial
window.onload = showMenu;
