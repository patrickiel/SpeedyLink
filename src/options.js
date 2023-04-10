function createSetElement(set, index, totalSets) {
    const container = document.createElement("div");
    container.classList.add("set-container");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.alignItems = "center";
    container.innerHTML = `
      <input type="text" class="setName" value="${set.name}" placeholder="Name" style="width: 30%;">
      <input type="text" class="setUrl" value="${set.url}" placeholder="URL" style="width: 70%;">
      <button class="deleteSet" ${totalSets <= 1 ? "disabled" : ""}>Delete</button>
    `;

    container.querySelector(".deleteSet").addEventListener("click", function () {
        const sets = JSON.parse(localStorage.getItem("sets")) || [];
        sets.splice(index, 1);
        localStorage.setItem("sets", JSON.stringify(sets));
        renderSets();
    });

    return container;
}

function renderSets() {
    const setsContainer = document.getElementById("sets");
    setsContainer.innerHTML = "";
    const sets = JSON.parse(localStorage.getItem("sets")) || [];

    // Ensure there is at least one set
    if (sets.length === 0) {
        sets.push({ name: "", url: "" });
    }

    sets.forEach((set, index) => {
        setsContainer.appendChild(createSetElement(set, index, sets.length));
    });

    // Enable or disable delete buttons based on the number of sets
    const deleteButtons = document.querySelectorAll(".deleteSet");
    deleteButtons.forEach((button) => {
        button.disabled = sets.length <= 1;
    });
}

function saveSets() {
    const setNameInputs = document.querySelectorAll(".setName");
    const setUrlInputs = document.querySelectorAll(".setUrl");
    const sets = [];

    setNameInputs.forEach((input, index) => {
        sets.push({
            name: input.value,
            url: setUrlInputs[index].value,
        });
    });

    localStorage.setItem("sets", JSON.stringify(sets));
}

document.addEventListener("DOMContentLoaded", function () {
    renderSets();

    document.getElementById("addSet").addEventListener("click", function () {
        saveOptions();
        const sets = JSON.parse(localStorage.getItem("sets")) || [];
        sets.push({ name: "", url: "" });
        localStorage.setItem("sets", JSON.stringify(sets));
        renderSets();
    });

    window.addEventListener("beforeunload", function () {
        saveOptions();
    });

    function saveOptions() {
        saveSets();
        saveOpenInNewTabSetting();
        saveStoreEnteredTextSetting();
    }

    loadOpenInNewTabSetting();
    loadStoreEnteredTextSetting();

    function saveOpenInNewTabSetting() {
        const openInNewTabCheckbox = document.getElementById("openInNewTab");
        localStorage.setItem("openInNewTab", JSON.stringify(openInNewTabCheckbox.checked));
    }

    function saveStoreEnteredTextSetting() {
        const storeEnteredTextCheckbox = document.getElementById("storeEnteredText");
        localStorage.setItem("storeEnteredText", JSON.stringify(storeEnteredTextCheckbox.checked));
    }

    function loadOpenInNewTabSetting() {
        const openInNewTabCheckbox = document.getElementById("openInNewTab");
        const openInNewTab = JSON.parse(localStorage.getItem("openInNewTab"));
        openInNewTabCheckbox.checked = openInNewTab !== null ? openInNewTab : true;
    }

    function loadStoreEnteredTextSetting() {
        const storeEnteredTextCheckbox = document.getElementById("storeEnteredText");
        const storeEnteredText = JSON.parse(localStorage.getItem("storeEnteredText"));
        storeEnteredTextCheckbox.checked = storeEnteredText !== null ? storeEnteredText : true;
    }
});