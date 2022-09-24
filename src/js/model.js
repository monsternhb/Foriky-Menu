import { async } from 'regenerator-runtime';
import { getJson, sendJson } from './helpers.js';
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: {},
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookMarks: [],
};

const formatRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = formatRecipe(data);

    // check and fix bookmark everytime call API by bookmarkArray
    if (state.bookMarks.some(bookmark => bookmark.id === id))
      state.recipe.bookMarked = true;
    else {
      state.recipe.bookMarked = false;
    }
    console.log(state);
  } catch (err) {
    throw err;
  }
};

export const loadSearch = async function (query) {
  try {
    state.search.page = 1;
    state.search.query = query;
    const data = await getJson(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(el => {
      return {
        id: el.id,
        image: el.image_url,
        publisher: el.publisher,
        title: el.title,
        ...(el.key && { key: el.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateNewServing = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

export const addBookmark = function (recipe) {
  state.bookMarks.push(recipe);

  //Update property bookmark on recipe
  state.recipe.bookMarked = true;
  persistBookmark();
};

export const removeBookmark = function (id) {
  // Delete bookmark
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);

  //Update property bookmark on recipe
  if (id === state.recipe.id) state.recipe.bookMarked = false;

  persistBookmark();
};

const init = function () {
  const data = localStorage.getItem('bookmarks');

  if (data) state.bookMarks = JSON.parse(data);
};
init();

const clear = function () {
  localStorage.clear('bookmarks');
};

export const uploadNewRecipe = async function (newRecipe) {
  try {
    const ingredientsArr = Object.entries(newRecipe).filter(
      entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    );

    const ingredients = ingredientsArr.map(ing => {
      const data = ing[1].replaceAll(' ', '').split(',');

      // check right form data
      if (data.length !== 3) throw new Error('wrong ingredient format!!!');

      const { 0: quantity, 1: unit, 2: description } = { ...data };
      return {
        quantity: quantity ? +quantity : null,
        unit: unit,
        description: description,
      };
    });

    for (const property in newRecipe) {
      if (property.startsWith('ingredient')) delete newRecipe[property];
    }

    //prepare data
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJson(`${API_URL}/?key=${KEY}`, recipe);
    state.recipe = formatRecipe(data);
    addBookmark(state.recipe);
    console.log(state);
  } catch (err) {
    throw err;
  }
};
