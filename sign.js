document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  const popupClose = document.getElementById("popupClose");

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

  // Popup utility
  function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove("hidden");
  }

  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Handle sign up
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    // Gmail validation
    if (!email.endsWith("@gmail.com")) {
      showPopup("⚠️ Please use a valid Gmail address.");
      return;
    }

    let accounts = getAccounts();

    // Prevent duplicate accounts
    if (accounts[email]) {
      showPopup("⚠️ Account already exists. Please log in.");
      return;
    }

    // Create new account with empty bookings/courier arrays
    accounts[email] = {
      password: password,
      bookings: [],
      courier: [],
    };

    saveAccounts(accounts);
    setCurrentUser(email);

    showPopup("✅ Account created successfully!");

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "account.html";
    }, 1000);
  });
});
