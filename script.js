// script.js

let currentSelected = null;

async function loadMenu() {
  const response = await fetch('data.json');
  const plats = await response.json();
  const container = document.getElementById('menu-container');

  plats.forEach(plat => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${plat.nom}</h3>
      <p>${plat.description}</p>
      <div class="price">${plat.prix} DT</div>
      <button onclick="showAR(${plat.id})">Voir en 3D / AR</button>
    `;
    container.appendChild(card);
  });
}

async function showAR(id) {
  const response = await fetch('data.json');
  const plats = await response.json();
  const plat = plats.find(p => p.id === id);

  if (currentSelected) currentSelected.classList.remove('selected');

  const cards = document.querySelectorAll('.card');
  currentSelected = Array.from(cards).find(c => c.querySelector('button').onclick.toString().includes(`showAR(${id})`));
  if (currentSelected) currentSelected.classList.add('selected');

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
      if (currentSelected) currentSelected.classList.remove('selected');
      document.getElementById('menu-container').scrollIntoView({ behavior: 'smooth' });
    });
  }

  viewerSection.classList.remove('hidden');
  document.getElementById('platName').textContent = plat.nom;
  const viewer = document.getElementById('modelViewer');
  viewer.src = plat.model;
  if (plat.ios_model) viewer.setAttribute('ios-src', plat.ios_model);

  viewerSection.scrollIntoView({ behavior: 'smooth' });
}

loadMenu();
