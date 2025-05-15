import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeview.js';
import searchView from './views/searchview.js';
import searchResultView from './views/searchresultview.js';
import paginationView from './views/paginationview.js';
import bookmarksView from './views/bookmarksview.js';
import addRecipeView from './views/addrecipeview.js';

import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; // polyfilling async/await

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

//==================
// RECIPE CONTROLLER
//==================
const controlRecipe = async function () {
  try {
    // Getting id
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update results view to mark selected search result
    searchResultView.update(model.getSearchResultsPage());

    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Loading spinner
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//==================
// SEARCH CONTROLLER
//==================
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
    searchResultView.render(model.getSearchResultsPage());

    // Rendering pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    searchResultView.renderError();
  }
};

//==================
// PAGINATION CONTROLLER
//==================
const controlPagination = function (goToPage) {
  // Rendering NEW search results
  searchResultView.render(model.getSearchResultsPage(goToPage));

  // Rendering NEW pagination buttons
  paginationView.render(model.state.search);
};

//==================
// SERVINGS CONTROLLER
//==================
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//==================
// BOOKMARKS CONTROLLER
//==================
const controlAddBookmarks = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update/Rendering bookmarks view
  recipeView.update(model.state.recipe);

  // Rendering bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//==================
// ADD RECIPE CONTROLLER
//==================
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
