 // Edamam API Configuration
        const APP_ID = '74a38f82';
        const APP_KEY = '4c7f19ab13ca124e75268a975c69ed5a';
        const BASE_URL = 'https://api.edamam.com/api/recipes/v2';

        let isLoading = false;
        let currentRecipes = [];

        async function searchRecipes() {
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const recipesGrid = document.getElementById('recipesGrid');
            const query = searchInput.value.trim();

            if (!query) {
                recipesGrid.innerHTML = '<div class="error-message">Please enter a search term</div>';
                return;
            }

            isLoading = true;
            searchButton.disabled = true;
            recipesGrid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching for recipes...</div>';

            try {
                const response = await fetch(
                    `${BASE_URL}?type=public&q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}&health=vegetarian`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch recipes');
                }

                const data = await response.json();
                currentRecipes = data.hits;
                displayRecipes(data.hits);
            } catch (error) {
                recipesGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i> Failed to load recipes. Please try again later.
                    </div>
                `;
                console.error('Error fetching recipes:', error);
            } finally {
                isLoading = false;
                searchButton.disabled = false;
            }
        }

        function displayRecipes(recipes) {
            const recipesGrid = document.getElementById('recipesGrid');

            if (!recipes || recipes.length === 0) {
                recipesGrid.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-search"></i> No recipes found. Try a different search term.
                    </div>
                `;
                return;
            }

            const recipeCards = recipes.map(({ recipe }, index) => `
                <div class="recipe-card" onclick="showRecipeDetails(${index})">
                    <div class="recipe-image-container">
                        <img src="${recipe.image || '/api/placeholder/400/300'}" alt="${recipe.label}" class="recipe-image">
                    </div>
                    <div class="recipe-content">
                        <h2 class="recipe-title">${recipe.label}</h2>
                        <div class="recipe-info">
                            <span class="info-item">
                                <i class="fas fa-fire"></i> ${Math.round(recipe.calories)} cal
                            </span>
                            <span class="info-item">
                                <i class="fas fa-list"></i> ${recipe.ingredients.length} ingredients
                            </span>
                        </div>
                        <div class="recipe-tags">
                            ${recipe.dietLabels.map(label => `<span class="tag">${label}</span>`).join('')}
                            ${recipe.cuisineType.map(cuisine => `<span class="tag">${cuisine}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');

            recipesGrid.innerHTML = recipeCards;
        }

        function showRecipeDetails(index) {
            const recipe = currentRecipes[index].recipe;
            const modal = document.getElementById('recipeModal');
            const detailsContent = document.getElementById('recipeDetails');

            detailsContent.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.label}">
                <h2>${recipe.label}</h2>
                
                <div class="recipe-stats">
                    <div class="stat-item">
                        <i class="fas fa-fire"></i>
                        <p>${Math.round(recipe.calories)} calories</p>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <p>${recipe.totalTime || 'N/A'} mins</p>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-users"></i>
                        <p>${recipe.yield} servings</p>
                    </div>
                </div>

                <div class="ingredients-list">
                    <h3>Ingredients</h3>
                    <ul>
                       <!-- Previous code remains the same until ingredients list -->
                        ${recipe.ingredients.map(ing => `
                            <li><i class="fas fa-check"></i> ${ing.text}</li>
                        `).join('')}
                    </ul>
                </div>

                <div class="instructions-list">
                    <h3>Cooking Instructions</h3>
                    <a href="${recipe.url}" target="_blank" class="recipe-link">
                        <i class="fas fa-external-link-alt"></i> View Full Recipe Instructions
                    </a>
                </div>

                <div class="recipe-tags">
                    <h3>Diet & Health Labels</h3>
                    <div class="recipe-tags">
                        ${recipe.dietLabels.map(label => `<span class="tag">${label}</span>`).join('')}
                        ${recipe.healthLabels.map(label => `<span class="tag">${label}</span>`).join('')}
                    </div>
                </div>

                <div class="recipe-nutrition">
                    <h3>Nutrition Information</h3>
                    <div class="recipe-stats">
                        <div class="stat-item">
                            <i class="fas fa-weight"></i>
                            <p>${Math.round(recipe.totalNutrients?.PROCNT?.quantity || 0)}g protein</p>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-bread-slice"></i>
                            <p>${Math.round(recipe.totalNutrients?.CHOCDF?.quantity || 0)}g carbs</p>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-oil-can"></i>
                            <p>${Math.round(recipe.totalNutrients?.FAT?.quantity || 0)}g fat</p>
                        </div>
                    </div>
                </div>
            `;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('recipeModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('recipeModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Add enter key support for search
        document.getElementById('searchInput').addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && !isLoading) {
                searchRecipes();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
