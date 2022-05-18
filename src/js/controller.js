
import * as modal from "./modal.js"
import { MODAL_CLOSE_SEC } from "./config.js"
import recipeView from "./view/recipeView.js"
import searchView from "./view/searchView.js"
import resultsView from "./view/resultsView.js"
import peginationView from "./view/peginationView.js"
import bookmarkView from "./view/bookmarksView.js"
import addRecipeView from "./view/./addRecepieView.js"
import "core-js/stable"; // poliffing all code 
import "regenerator-runtime/runtime"; /// poliffing async and await 



// if (module.hot) {
//   module.hot.accept();
// } 

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return

    // Spiner 
    recipeView.renderSpiner();

    resultsView.update(modal.getSearchResultsPage());
    bookmarkView.update(modal.state.bookmarks);

    await modal.loadRecipe(id);
    const { recipe } = modal.state;

    // Recipe 
    console.log(modal.state.recipe);
    recipeView.render(modal.state.recipe);



  } catch (err) {
    recipeView.randerError();
  }
}

const controlSearchResults = async function () {
  try {

    resultsView.renderSpiner();

    const query = searchView.getQuery();


    searchView.clearInput();

    if (!query) return
    await modal.loadSearchResults(query);

    // resultsView.render(modal.state.search.results)
    console.log(resultsView.render());
    resultsView.render(modal.getSearchResultsPage());

    peginationView.render(modal.state.search)

  } catch (err) {
    console.log("Controller", err);
  }
}

const controlPagination = function (goToPage) {
  console.log(goToPage);

  resultsView.render(modal.getSearchResultsPage(goToPage));

  peginationView.render(modal.state.search)

}

const controlServings = function (updateTo) {
  modal.updateServings(updateTo)
  // Recipe 
  recipeView.update(modal.state.recipe);
  console.log(recipeView);
}

const controlAddBookmark = function () {



  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe)
  else modal.deleteBookmark(modal.state.recipe.id)
  recipeView.update(modal.state.recipe)
  bookmarkView.render(modal.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarkView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {

    addRecipeView.renderSpiner();

    await modal.uploadRecipe(newRecipe)

    recipeView.render(modal.state.recipe)

    addRecipeView.message();

    bookmarkView.render(modal.state.bookmarks);

    window.history.pushState(null, "", `#${modal.state.recipe.id}`)


    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)

  } catch (err) {
    console.error("😁😁💕😁", err);
    addRecipeView.randerError(err.message)
  }
}

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  peginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
  console.log("Welcone To Git");
}
init();
