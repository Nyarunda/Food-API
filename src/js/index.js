import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


/**
 * SEARCH CONTROLLER
 */

/**
 * Global state of the app
 * Search object
 * Current resipe object
 * Shopping list obje
 * Likes recipe
 */

const state = {};
window.state = state;
//
const controlSearch = async() => {
    // 1. Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search query
        state.search = new Search(query);

        // 3. Prepare UI for result
        searchView.clearSearchInput();
        searchView.clearResultpanel();
        renderLoader(elements.searchResult);
        try {
            // 4. Search for recipe
            await state.search.getSearchResult();

            // 5. Render resultd on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Server error while searching ...');
            // 5. Clear loader
            clearLoader();
        }

    }
}

/** 
 * Event listener for the form
 */
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResultpanel();
        searchView.renderResults(state.search.result, gotoPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async() => {
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if (id) {
        // Prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highligh selected id
        if (state.recipe) searchView.highlighSelected(id);
        // Create new recipe
        state.recipe = new Recipe(id);
        try {
            //Get recipe and parse ingrediend
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServing();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id),
            );
        } catch (error) {
            alert('Server error while processing data');
        }

    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
    // If NOT list creat new list
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};
/**
 * LIKE CONTROLLER
 */
state.likes = new Likes();
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;
    // If user has not liked recipe
    if (!state.likes.isLiked(currentID)) {
        // Add loke to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);
        // Add like to UI list
        console.log(state.likes);
        // User has liked the current rexipe
    } else {
        // Remove loke to state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);
        // Remove like from UI list
        console.log(state.likes)
    }
};

// Handling delete and update list item 
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Delete handle
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count--value')) {
        const data = parseFloat(e.target.value, 10);
        state.list.updateCount(id, data);
    }
});
// Hangling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.button-decrease, .button-decrease *')) {
        if (state.recipe.servings > 1) {
            // Increse button liked
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.button-increase, .button-increase *')) {
        //decrese button liked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingrdient to list
        controlList();
    } else if (e.target.matches('.recipe__love, recipe__love *')) {
        // Call the controlLike method
        controlLike();
    }
});