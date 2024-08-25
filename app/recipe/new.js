async function validateName(recipeName) {
    let nameInput = document.getElementById('name')
    let nameDuplicated = document.getElementById('name-duplicated')

    if (!recipeName || recipeName.trim() === "") {
        nameInput.classList.remove('is-valid');
        nameInput.classList.remove('is-invalid');
        nameDuplicated.classList.add('d-none');
        return false
    }

    const store = await (browser.storage.local.get({recipes: []}))
    const exists = store.recipes.filter(recipe => recipe.name === recipeName).length !== 0;
    if (exists) {
        nameInput.classList.add('is-invalid');
        nameInput.classList.remove('is-valid');
        nameDuplicated.classList.remove('d-none');
        return false
    } else {
        nameInput.classList.add('is-valid');
        nameInput.classList.remove('is-invalid');
        nameDuplicated.classList.add('d-none');
        return true
    }
}

function buildVariables() {
    const variables = document.querySelectorAll('.variable');
    let variableArray = [];

    variables.forEach(variable => {
        const key = variable.querySelector('.recipe-key').value;
        const value = variable.querySelector('.recipe-value').value;
        if (key || value) {
            variableArray.push({key, value});
        }
    });
    return variableArray;
}

async function validateVariables() {
    const variableArray = buildVariables()
    let noVariables = document.getElementById('no-variables')
    let keys = document.querySelectorAll('.recipe-key')
    let values = document.querySelectorAll('.recipe-value')
    if (variableArray.length === 0) {
        noVariables.classList.remove('d-none');
        keys.forEach(key => key.classList.add('is-invalid'));
        keys.forEach(key => key.classList.remove('is-valid'));
        values.forEach(value => value.classList.add('is-invalid'));
        values.forEach(value => value.classList.remove('is-valid'));
        return false
    } else {
        noVariables.classList.add('d-none');
        keys.forEach(key => key.classList.remove('is-invalid'));
        keys.forEach(key => key.classList.add('is-valid'));
        values.forEach(value => value.classList.remove('is-invalid'));
        values.forEach(value => value.classList.add('is-valid'));
        return true
    }
}

function init() {
    let nameInput = document.getElementById('name');
    nameInput.addEventListener("input", () => validateName(nameInput.value));

    document.getElementById('add-variable').addEventListener('click', addVariable);
    addVariable(true);

    document.getElementById('see-all').addEventListener('click', () => {
        browser.tabs.update({
            url: '/recipe/all.html'
        }).then();
    });

    function addVariable(first) {
        const variablesDiv = document.getElementById('variables');
        const newVariable = document.createElement('div');
        newVariable.className = 'form-group row mb-1 variable';
        const disabledTag = first === true ? 'disabled' : '';
        newVariable.innerHTML = `
                <div class="col-sm-2">&nbsp;</div>
                <div class="col-sm-4">
                    <input type="text" class="recipe-key form-control" placeholder="Key">
                </div>
                <div class="col-sm-4">
                    <input type="text" class="recipe-value form-control" placeholder="Value">
                </div>
                <div class="col-sm-2 text-end">
                    <button type="button" class="btn btn-danger" ${disabledTag}><span aria-hidden="true">&times;</span>
                </button>
                </div>
        `;
        variablesDiv.appendChild(newVariable);

        // Add event listener for the remove button
        newVariable.querySelector('button').addEventListener('click', function () {
            newVariable.remove();
        });
    }

    const form = document.getElementById('new-recipe-form');
    form.addEventListener('submit', addRecipe);

    async function addRecipe(event) {
        event.preventDefault();
        event.stopPropagation();

        const name = document.getElementById('name').value;
        const emoji = document.getElementById('emoji').value || '';
        const branch = document.getElementById('branch').value || '';
        let variableArray = buildVariables();


        const validVariables = await validateVariables().then()
        if (!validVariables) {
            return
        }

        const recipe = {
            name, emoji, branch,
            variables: variableArray.map(v => ({key: v.key, value: v.value})),
        }
        const store = await (browser.storage.local.get({recipes: []}))
        const valid = await validateName(recipe.name)
        if (valid) {
            store.recipes.push(recipe);
            store.recipes.sort((a, b) => a.name.localeCompare(b.name));
            await browser.storage.local.set(store)
            await browser.tabs.update({url: '/recipe/all.html'})
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
