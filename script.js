
// Define constants
const apiKey = '1bde67f0ac4289317c8c438bdc926b00'; // Replace with your Edamam API key
const apiUrl = 'https://api.edamam.com/api/recipes/v2';
let currentPage = 0;

// Function to fetch recipes for the current page
function fetchRecipes(query = '') {
    const params = {
        app_id: '0321f8e0', // Replace with your Edamam app ID
        app_key: apiKey,
        type: 'public',
        from: currentPage * 20, // Calculate starting index based on current page
        to: (currentPage + 1) * 20 - 1, // Calculate ending index based on current page
        q: query // Add the query parameter for search
    };

    // Construct URL with query parameters
    const url = `${apiUrl}?${$.param(params)}`;

    // Fetch recipes from Edamam API
    fetch(url)
        .then(response => response.json())
        .then(data => displayRecipes(data.hits))
        .catch(error => console.error('Error fetching recipes:', error));
}

// Function to display recipes in the HTML
function displayRecipes(recipes) {
    const recipeResults = document.getElementById('recipeResults');
    recipeResults.innerHTML = ''; // Clear previous results

    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${recipe.recipe.image}" class="card-img-top" alt="Recipe Image">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.recipe.label}</h5>
                        <p class="card-text">Calories: ${recipe.recipe.calories.toFixed(2)}</p>
                        <p class="card-text">Diet Labels: ${recipe.recipe.dietLabels.join(', ')}</p>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#recipeModal-${recipe.recipe.uri.split('_')[1]}">View Recipe</button>
                    </div>
                </div>
            </div>
        `;
        recipeResults.innerHTML += recipeCard;

        // Modal for recipe details
        const modal = `
            <div class="modal fade" id="recipeModal-${recipe.recipe.uri.split('_')[1]}" tabindex="-1" role="dialog" aria-labelledby="recipeModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="recipeModalLabel">${recipe.recipe.label}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img src="${recipe.recipe.image}" class="img-fluid mb-3" alt="Recipe Image">
                            <h6>Ingredients:</h6>
                            <ul>
                                ${recipe.recipe.ingredients.map(ingredient => `<li>${ingredient.text}</li>`).join('')}
                            </ul>
                            <p>Calories: ${recipe.recipe.calories.toFixed(2)}</p>
                            <p>Health Labels: ${recipe.recipe.healthLabels.join(', ')}</p>
                            <p>Diet Labels: ${recipe.recipe.dietLabels.join(', ')}</p>
                            <a href="${recipe.recipe.url}" target="_blank" class="btn btn-primary">Full Recipe</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modal);
    });

    // Update pagination text
    const paginationText = document.getElementById('paginationText');
    if (recipes.length > 0) {
        const start = currentPage * 20 + 1;
        const end = Math.min((currentPage + 1) * 20, start + recipes.length - 1);
        paginationText.textContent = `Show ${start}-${end} of ${end} `;
    } else {
        paginationText.textContent = 'No results found';
    }
}

// Event listener for previous button click
$('#prevBtn').click(function() {
    if (currentPage > 0) {
        currentPage--;
        fetchRecipes($('#query').val().trim());
        updatePaginationButtons();
    }
});

// Event listener for next button click
$('#nextBtn').click(function() {
    currentPage++;
    fetchRecipes($('#query').val().trim());
    updatePaginationButtons();
});

// Function to update pagination buttons based on current page
function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    if (currentPage === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }
}

// Event listener for recipe search form
// Event listener for recipe search form submission
$('#recipeSearchForm').submit(function(event) {
    event.preventDefault(); // Prevent default form submission
    const query = $('#query').val().trim();
    currentPage = 0; // Reset current page when performing a new search
    fetchRecipes(query);
});

// Initial fetch on page load
fetchRecipes();
