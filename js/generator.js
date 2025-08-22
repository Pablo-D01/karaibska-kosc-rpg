document.addEventListener("DOMContentLoaded", function () {
  const attributeValues = [3, 2, 1, 0];
  const attributeSelects = document.querySelectorAll(".attribute-select");
  const skillInputs = document.querySelectorAll(".skill-input");
  const skillPointsSpan = document.getElementById("skill-points");
  const maxSkillPoints = 10;

  // Auto-rozszerzanie pola textarea
  const conceptTextarea = document.getElementById("char-concept");
  conceptTextarea.addEventListener("input", () => {
    conceptTextarea.style.height = "auto";
    conceptTextarea.style.height = conceptTextarea.scrollHeight + "px";
  });

  function populateAttributeOptions() {
    const selectedValues = Array.from(attributeSelects).map((s) =>
      s.value ? parseInt(s.value) : null
    );
    attributeSelects.forEach((select) => {
      const currentValue = select.value ? parseInt(select.value) : null;
      let options = `<option value="">Wybierz...</option>`;
      attributeValues.forEach((val) => {
        const isSelected = val === currentValue;
        const isDisabled = selectedValues.includes(val) && !isSelected;
        options += `<option value="${val}" ${isSelected ? "selected" : ""} ${
          isDisabled ? "disabled" : ""
        }>+${val}</option>`;
      });
      select.innerHTML = options;
    });
    updateCombatStats();
  }

  function updateCombatStats() {
    const sila = parseInt(document.getElementById("sila").value) || 0;
    const zrecznosc = parseInt(document.getElementById("zrecznosc").value) || 0;
    const pf = 10 + sila;
    const obrona = 8 + zrecznosc;
    const progBolu = Math.ceil(pf / 2);
    document.getElementById("pf-value").textContent = pf;
    document.getElementById("obrona-value").textContent = obrona;
    document.getElementById("prog-bolu-value").textContent = progBolu;
  }

  function updateSkillPoints() {
    let totalPoints = 0;
    skillInputs.forEach((input) => {
      totalPoints += parseInt(input.value);
    });
    const remainingPoints = maxSkillPoints - totalPoints;
    skillPointsSpan.textContent = remainingPoints;
    skillPointsSpan.style.color = remainingPoints < 0 ? "red" : "inherit";
    skillInputs.forEach((input) => {
      input.disabled = remainingPoints <= 0 && parseInt(input.value) === 0;
    });
  }

  attributeSelects.forEach((select) =>
    select.addEventListener("change", populateAttributeOptions)
  );
  skillInputs.forEach((input) =>
    input.addEventListener("input", updateSkillPoints)
  );

  function normalizeText(text) {
    const polishChars = {
      ą: "a",
      ć: "c",
      ę: "e",
      ł: "l",
      ń: "n",
      ó: "o",
      ś: "s",
      ź: "z",
      ż: "z",
      Ą: "A",
      Ć: "C",
      Ę: "E",
      Ł: "L",
      Ń: "N",
      Ó: "O",
      Ś: "S",
      Ź: "Z",
      Ż: "Z",
    };
    return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (match) => polishChars[match]);
  }

  document
    .getElementById("download-pdf")
    .addEventListener("click", function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const charName = normalizeText(
        document.getElementById("char-name").value || "Bezimienny Pirat"
      );
      const charConcept = normalizeText(
        document.getElementById("char-concept").value || "Brak opisu"
      );

      const attrs = {
        sila: document.getElementById("sila").value || "0",
        zrecznosc: document.getElementById("zrecznosc").value || "0",
        spryt: document.getElementById("spryt").value || "0",
        charyzma: document.getElementById("charyzma").value || "0",
      };
      const stats = {
        pf: document.getElementById("pf-value").textContent,
        obrona: document.getElementById("obrona-value").textContent,
        progBolu: document.getElementById("prog-bolu-value").textContent,
      };

      // --- STRONA 1: STATYSTYKI ---

      doc.setFontSize(24);
      doc.text(normalizeText("Karta Postaci - Karaibska Kosc"), 105, 20, {
        align: "center",
      });
      doc.setLineWidth(0.5);
      doc.line(15, 25, 195, 25);
      doc.setFontSize(12);
      doc.text(normalizeText("Imie / Ksywka:"), 20, 38);
      doc.text(charName, 55, 38);

      let currentY = 55;
      const col1X = 15;
      const col2X = 110;

      doc.setFontSize(16);
      doc.text(normalizeText("Atrybuty"), col1X, currentY);
      doc.rect(col1X, currentY + 5, 85, 35);
      doc.setFontSize(12);
      doc.text(normalizeText("Sila:"), col1X + 5, currentY + 13);
      doc.text(normalizeText("Zrecznosc:"), col1X + 5, currentY + 21);
      doc.text(normalizeText("Spryt:"), col1X + 5, currentY + 29);
      doc.text(normalizeText("Charyzma:"), col1X + 5, currentY + 37);
      doc.text(`+${attrs.sila}`, col1X + 35, currentY + 13);
      doc.text(`+${attrs.zrecznosc}`, col1X + 35, currentY + 21);
      doc.text(`+${attrs.spryt}`, col1X + 35, currentY + 29);
      doc.text(`+${attrs.charyzma}`, col1X + 35, currentY + 37);

      doc.setFontSize(16);
      doc.text(normalizeText("Cechy Bojowe"), col2X, currentY);
      doc.rect(col2X, currentY + 5, 85, 35);
      doc.setFontSize(12);
      doc.text(normalizeText("Punkty Fartu (PF):"), col2X + 5, currentY + 13);
      doc.text(normalizeText("Obrona:"), col2X + 5, currentY + 21);
      doc.text(normalizeText("Prog Bolu:"), col2X + 5, currentY + 29);
      doc.text(normalizeText("Punkty Brawury:"), col2X + 5, currentY + 37);
      doc.text(stats.pf, col2X + 55, currentY + 13);
      doc.text(stats.obrona, col2X + 55, currentY + 21);
      doc.text(stats.progBolu, col2X + 55, currentY + 29);
      doc.text("3", col2X + 55, currentY + 37);

      currentY += 55;

      doc.setFontSize(16);
      doc.text(normalizeText("Umiejetnosci"), col1X, currentY);
      const skillsBoxHeight = 80;
      doc.rect(col1X, currentY + 5, 180, skillsBoxHeight);
      doc.setFontSize(10);

      let yPos = currentY + 12;
      let currentX = col1X + 5;
      const columnWidth = 45;

      skillInputs.forEach((input) => {
        const skillValue = parseInt(input.value);
        if (skillValue > 0) {
          const skillName = normalizeText(input.dataset.skill);
          doc.text(`${skillName}: +${skillValue}`, currentX, yPos);
          yPos += 7;
          if (yPos > currentY + skillsBoxHeight) {
            yPos = currentY + 12;
            currentX += columnWidth;
          }
        }
      });

      currentY += skillsBoxHeight + 20;

      doc.setFontSize(16);
      doc.text(normalizeText("Ekwipunek i Notatki"), col1X, currentY);
      doc.rect(col1X, currentY + 5, 180, 40);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(col1X + 5, currentY + 15, 190, currentY + 15);
      doc.line(col1X + 5, currentY + 25, 190, currentY + 25);
      doc.line(col1X + 5, currentY + 35, 190, currentY + 35);

      // --- STRONA 2: OPIS POSTACI ---
      doc.addPage();
      doc.setFontSize(18);
      doc.text(normalizeText("Historia i Koncept Postaci"), 15, 20);
      doc.setLineWidth(0.5);
      doc.line(15, 23, 195, 23);

      doc.setFontSize(12);
      const conceptLinesPage2 = doc.splitTextToSize(charConcept, 180); // Szersze pole tekstowe
      doc.text(conceptLinesPage2, 15, 35);

      doc.save(`${charName.replace(/\s/g, "_")}_karta.pdf`);
    });

  populateAttributeOptions();
  updateSkillPoints();
});
