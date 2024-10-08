(() => {
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
                    nextTextarea.dispatchEvent(new Event('change'));
                }
                // sleep to allow events to trigger
                // new rows in "Run pipeline" page are added dynamically
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }

    async function reload() {
        // Remove all elements with the class 'chef-btn-recipe'
        document.querySelectorAll('.chef-btn-recipe')
            .forEach(element => element.remove());

        const branch = document.querySelector("span.gl-button-text.gl-w-full > span.gl-new-dropdown-button-text").textContent;

        // add buttons with recipes
        document.querySelectorAll('.btn').forEach((button) => button.classList.add('gl-mt-3', 'gl-mr-3'))
        const runPipelineButton = document.querySelector('[data-testid="run-pipeline-button"]');
        if (runPipelineButton) {
            const parentElement = runPipelineButton.parentElement;
            parentElement.classList.add('flex-wrap');

            (await allRecipes())
                .filter(recipe => {
                    if (!recipe.branch) {
                        return true
                    }
                    const regex = new RegExp(recipe.branch, 'g');
                    return regex.test(branch)
                })
                .forEach(recipe => {
                    const newButton = document.createElement('btn');
                    newButton.classList.add('btn', 'chef-btn-recipe', 'btn-default', 'btn-md', 'gl-button', 'gl-mr-3', 'gl-mt-3');
                    const span = document.createElement('span');
                    span.classList.add('gl-button-text');
                    const emoji = recipe.emoji || "👨‍🍳 "
                    span.textContent = emoji + " " + recipe.name;
                    newButton.appendChild(span);
                    // on click
                    newButton.addEventListener('click', (event) => {
                        event.stopPropagation();
                        recipeSelected(recipe).then();
                    });
                    // append
                    parentElement.appendChild(newButton);
                })
        }
    }

    async function init() {
        new Promise(r => setTimeout(r, 2000))
            .then(() => {
                document.querySelectorAll('[data-testid="base-dropdown-menu"] li.gl-new-dropdown-item')
                    .forEach(element =>
                        element.addEventListener('click', () => {
                            reload().then()
                        }))
            })

        await reload()
    }

    init().then()
})();
