
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

  // Load booking data
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  const currentUser = getCurrentUser();
  const accounts = getAccounts();

  if (!currentUser || !accounts[currentUser]) {
    paymentDetails.innerHTML =
      "<p class='text-red-600 font-semibold'>⚠️ You must be logged in to complete payment.</p>";
    payBtn.disabled = true;
    return;
  }

  if (!bookingData) {
    paymentDetails.innerHTML =
      "<p class='text-red-600 font-semibold'>⚠️ No booking found. Please book a seat first.</p>";
    payBtn.disabled = true;
    return;
  }

  // Show payment details
  paymentDetails.innerHTML = `
    <p class="text-lg font-medium">Route: ${bookingData.route}</p>
    <p class="text-lg font-medium">Day: ${bookingData.day}</p>
    <p class="text-lg font-medium">Time: ${bookingData.time}</p>
    <p class="text-lg font-medium">Seat: ${bookingData.seat}</p>
    <p class="text-lg font-bold text-green-600">Amount: KES ${bookingData.price}</p>
  `;

  // Handle payment
  payBtn.addEventListener("click", () => {
    ticketDiv.classList.remove("hidden");
    ticketDetails.innerHTML = `
      <p><strong>Name:</strong> ${bookingData.name}</p>
      <p><strong>Email:</strong> ${bookingData.email}</p>
      <p><strong>Route:</strong> ${bookingData.route}</p>
      <p><strong>Day:</strong> ${bookingData.day}</p>
      <p><strong>Time:</strong> ${bookingData.time}</p>
      <p><strong>Seat:</strong> ${bookingData.seat}</p>
      <p><strong>Price:</strong> KES ${bookingData.price}</p>
    `;
  });

  // Handle cancellation
  cancelBtn.addEventListener("click", () => {
    let accounts = getAccounts();

    // Remove booking from user's account
    accounts[currentUser].bookings = accounts[currentUser].bookings.filter(
      (b) =>
        !(
          b.route === bookingData.route &&
          b.day === bookingData.day &&
          b.seat === bookingData.seat
        )
    );
    saveAccounts(accounts);

    // Free up seat globally
    const seatKey = `bookedSeats_${bookingData.route}_${bookingData.day}`;
    let routeSeats = JSON.parse(localStorage.getItem(seatKey)) || [];
    routeSeats = routeSeats.filter((s) => s !== bookingData.seat);
    localStorage.setItem(seatKey, JSON.stringify(routeSeats));

    // Show cancellation message
    ticketDiv.classList.add("hidden");
    cancelMessage.classList.remove("hidden");
    cancelDetails.innerHTML = `
      <p><strong>Route:</strong> ${bookingData.route}</p>
      <p><strong>Day:</strong> ${bookingData.day}</p>
      <p><strong>Seat:</strong> ${bookingData.seat}</p>
      <p class="text-red-600 font-semibold">This ticket has been cancelled.</p>
    `;

    // Clear last booking
    localStorage.removeItem("bookingData");
  });
});

