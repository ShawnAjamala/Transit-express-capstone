
document.addEventListener("DOMContentLoaded", () => {
  const accountEmail = document.getElementById("accountEmail");
  const logoutBtn = document.getElementById("logoutBtn");
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  const popupConfirm = document.getElementById("popupConfirm");
  const popupEmailInput = document.getElementById("popupEmailInput");

  // Helpers
  function getAccounts() {
    return JSON.parse(localStorage.getItem("accounts")) || {};
  }

  function saveAccounts(accounts) {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }

  function getCurrentUser() {
    return localStorage.getItem("currentUser");
  }

  function clearCurrentUser() {
    localStorage.removeItem("currentUser");
  }

  // Popup helpers
  function showPopup(message, withEmail = false) {
    popupMessage.textContent = message;
    popup.classList.remove("hidden");
    popupEmailInput.classList.toggle("hidden", !withEmail);
  }

  function closePopup() {
    popup.classList.add("hidden");
    popupEmailInput.value = "";
  }

  popupConfirm.addEventListener("click", closePopup);

  // Initialize account page
  const currentUser = getCurrentUser();
  const accounts = getAccounts();

  if (!currentUser || !accounts[currentUser]) {
    // No valid account → redirect to login
    window.location.href = "login.html";
    return;
  }

  accountEmail.textContent = `Logged in as: ${currentUser}`;

  // Logout
  logoutBtn.addEventListener("click", () => {
    clearCurrentUser();
    showPopup("You have been logged out.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });

  // Delete account
  deleteAccountBtn.addEventListener("click", () => {
    let accounts = getAccounts();
    delete accounts[currentUser];
    saveAccounts(accounts);
    clearCurrentUser();
    showPopup("Your account has been deleted.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });

  // Forgot password
  forgotPasswordBtn.addEventListener("click", () => {
    showPopup("Enter your Gmail to recover password:", true);

    popupConfirm.onclick = () => {
      const email = popupEmailInput.value.trim();
      const accounts = getAccounts();

      if (accounts[email]) {
        showPopup(`Your password is: ${accounts[email].password}`);
      } else {
        showPopup("No account found with that email.");
      }
    };
  });
});


