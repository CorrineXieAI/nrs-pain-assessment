const painLevelLabels = {
  none: "不痛",
  mild: "輕微疼痛",
  moderate: "中度疼痛",
  severe: "嚴重疼痛"
};

const sexLabels = {
  male: "男",
  female: "女",
  other: "其他",
  prefer_not_to_say: "不願回答"
};

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getPainLevel(score) {
  if (score === 0) return "none";
  if (score <= 3) return "mild";
  if (score <= 6) return "moderate";
  return "severe";
}

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.className = `message ${type}`.trim();
}

async function getCurrentUser() {
  if (!db) return null;
  const { data, error } = await db.auth.getUser();
  if (error) return null;
  return data.user;
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.replace("./index.html");
    return null;
  }
  return user;
}

async function getMyRole() {
  if (!db) return null;
  const { data, error } = await db
    .from("profiles")
    .select("role")
    .single();
  if (error) return null;
  return data.role;
}

async function signOut() {
  if (db) await db.auth.signOut();
  window.location.replace("./index.html");
}

document.addEventListener("click", (event) => {
  if (event.target.matches("[data-logout]")) signOut();
});
