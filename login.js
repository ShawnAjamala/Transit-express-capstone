 document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const forgotPasswordLink = document.getElementById("forgotPassword");

  // Handle login
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email && password) {
      alert(" Login successful! Welcome back to Transit Express.");
    } else {
      alert(" Please enter both email and password.");
    }
  });

  // Handle forgot password
  forgotPasswordLink.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Password recovery link will be sent to your email.");
  });
});

