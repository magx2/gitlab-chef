document.addEventListener('DOMContentLoaded', function() {
    // Initialize with one empty variable input
    addVariable();

    // Event listener for adding a new variable
    document.getElementById('add-variable').addEventListener('click', addVariable);

    // Event listener for adding a new recipe
    document.getElementById('add-recipe').addEventListener('click', addRecipe);

    function addVariable() {
        const variablesDiv = document.getElementById('variables');
        const newVariable = document.createElement('div');
        newVariable.className = 'variable';
        newVariable.innerHTML = `
            <input type="text" class="key" placeholder="Enter key">
            <input type="text" class="value" placeholder="Enter value">
            <button class="remove-variable">Remove</button>
        `;
        variablesDiv.appendChild(newVariable);

        // Add event listener for the remove button
        newVariable.querySelector('.remove-variable').addEventListener('click', function() {
            newVariable.remove();
        });
    }

    function addRecipe() {
        const recipeName = document.getElementById('recipeName').value;
        const recipeEmoji = document.getElementById('recipeEmoji').value || '';
        const variables = document.querySelectorAll('.variable');
        let variableArray = [];

        variables.forEach(variable => {
            const key = variable.querySelector('.key').value;
            const value = variable.querySelector('.value').value;
            if (key && value) {
                variableArray.push({ key, value });
            }
        });

        if (recipeName) {
            const recipesDiv = document.getElementById('recipes');
            const newRecipe = document.createElement('div');
            newRecipe.className = 'recipe';
            newRecipe.innerHTML = `
                <h3>${recipeEmoji} ${recipeName}</h3>
                <ul>
                    ${variableArray.map(v => `<li><strong>${v.key}:</strong> ${v.value}</li>`).join('')}
                </ul>
            `;
            recipesDiv.appendChild(newRecipe);

            // Clear inputs after adding the recipe
            document.getElementById('recipeName').value = '';
            document.getElementById('recipeEmoji').value = '';
            document.querySelectorAll('.variable').forEach(variable => variable.remove());
            addVariable(); // Add a new empty variable input
        } else {
            alert('Please enter a recipe name.');
        }
    }
});
