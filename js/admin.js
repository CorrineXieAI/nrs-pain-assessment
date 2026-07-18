const adminTableBody = document.querySelector("#admin-record-list");
const adminMessage = document.querySelector("#admin-message");

function appendCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "—";
  row.appendChild(cell);
}

async function loadAdminDashboard() {
  if (showConfigurationWarning()) return;
  const user = await requireUser();
  if (!user) return;

  const role = await getMyRole();
  if (role !== "admin") {
    await db.auth.signOut();
    window.location.replace("./index.html?error=not-admin");
    return;
  }

  document.querySelector("#admin-email").textContent = user.email;

  const { data, error } = await db
    .from("pain_assessments")
    .select(
      "id, participant_name, age, biological_sex, pain_location, pain_score, pain_level, analgesic_used, assessed_at"
    )
    .order("assessed_at", { ascending: false });

  if (error) {
    console.error(error);
    setMessage(adminMessage, `讀取失敗：${error.message}`, "error");
    return;
  }

  const average = data.length
    ? data.reduce((sum, item) => sum + item.pain_score, 0) /
      data.length
    : 0;

  document.querySelector("#total-count").textContent = data.length;
  document.querySelector("#average-score").textContent =
    average.toFixed(1);
  document.querySelector("#severe-count").textContent = data.filter(
    (item) => item.pain_score >= 7
  ).length;

  adminTableBody.replaceChildren();

  if (data.length === 0) {
    setMessage(adminMessage, "目前還沒有評估紀錄。");
    return;
  }

  adminMessage.textContent = "";

  data.forEach((record) => {
    const row = document.createElement("tr");
    appendCell(row, formatDate(record.assessed_at));
    appendCell(row, record.participant_name);
    appendCell(row, record.age);
    appendCell(row, sexLabels[record.biological_sex]);
    appendCell(row, record.pain_location);
    appendCell(row, `${record.pain_score} 分`);
    appendCell(row, painLevelLabels[record.pain_level]);
    appendCell(row, record.analgesic_used ? "是" : "否");
    adminTableBody.appendChild(row);
  });
}

loadAdminDashboard();
