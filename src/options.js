function createSetElement(set, index, totalSets) {
    const container = document.createElement("div");
    container.classList.add("set-container");

    container.innerHTML = `
      <input type="text" class="setName" value="${set.name}" placeholder="Name">
      <input type="text" class="setUrl" value="${set.url}" placeholder="URL">
      <button class="deleteSet" ${totalSets <= 1 ? "disabled" : ""}>Delete</button>
    `;

    const setNameInput = container.querySelector(".setName");
    const setUrlInput = container.querySelector(".setUrl");

    setNameInput.addEventListener("input", saveSets);
    setUrlInput.addEventListener("input", saveSets);

    container.querySelector(".deleteSet").addEventListener("click", function () {
        saveSets();
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

    if (sets.length === 0) {
        sets.push({ name: "", url: "" });
        localStorage.setItem("sets", JSON.stringify(sets));
    }

    sets.forEach((set, index) => {
        setsContainer.appendChild(createSetElement(set, index, sets.length));
    });

    const deleteButtons = document.querySelectorAll(".deleteSet");
    deleteButtons.forEach((button) => {
        button.disabled = sets.length <= 1;
    });
}

function saveSets() {
    const sets = readSets();
    localStorage.setItem("sets", JSON.stringify(sets));
}

function readSets() {
    const setNameInputs = document.querySelectorAll(".setName");
    const setUrlInputs = document.querySelectorAll(".setUrl");
    const sets = [];

    setNameInputs.forEach((input, index) => {
        sets.push({
            name: input.value,
            url: setUrlInputs[index].value,
        });
    });
    return sets;
}

function addSet() {
    const sets = readSets();
    sets.push({ name: "", url: "" });
    localStorage.setItem("sets", JSON.stringify(sets));
    renderSets();
}

document.addEventListener("DOMContentLoaded", function () {
    renderSets();

    document.getElementById("addSet").addEventListener("click", addSet);

    loadOpenInCurrentTabSetting();

    function loadOpenInCurrentTabSetting() {
        const openInCurrentTabCheckbox = document.getElementById("openInCurrentTab");
        const openInCurrentTab = JSON.parse(localStorage.getItem("openInCurrentTab"));
        openInCurrentTabCheckbox.checked = openInCurrentTab !== null ? openInCurrentTab : false;
        openInCurrentTabCheckbox.addEventListener("change", saveOpenInCurrentTabSetting);
    }

    function saveOpenInCurrentTabSetting() {
        const openInCurrentTabCheckbox = document.getElementById("openInCurrentTab");
        localStorage.setItem("openInCurrentTab", JSON.stringify(openInCurrentTabCheckbox.checked));
    }
});