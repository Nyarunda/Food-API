import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear search field
export const clearSearchInput = () => {
    elements.searchInput.value = '';
};

// Clear the search result panel
export const clearResultpanel = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlighSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

// Algorithim to limit recipe title
const limitResipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        // return the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

// Function to render one recipe
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitResipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};
// Render buttons
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>    
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            
        </svg>
    </button>
`;

const renderButtons = (page, numResult, resPerPage) => {
    const pages = Math.ceil(numResult / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // next
        button = createButton(page, 'next');

    } else if (page < pages) {
        // Both buttons for previous and next page
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;

    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

// Function to receive te recipies array
// pagination
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Rende results to the page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    // Render pagination for results
    renderButtons(page, recipes.length, resPerPage);
};