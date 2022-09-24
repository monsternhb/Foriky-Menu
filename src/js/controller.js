import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import { TIME_CLOSE } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}
//No find recipe

const controlSearchResults = async function () {
  try {
    // 1. get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. get data json from query
    await model.loadSearch(query);

    // 2. rendering recipes on 1st page
    resultsView.render(model.getResultsPerPage());

    // 3. render pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    //loading spinner
    recipeView.renderingSpinner();

    // 0 Update results view to mark selected search result
    resultsView.update(model.getResultsPerPage());
    bookmarkView.update(model.state.bookMarks);

    // 1 loading recipe
    await model.loadRecipe(id);
    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // render results with the number of page
  resultsView.render(model.getResultsPerPage(goToPage));

  //  render pagination button

  paginationView.render(model.state.search);
};

const controlUpdateServing = function (newServing) {
  // Update data ingredients in state at model
  model.updateNewServing(newServing);

  // Rerender data into view
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  //Add bookmark
  if (!model.state.recipe.bookMarked) model.addBookmark(model.state.recipe);
  else {
    model.removeBookmark(model.state.recipe.id);
  }

  //Render bookmark on recipe
  recipeView.update(model.state.recipe);

  //Render on bookmark container
  bookmarkView.render(model.state.bookMarks);
};

const bookmarkRender = function () {
  bookmarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading Spinner
    addRecipeView.renderingSpinner();
    // Upload the new recipe data
    await model.uploadNewRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarkView.render(model.state.bookMarks);
    //Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form windown
    setTimeout(function () {
      addRecipeView.toogleForm();
    }, TIME_CLOSE * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerLoad(bookmarkRender);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addEventHandler(controlSearchResults);
  recipeView.addHandlerBookmark(controlBookmark);
  paginationView.addHandlerRender(controlPagination);
  recipeView.addHandlerUpdateServering(controlUpdateServing);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
};

init();
