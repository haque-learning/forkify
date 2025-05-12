import * as model from './model.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchview.js';
import searchResultView from './views/searchresultview.js';
import paginationView from './views/paginationview.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // Getting id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Loading spinner
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Loading spinner
    searchResultView.renderSpinner();

    // Getting search query
    const query = searchView.getQuery();
    if (!query) return;

    // Loading search results
    await model.searchResults(query);

    // Rendering search results
    //searchResultView.render(model.state.search.results);
    searchResultView.render(model.getSearchResultsPage(6));

    // Rendering pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultView.renderError();
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
};
init();

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
