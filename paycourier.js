
document.addEventListener("DOMContentLoaded", () => {
  const paymentDetails = document.getElementById("paymentDetails");
  const payBtn = document.getElementById("payBtn");
  const ticketDiv = document.getElementById("ticket");
  const ticketDetails = document.getElementById("ticketDetails");
  const cancelBtn = document.getElementById("cancelBtn");
  const cancelMessage = document.getElementById("cancelMessage");
  const cancelDetails = document.getElementById("cancelDetails");

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

  // Load courier booking data
  const courierData = JSON.parse(localStorage.getItem("courierData"));
  const currentUser = getCurrentUser();
  const accounts = getAccounts();

  // Initial checks
  if (!currentUser || !accounts[currentUser]) {
    paymentDetails.innerHTML =
      "<p class='text-red-600 font-semibold'>⚠️ You must be logged in to complete courier payment.</p>";
    payBtn.disabled = true;
    return;
  }

  if (!courierData) {
    paymentDetails.innerHTML =
      "<p class='text-red-600 font-semibold'>⚠️ No courier booking found. Please book a courier first.</p>";
    payBtn.disabled = true;
    return;
  }

  // Show payment details
  paymentDetails.innerHTML = `
    <p class="text-lg font-medium">Sender: ${courierData.sender}</p>
    <p class="text-lg font-medium">Recipient: ${courierData.recipient}</p>
    <p class="text-lg font-medium">Package: ${courierData.package}</p>
    <p class="text-lg font-medium">Route: ${courierData.route}</p>
    <p class="text-lg font-bold text-green-600">Amount: KES ${courierData.price}</p>
  `;

  // Handle payment
  payBtn.addEventListener("click", () => {
    const currentUser = getCurrentUser();
    const accounts = getAccounts();

    // 🔒 Double-check login before processing
    if (!currentUser || !accounts[currentUser]) {
      alert("⚠️ You must be logged in to pay for courier services.");
      return;
    }

    // Save courier booking under user’s account
    if (!accounts[currentUser].courier) {
      accounts[currentUser].courier = [];
    }
    accounts[currentUser].courier.push(courierData);
    saveAccounts(accounts);

    // Show ticket
    ticketDiv.classList.remove("hidden");
    ticketDetails.innerHTML = `
      <p><strong>Sender:</strong> ${courierData.sender}</p>
      <p><strong>Recipient:</strong> ${courierData.recipient}</p>
      <p><strong>Package:</strong> ${courierData.package}</p>
      <p><strong>Route:</strong> ${courierData.route}</p>
      <p><strong>Price:</strong> KES ${courierData.price}</p>
    `;
  });

  // Handle cancellation
  cancelBtn.addEventListener("click", () => {
    let accounts = getAccounts();
    const currentUser = getCurrentUser();

    if (!currentUser || !accounts[currentUser]) {
      alert("⚠️ You must be logged in to cancel a courier ticket.");
      return;
    }

    // Remove courier booking from user's account
    accounts[currentUser].courier = accounts[currentUser].courier.filter(
      (c) =>
        !(
          c.sender === courierData.sender &&
          c.recipient === courierData.recipient &&
          c.package === courierData.package &&
          c.route === courierData.route
        )
    );
    saveAccounts(accounts);

    // Update UI
    ticketDiv.classList.add("hidden");
    cancelMessage.classList.remove("hidden");
    cancelDetails.innerHTML = `
      <p><strong>Sender:</strong> ${courierData.sender}</p>
      <p><strong>Recipient:</strong> ${courierData.recipient}</p>
      <p><strong>Package:</strong> ${courierData.package}</p>
      <p><strong>Route:</strong> ${courierData.route}</p>
      <p class="text-red-600 font-semibold">This courier ticket has been cancelled.</p>
    `;

    // Clear last courier booking
    localStorage.removeItem("courierData");
  });
});

