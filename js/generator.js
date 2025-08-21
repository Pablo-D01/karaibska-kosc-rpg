document.addEventListener("DOMContentLoaded", function () {
  const attributeValues = [3, 2, 1, 0];
  const attributeSelects = document.querySelectorAll(".attribute-select");
  const skillInputs = document.querySelectorAll(".skill-input");
  const skillPointsSpan = document.getElementById("skill-points");
  const maxSkillPoints = 10;
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
      doc.setFontSize(24);
      doc.text(normalizeText("Karta Postaci - Karaibska Kość"), 105, 20, {
        align: "center",
      });
      doc.setLineWidth(0.5);
      doc.line(15, 25, 195, 25);
      doc.setFontSize(12);
      doc.setLineWidth(0.2);
      doc.rect(15, 30, 180, 20);
      doc.text(normalizeText("Imię / Ksywka:"), 20, 38);
      doc.text(charName, 55, 38);
      doc.text(normalizeText("Koncept Postaci:"), 20, 46);
      doc.text(charConcept, 55, 46);
      const col1X = 15;
      const col2X = 110;
      doc.setFontSize(16);
      doc.text(normalizeText("Atrybuty"), col1X, 65);
      doc.rect(col1X, 70, 85, 35);
      doc.setFontSize(12);
      doc.text(normalizeText("Siła:"), col1X + 5, 78);
      doc.text(normalizeText("Zręczność:"), col1X + 5, 86);
      doc.text(normalizeText("Spryt:"), col1X + 5, 94);
      doc.text(normalizeText("Charyzma:"), col1X + 5, 102);
      doc.text(`+${attrs.sila}`, col1X + 35, 78);
      doc.text(`+${attrs.zrecznosc}`, col1X + 35, 86);
      doc.text(`+${attrs.spryt}`, col1X + 35, 94);
      doc.text(`+${attrs.charyzma}`, col1X + 35, 102);
      doc.setFontSize(16);
      doc.text(normalizeText("Cechy Bojowe"), col2X, 65);
      doc.rect(col2X, 70, 85, 35);
      doc.setFontSize(12);
      doc.text(normalizeText("Punkty Fartu (PF):"), col2X + 5, 78);
      doc.text(normalizeText("Obrona:"), col2X + 5, 86);
      doc.text(normalizeText("Próg Bólu:"), col2X + 5, 94);
      doc.text(normalizeText("Punkty Brawury:"), col2X + 5, 102);
      doc.text(stats.pf, col2X + 50, 78);
      doc.text(stats.obrona, col2X + 50, 86);
      doc.text(stats.progBolu, col2X + 50, 94);
      doc.text("3", col2X + 50, 102);
      doc.setFontSize(16);
      doc.text(normalizeText("Umiejętności"), col1X, 120);
      doc.rect(col1X, 125, 180, 100);
      doc.setFontSize(10);
      let yPos = 132;
      let currentX = col1X + 5;
      const columnWidth = 45;
      skillInputs.forEach((input) => {
        const skillValue = parseInt(input.value);
        if (skillValue > 0) {
          const skillName = normalizeText(input.dataset.skill);
          doc.text(`${skillName}: +${skillValue}`, currentX, yPos);
          yPos += 7;
          if (yPos > 220) {
            yPos = 132;
            currentX += columnWidth;
          }
        }
      });
      doc.setFontSize(16);
      doc.text(normalizeText("Ekwipunek i Notatki"), col1X, 240);
      doc.rect(col1X, 245, 180, 40);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(col1X + 5, 255, 190, 255);
      doc.line(col1X + 5, 265, 190, 265);
      doc.line(col1X + 5, 275, 190, 275);
      doc.save(`${charName.replace(/\s/g, "_")}_karta.pdf`);
    });
  populateAttributeOptions();
  updateSkillPoints();
});
