document.addEventListener("DOMContentLoaded", () => {
  const ticketsContainer = document.getElementById("ticketsContainer");

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

  const currentUser = getCurrentUser();
  const accounts = getAccounts();

  // 🔒 Must be logged in
  if (!currentUser || !accounts[currentUser]) {
    ticketsContainer.innerHTML =
      "<p class='text-red-600 font-semibold'>⚠️ You must be logged in to view your tickets.</p>";
    return;
  }

  const bookings = accounts[currentUser].bookings || [];

  if (bookings.length === 0) {
    ticketsContainer.innerHTML =
      "<p class='text-gray-600'>You have no tickets booked yet.</p>";
    return;
  }

  // Render tickets
  bookings.forEach((booking, index) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.className =
      "border rounded-lg p-6 bg-white shadow-md space-y-2";

    ticketDiv.innerHTML = `
      <h3 class="text-xl font-bold text-blue-600 mb-2">🎟 Ticket #${index + 1}</h3>
      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Route:</strong> ${booking.route}</p>
      <p><strong>Day:</strong> ${booking.day}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
      <p><strong>Seat:</strong> ${booking.seat}</p>
      <p><strong>Price:</strong> KES ${booking.price}</p>
      <button class="cancelBtn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold mt-4">
        Cancel Ticket
      </button>
    `;

    // Cancel button logic
    ticketDiv.querySelector(".cancelBtn").addEventListener("click", () => {
      let accounts = getAccounts();

      // Remove booking from user's account
      accounts[currentUser].bookings = accounts[currentUser].bookings.filter(
        (b) =>
          !(
            b.route === booking.route &&
            b.day === booking.day &&
            b.seat === booking.seat
          )
      );
      saveAccounts(accounts);

      // Free up seat globally
      const seatKey = `bookedSeats_${booking.route}_${booking.day}`;
      let routeSeats = JSON.parse(localStorage.getItem(seatKey)) || [];
      routeSeats = routeSeats.filter((s) => s !== booking.seat);
      localStorage.setItem(seatKey, JSON.stringify(routeSeats));

      // Update UI
      ticketDiv.innerHTML = `
        <h3 class="text-xl font-bold text-red-600 mb-2">❌ Ticket Cancelled</h3>
        <p><strong>Route:</strong> ${booking.route}</p>
        <p><strong>Day:</strong> ${booking.day}</p>
        <p><strong>Seat:</strong> ${booking.seat}</p>
        <p class="text-red-600 font-semibold">This ticket has been cancelled.</p>
      `;
    });

    ticketsContainer.appendChild(ticketDiv);
  });
});

