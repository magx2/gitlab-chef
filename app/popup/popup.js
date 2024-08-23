function listenForClicks() {
    document.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }
        let url;
        switch (e.target.id) {
            case "all":
                url = "/recipe/all.html";
                break;
            case "new":
                url = "/recipe/new.html";
                break;
            default:
                return;
        }
        browser.tabs.create({url}).then();
    })
}

listenForClicks();
