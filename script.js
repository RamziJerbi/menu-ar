let currentSelected = null;

async function loadMenu() {
  const response = await fetch('data.json');
  const plats = await response.json();

  const container = document.getElementById('menu-container');
  const nav = document.getElementById('menu-nav');

  plats.forEach(plat => {
    // Créer la carte du plat
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${plat.nom}</h3>
      <p>${plat.description}</p>
      <div class="price">${plat.prix} DT</div>
      <button class="viewBtn" onclick="showAR(${plat.id})">Voir en 3D / AR</button>
    `;
    container.appendChild(card);

    // Créer le bouton du menu fixe
    const menuBtn = document.createElement('button');
    menuBtn.textContent = plat.nom;
    menuBtn.addEventListener('click', () => {
      showAR(plat.id);
      setActiveMenu(menuBtn);
    });
    nav.appendChild(menuBtn);
  });
}

function setActiveMenu(btn) {
  const allBtns = document.querySelectorAll('#menu-nav button');
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

async function showAR(id) {
  const response = await fetch('data.json');
  const plats = await response.json();
  const plat = plats.find(p => p.id === id);

  // Désélectionner la précédente carte
  if (currentSelected) currentSelected.classList.remove('selected');

  const cards = document.querySelectorAll('.card');
  currentSelected = Array.from(cards).find(c => c.querySelector('button').onclick.toString().includes(`showAR(${id})`));
  if (currentSelected) currentSelected.classList.add('selected');

  // Section viewer
  const viewerSection = document.getElementById('viewer');
  viewerSection.classList.remove('hidden');

  document.getElementById('platName').textContent = plat.nom;
  const viewer = document.getElementById('modelViewer');
  viewer.src = plat.model;
  if (plat.ios_model) viewer.setAttribute('ios-src', plat.ios_model);

  // Scroll fluide
  viewerSection.scrollIntoView({ behavior: 'smooth' });
}

loadMenu();

// Retour au menu
document.getElementById('backBtn').addEventListener('click', () => {
  const viewerSection = document.getElementById('viewer');
  viewerSection.classList.add('hidden');
  if (currentSelected) currentSelected.classList.remove('selected');
  document.getElementById('menu-container').scrollIntoView({ behavior: 'smooth' });

  // Retirer la sélection dans le menu fixe
  const allBtns = document.querySelectorAll('#menu-nav button');
  allBtns.forEach(b => b.classList.remove('active'));
});
