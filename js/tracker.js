document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("char-name");
  const initiativeInput = document.getElementById("char-initiative");
  const addButton = document.getElementById("add-char-btn");
  const trackerList = document.getElementById("tracker-list");
  const startButton = document.getElementById("start-btn");
  const nextButton = document.getElementById("next-btn");
  const resetButton = document.getElementById("reset-btn");
  let combatants = [];
  let currentIndex = -1;
  let combatStarted = false;
  function renderList() {
    trackerList.innerHTML = "";
    combatants.forEach((char, index) => {
      const li = document.createElement("li");
      li.className = "tracker-item";
      if (index === currentIndex) {
        li.classList.add("active");
      }
      li.dataset.id = char.id;
      li.innerHTML = `<span class="item-name">${char.name}</span><span class="item-initiative">${char.initiative}</span><button class="item-remove" title="Usuń postać">✖</button>`;
      trackerList.appendChild(li);
    });
  }
  function sortCombatants() {
    combatants.sort((a, b) => b.initiative - a.initiative);
  }
  function addCombatant() {
    const name = nameInput.value.trim();
    const initiative = parseInt(initiativeInput.value);
    if (name && !isNaN(initiative)) {
      combatants.push({ id: Date.now(), name, initiative });
      sortCombatants();
      if (combatStarted && currentIndex > -1) {
        const activeCombatantId =
          trackerList.querySelector(".active")?.dataset.id;
        currentIndex = combatants.findIndex((c) => c.id == activeCombatantId);
      }
      renderList();
      nameInput.value = "";
      initiativeInput.value = "";
      nameInput.focus();
    }
  }
  function startCombat() {
    if (combatants.length > 0) {
      combatStarted = true;
      currentIndex = 0;
      startButton.disabled = true;
      nextButton.disabled = false;
      renderList();
    }
  }
  function nextTurn() {
    if (combatStarted) {
      currentIndex = (currentIndex + 1) % combatants.length;
      renderList();
    }
  }
  function resetCombat() {
    combatants = [];
    currentIndex = -1;
    combatStarted = false;
    startButton.disabled = false;
    nextButton.disabled = true;
    renderList();
  }
  addButton.addEventListener("click", addCombatant);
  initiativeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addCombatant();
  });
  trackerList.addEventListener("click", (e) => {
    if (e.target.classList.contains("item-remove")) {
      const idToRemove = parseInt(e.target.parentElement.dataset.id);
      combatants = combatants.filter((c) => c.id !== idToRemove);
      if (combatStarted && currentIndex > -1) {
        const activeCombatantId =
          trackerList.querySelector(".active")?.dataset.id;
        if (activeCombatantId) {
          currentIndex = combatants.findIndex((c) => c.id == activeCombatantId);
          if (currentIndex === -1 && combatants.length > 0) {
            currentIndex = 0;
          }
        } else if (combatants.length > 0) {
          currentIndex = 0;
        } else {
          resetCombat();
        }
      }
      renderList();
    }
  });
  startButton.addEventListener("click", startCombat);
  nextButton.addEventListener("click", nextTurn);
  resetButton.addEventListener("click", resetCombat);
});
