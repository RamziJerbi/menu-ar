// Données plats
const dishes = [
  { name: "Salata Mechouia", price: "5 DT", model: "models/salata-mechouia.glb" },
  { name: "Rouz", price: "7 DT", model: "models/rouz.glb" },
  { name: "Lasagne", price: "9 DT", model: "models/lasagne.glb" },
  { name: "Plat Mixte", price: "12 DT", model: "models/plat-mixte.glb" }
];

const menuSection = document.getElementById("menu");
const buttons = document.querySelectorAll(".menu-btn");

// Affichage menu complet
function showMenu() {
  menuSection.innerHTML = "";
  dishes.forEach((dish) => {
    const div = document.createElement("div");
    div.className = "dish";
    div.innerHTML = `
      <h3>${dish.name}</h3>
      <model-viewer src="${dish.model}" camera-controls auto-rotate ar></model-viewer>
      <div class="price">${dish.price}</div>
    `;
    menuSection.appendChild(div);
  });
}

// Scroll vers le plat sélectionné et marquer le bouton actif
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
