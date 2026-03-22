document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
      alert("⚠️ Please fill in all fields to continue.");
      return;
    }

    if (password.length < 6) {
      alert(" Your password must be at least 6 characters.");
      return;
    }

    alert(` Welcome aboard, ${name}! Your Transit Express account is ready.`);
    form.reset();
  });
});