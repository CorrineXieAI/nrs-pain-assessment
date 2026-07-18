const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");
const loginButton = document.querySelector("#login-button");

async function redirectExistingUser() {
  if (showConfigurationWarning()) return;

  const user = await getCurrentUser();
  if (!user) return;

  const role = await getMyRole();
  window.location.replace(
    role === "admin" ? "./admin.html" : "./assessment.html"
  );
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (showConfigurationWarning()) return;

  loginButton.disabled = true;
  setMessage(loginMessage, "登入中……");

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;

  const { error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setMessage(loginMessage, "登入失敗，請檢查帳號與密碼。", "error");
    loginButton.disabled = false;
    return;
  }

  const role = await getMyRole();
  window.location.replace(
    role === "admin" ? "./admin.html" : "./assessment.html"
  );
});

redirectExistingUser();
