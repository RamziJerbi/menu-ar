let dishes = [
  { name: "Salata Mechouia", price: "5 DT", model: "models/salata-mechouia.glb", ingredients: "Tomates, poivrons, oignons, huile d’olive" },
  { name: "Rouz", price: "7 DT", model: "models/rouz.glb", ingredients: "Riz, légumes, épices" },
  { name: "Lasagne", price: "9 DT", model: "models/lasagne.glb", ingredients: "Pâtes, sauce tomate, fromage, viande" },
  { name: "Plat Mixte", price: "12 DT", model: "models/plat-mixte.glb", ingredients: "Salata Mechouia, Rouz, Viande, Légumes" }
];

const menuSection = document.getElementById("menu");
const buttons = document.querySelectorAll(".menu-btn");
const popup = document.getElementById("popup");
const popupName = document.getElementById("popup-name");
const popupIngredients = document.getElementById("popup-ingredients");
const popupModel = document.getElementById("popup-model");
const closeBtn = document.querySelector(".close-btn");
const adminPanel = document.getElementById("admin-panel");
const addDishBtn = document.getElementById("add-dish-btn");
const ownerBtn = document.getElementById("owner-btn");

const OWNER_PASSWORD = "prince123";

// Charger depuis localStorage
if(localStorage.getItem("dishes")){
  dishes = JSON.parse(localStorage.getItem("dishes"));
}

// Sauvegarder dans localStorage
function saveDishes(){
  localStorage.setItem("dishes", JSON.stringify(dishes));
}

// Affichage menu
function showMenu() {
  menuSection.innerHTML = "";
  dishes.forEach((dish, index) => {
    const div = document.createElement("div");
    div.className = "dish";
    div.style.animationDelay = `${index * 0.1}s`;
    div.innerHTML = `<h3>${dish.name}</h3>
                     <model-viewer src="${dish.model}" camera-controls auto-rotate ar></model-viewer>
                     <div class="price">${dish.price}</div>`;

    if(adminPanel.classList.contains("active")){
      const adminBtns = document.createElement("div");
      adminBtns.className = "admin-dish-btns";
      adminBtns.innerHTML = `<button class="edit-btn">Éditer</button>
                             <button class="delete-btn">Supprimer</button>`;
      div.appendChild(adminBtns);

      adminBtns.querySelector(".edit-btn").addEventListener("click", (e)=>{
        e.stopPropagation();
        const name = prompt("Nom du plat :", dish.name);
        const price = prompt("Prix :", dish.price);
        const ingredients = prompt("Ingrédients :", dish.ingredients);
        const model = prompt("Lien modèle 3D :", dish.model);
        if(name && price && ingredients && model){
          dish.name = name;
          dish.price = price;
          dish.ingredients = ingredients;
          dish.model = model;
          saveDishes();
          showMenu();
        }
      });

      adminBtns.querySelector(".delete-btn").addEventListener("click", (e)=>{
        e.stopPropagation();
        if(confirm(`Supprimer ${dish.name} ?`)){
          dishes.splice(index,1);
          saveDishes();
          showMenu();
        }
      });
    }

    div.addEventListener("click", () => openPopup(dish));
    menuSection.appendChild(div);
  });
}

// Popup
function openPopup(dish) {
  popupName.textContent = dish.name;
  popupIngredients.textContent = "Ingrédients : " + dish.ingredients;
  popupModel.src = dish.model;
  popup.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

// Menu boutons actif
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const index = parseInt(btn.dataset.dish);
    const dishElement = menuSection.children[index];
    dishElement.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

// Mode propriétaire via bouton
ownerBtn.classList.remove("hidden");
ownerBtn.addEventListener("click", () => {
  const password = prompt("Entrer le mot de passe propriétaire :");
  if(password === OWNER_PASSWORD){
    adminPanel.classList.remove("hidden");
    adminPanel.classList.add("active");
    ownerBtn.classList.add("hidden");
    showMenu();
  } else {
    alert("Mot de passe incorrect !");
  }
});

// Ajouter un plat
addDishBtn?.addEventListener("click", () => {
  const name = prompt("Nom du plat :");
  const price = prompt("Prix :");
  const ingredients = prompt("Ingrédients :");
  const model = prompt("Lien modèle 3D :");
  if(name && price && ingredients && model){
    dishes.push({name, price, ingredients, model});
    saveDishes();
    showMenu();
  }
});

window.onload = showMenu;
