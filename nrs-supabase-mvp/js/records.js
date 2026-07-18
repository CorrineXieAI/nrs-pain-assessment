const recordList = document.querySelector("#record-list");
const recordMessage = document.querySelector("#record-message");

function createRecordCard(record) {
  const article = document.createElement("article");
  article.className = "record-card";

  const top = document.createElement("div");
  top.className = "record-top";

  const score = document.createElement("strong");
  score.className = `score-badge ${record.pain_level}`;
  score.textContent = `${record.pain_score} 分`;

  const time = document.createElement("time");
  time.textContent = formatDate(record.assessed_at);

  top.append(score, time);

  const title = document.createElement("h2");
  title.textContent = record.pain_location;

  const level = document.createElement("p");
  level.textContent = painLevelLabels[record.pain_level];

  const details = document.createElement("p");
  details.className = "muted";
  details.textContent =
    `止痛藥：${record.analgesic_used ? "有使用" : "未使用"}` +
    (record.notes ? `｜備註：${record.notes}` : "");

  article.append(top, title, level, details);
  return article;
}

async function loadRecords() {
  if (showConfigurationWarning()) return;
  const user = await requireUser();
  if (!user) return;

  document.querySelector("#user-email").textContent = user.email;

  const { data, error } = await db
    .from("pain_assessments")
    .select(
      "id, pain_location, pain_score, pain_level, analgesic_used, notes, assessed_at"
    )
    .order("assessed_at", { ascending: false });

  if (error) {
    console.error(error);
    setMessage(recordMessage, `讀取失敗：${error.message}`, "error");
    return;
  }

  recordList.replaceChildren();

  if (data.length === 0) {
    setMessage(recordMessage, "目前還沒有評估紀錄。");
    return;
  }

  recordMessage.textContent = "";
  data.forEach((record) => {
    recordList.appendChild(createRecordCard(record));
  });
}

loadRecords();
