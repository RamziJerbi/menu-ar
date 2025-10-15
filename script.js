// script.js

// Charger les plats depuis data.json et créer les cartes
async function loadMenu() {
  const response = await fetch('data.json');
  const plats = await response.json();
  const container = document.getElementById('menu-container');

  plats.forEach(plat => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="${plat.image}" alt="${plat.nom}">
      <h3>${plat.nom}</h3>
      <p>${plat.description}</p>
      <button onclick="showAR(${plat.id})">Voir en 3D / AR</button>
    `;
    container.appendChild(card);
  });
}

// Afficher le modèle 3D et AR
async function showAR(id) {
  const response = await fetch('data.json');
  const plats = await response.json();
  const plat = plats.find(p => p.id === id);

  // Masquer le menu
  document.getElementById('menu-container').classList.add('hidden');

  // Créer la section viewer si elle n'existe pas
  let viewerSection = document.getElementById('viewer');
  if (!viewerSection) {
    viewerSection = document.createElement('section');
    viewerSection.id = 'viewer';
    viewerSection.innerHTML = `
      <button id="backBtn">⬅ Retour au menu</button>
      <h2 id="platName"></h2>
      <model-viewer id="modelViewer" ar ar-modes="scene-viewer quick-look webxr" camera-controls auto-rotate></model-viewer>
    `;
    document.body.appendChild(viewerSection);

    document.getElementById('backBtn').addEventListener('click', () => {
      viewerSection.classList.add('hidden');
      document.getElementById('menu-container').classList.remove('hidden');
    });
  }

  viewerSection.classList.remove('hidden');
  document.getElementById('platName').textContent = plat.nom;
  const viewer = document.getElementById('modelViewer');
  viewer.src = plat.model;
  if (plat.ios_model) viewer.setAttribute('ios-src', plat.ios_model);
}

loadMenu();
