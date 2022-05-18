import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
// import { getJson, sendJSON } from "./helper.js";
import { AJAX } from "./helper.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}

const createDataObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        ...(recipe.key && { key: recipe.key })
    }
}

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

        state.recipe = createDataObject(data);

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else
            state.recipe.bookmarked = false;

    } catch (err) {
        console.error(`This Is error ${err}`);
        throw err;
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                image: rec.image_url,
                publisher: rec.publisher,
                ...(rec.key && { key: rec.key })
            }
        })
        state.search.page = 1;
    } catch (err) {
        console.error("FAlse Error");
        throw err;
    }
}

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;//0;
    const end = page * state.search.resultsPerPage;//9;
    return state.search.results.slice(start, end)

}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    });

    state.recipe.servings = newServings;
};


const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};


export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id)
    console.log(index);
    state.bookmarks.splice(index, 1)

    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}


const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "").map(ing => {
            const ingArr = ing[1].replaceAll(" ", "").split(',');
            if (ingArr.length !== 3)
                throw new Error(
                    'Wrong ingredient fromat! Please use the correct format :)'
                );
            const [quantity, unit, description] = ingArr
            return { quantity: quantity ? +quantity : null, unit, description }
        })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            cooking_time: +newRecipe.cookingTime,
            publisher: newRecipe.publisher,
            servings: +newRecipe.servings,
            ingredients,
        }
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
        state.recipe = createDataObject(data);
        addBookmark(state.recipe)
        console.log(state);
    } catch (err) {
        throw err;
    }
}