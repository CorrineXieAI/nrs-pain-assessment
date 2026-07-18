const assessmentForm = document.querySelector("#assessment-form");
const scoreInput = document.querySelector("#pain-score");
const scoreNumber = document.querySelector("#score-number");
const scoreLabel = document.querySelector("#score-label");
const scoreCard = document.querySelector("#score-card");
const assessmentMessage = document.querySelector("#assessment-message");
const submitButton = document.querySelector("#submit-button");

function updateScoreDisplay() {
  const score = Number(scoreInput.value);
  const level = getPainLevel(score);

  scoreNumber.textContent = score;
  scoreLabel.textContent = painLevelLabels[level];
  scoreCard.dataset.level = level;
}

scoreInput.addEventListener("input", updateScoreDisplay);

assessmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = await requireUser();
  if (!user) return;

  submitButton.disabled = true;
  setMessage(assessmentMessage, "正在儲存評估……");

  const ageValue = document.querySelector("#age").value;
  const assessment = {
    user_id: user.id,
    participant_name: document
      .querySelector("#participant-name")
      .value.trim(),
    age: ageValue ? Number(ageValue) : null,
    biological_sex:
      document.querySelector("#biological-sex").value || null,
    pain_location: document
      .querySelector("#pain-location")
      .value.trim(),
    pain_score: Number(scoreInput.value),
    analgesic_used:
      document.querySelector("#analgesic-used").checked,
    notes: document.querySelector("#notes").value.trim() || null
  };

  const { error } = await db
    .from("pain_assessments")
    .insert(assessment);

  if (error) {
    console.error(error);
    setMessage(
      assessmentMessage,
      `儲存失敗：${error.message}`,
      "error"
    );
    submitButton.disabled = false;
    return;
  }

  setMessage(assessmentMessage, "評估已成功儲存。", "success");
  submitButton.disabled = false;

  setTimeout(() => {
    window.location.href = "./records.html";
  }, 700);
});

async function initialize() {
  if (showConfigurationWarning()) return;
  const user = await requireUser();
  if (!user) return;
  document.querySelector("#user-email").textContent = user.email;
  updateScoreDisplay();
}

initialize();
