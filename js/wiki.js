document.addEventListener("DOMContentLoaded", () => {
  const correctPassword = "KLĄTWA";
  const passwordOverlay = document.getElementById("password-overlay");
  const passwordInput = document.getElementById("password-input");
  const passwordSubmit = document.getElementById("password-submit");
  const mainContent = document.getElementById("main-content");
  const errorSound = document.getElementById("error-sound"); // Pobieramy element audio

  function checkPassword() {
    if (passwordInput.value.toUpperCase() === correctPassword) {
      passwordOverlay.style.opacity = "0";
      setTimeout(() => {
        passwordOverlay.style.display = "none";
      }, 500);
      mainContent.style.display = "block";
      initializeWiki();
    } else {
      // --- NOWA LINIA KODU ---
      errorSound.play(); // Odtwarzamy dźwięk błędu
      // --- KONIEC NOWEJ LINII ---

      passwordInput.classList.add("shake");
      passwordInput.value = "";
      setTimeout(() => {
        passwordInput.classList.remove("shake");
      }, 500);
    }
  }

  passwordSubmit.addEventListener("click", checkPassword);
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkPassword();
    }
  });

  // Cała logika wiki zostaje przeniesiona do tej funkcji
  async function initializeWiki() {
    const wikiContainer = document.getElementById("wiki-container");
    const searchInput = document.getElementById("search-input");
    let allEntries = [];

    async function loadData() {
      try {
        const response = await fetch("data.json");
        const data = await response.json();
        allEntries = [...data.postacie, ...data.przedmioty, ...data.lokacje];
        displayEntries(allEntries);
      } catch (error) {
        wikiContainer.innerHTML =
          '<p style="color: red;">Nie udało się załadować danych encyklopedii.</p>';
        console.error("Błąd wczytywania data.json:", error);
      }
    }

    function displayEntries(entries) {
      wikiContainer.innerHTML = "";
      if (entries.length === 0) {
        wikiContainer.innerHTML = "<p>Nic nie znaleziono.</p>";
        return;
      }
      entries.forEach((entry) => {
        const imageName = `${entry.tytul}-min.webp`;
        const imagePath = `img/${imageName}`;
        const entryElement = document.createElement("div");
        entryElement.className = "wiki-entry";
        entryElement.innerHTML = `
                    <div class="entry-header"><h2>${entry.tytul}</h2></div>
                    <div class="entry-body">
                        <img src="${imagePath}" alt="${entry.tytul}">
                        <p>${entry.opis}</p>
                    </div>`;
        wikiContainer.appendChild(entryElement);
      });
    }

    searchInput.addEventListener("keyup", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const filteredEntries = allEntries.filter((entry) =>
        entry.tytul.toLowerCase().includes(searchTerm)
      );
      displayEntries(filteredEntries);
    });

    wikiContainer.addEventListener("click", (event) => {
      const header = event.target.closest(".entry-header");
      if (header) {
        header.parentElement.classList.toggle("active");
      }
    });

    loadData();
  }
});
