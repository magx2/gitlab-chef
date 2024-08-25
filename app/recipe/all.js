function removeRecipe(recipeName) {
    browser.storage.local.get({recipes: []})
        .then(store => {
            const recipes = store.recipes.filter(recipe => recipe.name !== recipeName);
            browser.storage.local.set({recipes}).then()

            loadTable();
        })
}

function loadTable() {
    let idx = 1;
    let table = document.querySelector('tbody');
    table.innerHTML = ''
    browser.storage.local.get({recipes: []})
        .then(store => store.recipes.forEach(recipe => {
            const variables = recipe.variables
                .map(variable => (variable.key || "&ltnone&gt;") + "=" + (variable.value || "&ltnone&gt;"))
                .join("; ")
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <th scope="row">${idx++}</th>
            <td>${recipe.emoji}</td>
            <td>${recipe.name}</td>
            <td><code>${recipe.branch}</code></td>
            <td>${variables}</td>
            <td><button class="remove btn btn-danger"><span aria-hidden="true">&times;</span></button></td>`;
            tr.querySelector('button.remove').addEventListener('click', function () {
                removeRecipe(recipe.name)
            });

            table.appendChild(tr);
        }));
}

function init() {
    loadTable()
    document.getElementById('add-recipe')
        .addEventListener('click', () => {
            browser.tabs.update({
                url: '/recipe/new.html'
            }).then();
        })
}

document.addEventListener('DOMContentLoaded', init);
