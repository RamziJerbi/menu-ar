const apiURL = "https://script.google.com/macros/s/AKfycbzScHBR-eodNmcnfqoXyf_2gDMpsivtX3tQQv4lSFG4S4L5h4_mGOBGbngYyBhHy-Ai/exec"; // ton vrai lien ici

const menuContainer = document.getElementById('menu');
const modelViewer = document.getElementById('model3D');
const adminPanel = document.getElementById('adminPanel');
const adminBtn = document.getElementById('adminBtn');
const ajouterBtn = document.getElementById('ajouterBtn');

let isAdmin = false;

// ✅ Charger les plats depuis Google Sheet
async function chargerPlats() {
  const res = await fetch(apiURL);
  const plats = await res.json();
  afficherMenu(plats);
}

function afficherMenu(plats) {
  menuContainer.innerHTML = '';
  plats.forEach(plat => {
    const btn = document.createElement('button');
    btn.textContent = `${plat.Nom} - ${plat.Prix} DT`;
    btn.onclick = () => afficherModel(plat);
    menuContainer.appendChild(btn);
  });
}

function afficherModel(plat) {
  modelViewer.src = plat.Lien3D;
}

// ✅ Ajouter un plat (admin)
async function ajouterPlat() {
  const nom = document.getElementById('nom').value;
  const prix = document.getElementById('prix').value;
  const lien3D = document.getElementById('lien3D').value;
  const ingredients = document.getElementById('ingredients').value;

  await fetch(apiURL, {
    method: 'POST',
    body: JSON.stringify({ nom, prix, lien3D, ingredients }),
    headers: { 'Content-Type': 'application/json' }
  });

  alert("✅ Plat ajouté avec succès !");
  chargerPlats();
}

// ✅ Authentification admin
adminBtn.onclick = () => {
  const mdp = prompt("Mot de passe propriétaire :");
  if (mdp === "Prince2025") {
    isAdmin = true;
    adminPanel.classList.remove('hidden');
  } else {
    alert("❌ Mot de passe incorrect");
  }
};

ajouterBtn.onclick = ajouterPlat;

chargerPlats();
