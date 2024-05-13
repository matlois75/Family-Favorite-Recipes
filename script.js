let areRemoveIconsVisible = false;

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8VEGzoCAEFrLsfPu-1DDXztBXLjW8qUY",
  authDomain: "family-recipe-book-1a6b8.firebaseapp.com",
  databaseURL:
    "https://family-recipe-book-1a6b8-default-rtdb.firebaseio.com",
  projectId: "family-recipe-book-1a6b8",
  storageBucket: "family-recipe-book-1a6b8.appspot.com",
  messagingSenderId: "1038986529102",
  appId: "1:1038986529102:web:dec1a4d5d219d60ee8f61f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function loadPage(name) {
  location.href = `${name}.html`;
}
window.loadPage = loadPage;

function fetchRecipes(familyMember) {
  const recipesRef = ref(database, `${familyMember}/recipes`);
  onValue(recipesRef, (snapshot) => {
    const recipes = snapshot.val();
    const recipeList = document.getElementById('recipe-list');
    const btnRemove = document.getElementById('btn-remove');

    if (!recipes) {
      recipeList.innerHTML = '<tr><td colspan="3">No recipes found.</td></tr>';
      btnRemove.style.display = 'none';  // Hide the "Remove a Recipe" button if no recipes are left
      if (areRemoveIconsVisible) {
        toggleRemoveIcons();  // Call toggle if icons are still visible when no recipes are left
      }
      return;
    }

    recipeList.innerHTML = '';
    for (const key in recipes) {
        const recipe = recipes[key];
        const row = recipeList.insertRow(-1);
        const titleCell = row.insertCell(0);
        const linkCell = row.insertCell(1);
        const imageCell = row.insertCell(2);

        titleCell.innerHTML = `<img src='../removal-icon.png' alt='Remove' class='remove-icon' onclick='removeRecipe("${familyMember}", "${key}")' style='display: ${areRemoveIconsVisible ? 'inline' : 'none'}; cursor: pointer;'/> ${recipe.title}`;
        linkCell.innerHTML = `<a href="${recipe.link}" target="_blank">View Recipe</a>`;
        imageCell.innerHTML = `<img src="${recipe.image}" alt="${recipe.title}" style="width:100px;">`;
    }

    btnRemove.style.display = 'inline-block';
  });
}
window.fetchRecipes = fetchRecipes;

function showAddRecipeForm() {
  document.getElementById('addRecipeForm').style.display = 'block';
  document.getElementById('btn-add').style.display = 'none';
  document.getElementById('btn-remove').style.display = 'none';
}
window.showAddRecipeForm = showAddRecipeForm;

function addRecipe(familyMember) {
  const title = document.getElementById('recipeTitle').value;
  const link = document.getElementById('recipeLink').value;
  const image = document.getElementById('recipeImage').value;

  const recipesRef = ref(database, `${familyMember}/recipes`);
  const newRecipeRef = push(recipesRef); // Get a new reference for a child under 'recipes'
  set(newRecipeRef, {
      title: title,
      link: link,
      image: image
  })

  cancelRecipe(); // Reset form fields and hide the form
  fetchRecipes(familyMember);  
}
window.addRecipe = addRecipe;


function cancelRecipe() {
  document.getElementById('recipeTitle').value = '';
  document.getElementById('recipeLink').value = '';
  document.getElementById('recipeImage').value = '';
  document.getElementById('addRecipeForm').style.display = 'none';
  document.getElementById('btn-add').style.display = 'inline-block';
  document.getElementById('btn-remove').style.display = 'inline-block';
}
window.cancelRecipe = cancelRecipe;

function toggleRemoveIcons() {
  areRemoveIconsVisible = !areRemoveIconsVisible;  // Toggle the state
  const icons = document.getElementsByClassName('remove-icon');
  const displayStyle = areRemoveIconsVisible ? 'inline-block' : 'none';
  Array.from(icons).forEach(icon => {
      icon.style.display = displayStyle;
  });

  const btnAdd = document.getElementById('btn-add');
  const btnRemove = document.getElementById('btn-remove');
  if (areRemoveIconsVisible) {
    btnAdd.style.display = 'none';
    btnRemove.innerHTML = 'Done';
  } else {
    btnAdd.style.display = 'inline-block';
    btnRemove.innerHTML = 'Remove a Recipe';
  }
}
window.toggleRemoveIcons = toggleRemoveIcons;

function removeRecipe(familyMember, recipeKey) {
  const recipeRef = ref(database, `${familyMember}/recipes/${recipeKey}`);
  remove(recipeRef);
  fetchRecipes(familyMember);
}
window.removeRecipe = removeRecipe;

