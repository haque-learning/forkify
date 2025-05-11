import * as model from './model.js';
import recipeView from './views/recipeview.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // Getting id
    const id = window.location.hash.slice(1);
    if (!id) return;
    console.log(id);

    // Loading spinner
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
};
init();

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
