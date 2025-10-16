const adminPassword = "Prince1987";
let userRole = "";

// Charger le menu depuis le localStorage ou valeurs par défaut
let dishes = JSON.parse(localStorage.getItem("dishes")) || [
  { name: "Salata Mechouia", price: "5 DT", model: "models/salata-mechouia.glb" },
  { name: "Rouz", price: "7 DT", model: "models/rouz.glb" },
  { name: "Lasagne", price: "9 DT", model: "models/lasagne.glb" },
  { name: "Plat Mixte", price: "12 DT", model: "models/plat-mixte.glb" }
];

// Fonction pour afficher le menu
function showMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  dishes.forEach(dish => {
    const div = document.createElement("div");
    div.className = "dish";
    div.innerHTML = `
      <h3>${dish.name}</h3>
      <model-viewer src="${dish.model}" camera-controls auto-rotate ar></model-viewer>
      <div class="price">${dish.price}</div>
    `;
    menu.appendChild(div);
  });
}

// Fonction de connexion
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

// Afficher le champ de login admin
function showAdminLogin() {
  document.getElementById("admin-login").style.display = "block";
}

// Ajouter un plat (pour le propriétaire)
function addDish() {
  if (userRole !== "admin") return alert("Accès refusé");
  const name = document.getElementById("dish-name").value.trim();
  const price = document.getElementById("dish-price").value.trim();
  const model = document.getElementById("dish-model").value.trim();

  if (!name || !price || !model) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  dishes.push({ name, price, model });
  localStorage.setItem("dishes", JSON.stringify(dishes)); // sauvegarde
  showMenu();

  // vider les champs
  document.getElementById("dish-name").value = "";
  document.getElementById("dish-price").value = "";
  document.getElementById("dish-model").value = "";
}

// Charger le menu à l’ouverture
window.onload = showMenu;
