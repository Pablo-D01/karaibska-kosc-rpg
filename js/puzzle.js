document.addEventListener("DOMContentLoaded", () => {
  const riddles = [
    {
      question:
        "Mam zęby, lecz nie jem. Choć nie jestem statkiem, przecinam fale. Czym jestem?",
      answer: "GRZEBIEŃ",
    },
    {
      question: "Im więcej mnie zabierasz, tym większa się staję. Czym jestem?",
      answer: "DZIURA",
    },
    {
      question:
        "Czas ci ucieka - podpowiedź to miejscowość przez którą jechaliśmy dzisiaj",
      answer: "ŚWIECA",
    },
  ];

  let currentRiddleIndex = 0;

  const riddleTextArea = document.getElementById("riddle-text-area");
  const answerInput = document.getElementById("answer-input");
  const submitButton = document.getElementById("submit-answer");
  const riddleContainer = document.getElementById("riddle-container");
  const successMessage = document.getElementById("success-message");

  function displayRiddle() {
    if (currentRiddleIndex < riddles.length) {
      riddleTextArea.textContent = riddles[currentRiddleIndex].question;
    } else {
      // Wszystkie zagadki rozwiązane
      riddleContainer.classList.add("hidden");
      successMessage.classList.remove("hidden");
    }
  }

  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toUpperCase();
    if (userAnswer === riddles[currentRiddleIndex].answer) {
      // Poprawna odpowiedź
      const lock = document.getElementById(`lock${currentRiddleIndex + 1}`);
      lock.textContent = "🔓";
      lock.classList.add("unlocked");

      currentRiddleIndex++;
      answerInput.value = "";
      displayRiddle();
    } else {
      // Błędna odpowiedź
      riddleContainer.classList.add("shake");
      setTimeout(() => {
        riddleContainer.classList.remove("shake");
      }, 500);
    }
  }

  submitButton.addEventListener("click", checkAnswer);
  answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });

  // Wyświetl pierwszą zagadkę
  displayRiddle();
});
