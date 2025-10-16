let platsData = [];
let isAdmin = false;

// Charger les plats
async function loadMenu() {
  const response = await fetch('data.json');
  platsData = await response.json();

  const savedPlats = JSON.parse(localStorage.getItem('platsAdded')) || [];
  platsData = platsData.concat(savedPlats);

  renderMenu();
}

// Afficher le menu
function renderMenu() {
  const container = document.getElementById('menu-container');
  const nav = document.getElementById('menu-nav');
  container.innerHTML = '';
  nav.innerHTML = '';

  platsData.forEach(plat => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${plat.nom}</h3>
      <p>${plat.description}</p>
      <div class="price">${plat.prix} DT</div>
      <button class="viewBtn" onclick="showAR(${plat.id})">Voir en 3D / AR</button>
    `;
    container.appendChild(card);

    const menuBtn = document.createElement('button');
    menuBtn.textContent = plat.nom;
    menuBtn.addEventListener('click', () => showAR(plat.id));
    nav.appendChild(menuBtn);
  });
}

// Afficher modèle 3D
function showAR(id) {
  const plat = platsData.find(p => p.id === id);
  if (!plat) return;

  document.getElementById('viewer').classList.remove('hidden');
  document.getElementById('platName').textContent = plat.nom;
  const viewer = document.getElementById('modelViewer');
  viewer.src = plat.model;
  viewer.setAttribute('ios-src', plat.ios_model);
  viewer.scrollIntoView({ behavior: 'smooth' });
}

// Retour
document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('viewer').classList.add('hidden');
  document.getElementById('menu-container').scrollIntoView({ behavior: 'smooth' });
});

// Connexion admin
document.getElementById('loginBtn').addEventListener('click', () => {
  const pwd = prompt('Entrez le mot de passe administrateur :');
  if (pwd === 'PrinceAdmin2025') {
    isAdmin = true;
    alert('Connexion réussie !');
    document.getElementById('addPlatBtn').classList.remove('hidden');
  } else {
    alert('Mot de passe incorrect.');
  }
});

// Afficher le formulaire
document.getElementById('addPlatBtn').addEventListener('click', () => {
  document.getElementById('addFormSection').classList.toggle('hidden');
});

// Ajouter un plat
document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();

  const newPlat = {
    id: Date.now(),
    nom: document.getElementById('nom').value,
    description: document.getElementById('description').value,
    prix: parseFloat(document.getElementById('prix').value),
    model: document.getElementById('model').value,
    ios_model: document.getElementById('ios_model').value,
    ingredients: document.getElementById('ingredients').value.split(',').map(s => s.trim())
  };

  const savedPlats = JSON.parse(localStorage.getItem('platsAdded')) || [];
  savedPlats.push(newPlat);
  localStorage.setItem('platsAdded', JSON.stringify(savedPlats));

  platsData.push(newPlat);
  renderMenu();

  document.getElementById('addForm').reset();
  alert('✅ Plat ajouté avec succès !');
});

loadMenu();
