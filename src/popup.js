function renderSets() {
    const setsContainer = document.getElementById("setsContainer").querySelector("tbody");
    setsContainer.innerHTML = "";
    const sets = JSON.parse(localStorage.getItem("sets")) || [];

    // Filter out sets with empty names or urls
    const filteredSets = sets.filter(set => set.name.trim() !== "" && set.url.trim() !== "");

    if (filteredSets.length === 0) {
        const noSetsMessage = document.createElement("p");
        noSetsMessage.textContent = "No links are defined, go to Options and add some links.";
        setsContainer.parentNode.insertBefore(noSetsMessage, setsContainer);
    } else {
        filteredSets.forEach((set, index) => {
            setsContainer.appendChild(createSetRow(set, index));
        });

        // Focus the last used input box
        const lastUsedInput = parseInt(localStorage.getItem("lastUsedInput"), 10) || 0;
        const inputFields = document.querySelectorAll(".input");
        if (inputFields[lastUsedInput]) {
            inputFields[lastUsedInput].focus();
            inputFields[lastUsedInput].select();
        }
    }
}

function createSetRow(set, index) {
    const row = document.createElement("tr");

    const labelCell = document.createElement("td");
    labelCell.textContent = set.name;
    row.appendChild(labelCell);

    const inputCell = document.createElement("td");
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.className = "input";
    inputField.dataset.setIndex = index;
    const enteredText = JSON.parse(localStorage.getItem("enteredText")) || [];
    inputField.value = enteredText[index] || "";
    inputCell.appendChild(inputField);
    row.appendChild(inputCell);

    inputField.addEventListener("input", function (event) {
        const setIndex = parseInt(event.target.dataset.setIndex, 10);
        enteredText[setIndex] = event.target.value;
        localStorage.setItem("enteredText", JSON.stringify(enteredText));
    });

    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            navigateButton.click();
        }
    });

    const buttonCell = document.createElement("td");
    const navigateButton = document.createElement("button");
    navigateButton.className = "navigate";
    navigateButton.textContent = "Open";
    navigateButton.tabIndex = -1;
    buttonCell.appendChild(navigateButton);
    row.appendChild(buttonCell);

    navigateButton.addEventListener("click", function () {
        const setIndex = parseInt(inputField.dataset.setIndex, 10);
        localStorage.setItem("lastUsedInput", setIndex);
        const sets = JSON.parse(localStorage.getItem("sets")) || [];
        if (sets[setIndex]) {
            const newUrl = sets[setIndex].url + inputField.value;
            const openInNewTab = JSON.parse(localStorage.getItem("openInNewTab"));
            if (openInNewTab) {
                chrome.tabs.create({ url: newUrl });
            } else {
                chrome.tabs.update({ url: newUrl });
            }
        }
    });

    return row;
}

document.addEventListener("DOMContentLoaded", function () {
    renderSets();

    var settingsIcon = document.querySelector('.settings');
    settingsIcon.addEventListener('click', function () {
        chrome.runtime.openOptionsPage();
    });
});
