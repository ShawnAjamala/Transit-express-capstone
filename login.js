document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  const popupClose = document.getElementById("popupClose");

  // Utility: show styled popup
  function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove("hidden");
  }

  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Helpers
  function getAccounts() {
    return JSON.parse(localStorage.getItem("accounts")) || {};
  }

  function saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  function setCurrentUser(email) {
    localStorage.setItem("currentUser", email);
  }

  function getCurrentUser() {
    return localStorage.getItem("currentUser");
  }

  // Handle login
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // Gmail validation
    if (!email.endsWith("@gmail.com")) {
      showPopup("⚠️ Please use a valid Gmail address.");
      return;
    }

    let accounts = getAccounts();

    // Account must exist
    if (!accounts[email]) {
      showPopup("⚠️ No account found. Redirecting to Sign Up...");
      setTimeout(() => {
        window.location.href = "sign.html";
      }, 1500);
      return;
    }

    // Validate password
    if (accounts[email].password !== password) {
      showPopup("⚠️ Incorrect password.");
      return;
    }

    // Successful login
    showPopup("✅ Login successful!");
    setCurrentUser(email);
    saveAccounts(accounts);

    setTimeout(() => {
      window.location.href = "account.html";
    }, 1000);
  });
});
