(() => {
    const recipes = [
        {
            name: "Auto Release",
            variables: [
                {key: "RELEASE_AUTO", value: "true"},
                {key: "RELEASE_AUTO1", value: "true1"},
                {key: "RELEASE_AUTO2", value: "true2"},
            ]
        },
        {
            name: "Onion",
            emoji: "🧅",
            variables: [
                {key: "ME_NOT_LIKE", value: "tomato"},
                {key: "ME_LIKE", value: "onion"},
            ]
        }
    ]


    async function findRecipe(name) {
        for (const recipe of await allRecipes()) {
            if (recipe.name === name) {
                return recipe;
            }
        }
        return null;
    }

    async function allRecipes() {
        return (await browser.storage.local.get({
            recipes: []
        })).recipes
        // return recipes;
    }

    async function recipeSelected(recipe) {
        for (const variable of recipe.variables) {
            const allValueElements = Array.from(document.querySelectorAll('[data-testid="pipeline-form-ci-variable-key-field"]'));
            let valueElement = allValueElements.find(el => el.value === variable.key || el.value.trim() === '');
            // Check if the value element is empty
            if (valueElement) {
                valueElement.value = variable.key;
                const inputEvent = new Event('input', {bubbles: true});
                valueElement.dispatchEvent(inputEvent);
                const changeEvent = new Event('change', {bubbles: true});
                valueElement.dispatchEvent(changeEvent);

                const nextTextarea = valueElement?.nextElementSibling;
                if (nextTextarea && nextTextarea.tagName.toLowerCase() === 'textarea') {
                    nextTextarea.value = variable.value;
                }
                // sleep to allow events to trigger
                // new rows in "Run pipeline" page are added dynamically
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    // Remove all elements with the class 'chef-btn-recipe'
    document.querySelectorAll('.chef-btn-recipe')
        .forEach(element => element.remove());

    // add buttons with recipes
    const runPipelineButton = document.querySelector('[data-testid="run-pipeline-button"]');
    if (runPipelineButton) {
        const parentElement = runPipelineButton.parentElement;
        let promise = allRecipes();
        promise.then(recipes => {
            recipes.forEach(recipe => {
                const newButton = document.createElement('btn');
                //prepare
                newButton.classList.add('btn', 'chef-btn-recipe', 'btn-default', 'btn-md', 'gl-button', 'gl-ml-3');
                const span = document.createElement('span');
                span.classList.add('gl-button-text');
                const emoji = recipe.emoji || "👨‍🍳"
                span.textContent = emoji + " " + recipe.name;
                newButton.appendChild(span);
                // on click
                newButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    recipeSelected(recipe).then(() => {
                    });
                });
                // append
                parentElement.appendChild(newButton);
            })
        });
    }
})();
