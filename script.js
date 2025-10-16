const dishes = [
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
    div.addEventListener("click", () => openPopup(dish));
    menuSection.appendChild(div);
  });
}

// Ouvrir popup
function openPopup(dish) {
  popupName.textContent = dish.name;
  popupIngredients.textContent = "Ingrédients : " + dish.ingredients;
  popupModel.src = dish.model;
  popup.classList.remove("hidden");
}

// Fermer popup
closeBtn.addEventListener("click", () => popup.classList.add("hidden"));

// Scroll vers plat et bouton actif
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const index = parseInt(btn.dataset.dish);
    const dishElement = menuSection.children[index];
    dishElement.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

window.onload = showMenu;
