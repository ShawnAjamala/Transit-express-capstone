document.addEventListener("DOMContentLoaded", () => {
  const ticketsContainer = document.getElementById("ticketsContainer");
  const confirmedTickets = JSON.parse(localStorage.getItem("confirmedTickets")) || [];

  if (confirmedTickets.length === 0) {
    ticketsContainer.innerHTML = "<p>No tickets found.</p>";
    return;
  }

  confirmedTickets.forEach((ticket, index) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "bg-gray-50 shadow-md rounded-lg p-6 mb-4";

    ticketDiv.innerHTML = `
      <p><strong>Name:</strong> ${ticket.name}</p>
      <p><strong>Route:</strong> ${ticket.route}</p>
      <p><strong>Day:</strong> ${ticket.day}</p>
      <p><strong>Departure Time:</strong> ${ticket.time}</p>
      <p><strong>Seat:</strong> ${ticket.seat}</p>
      <p><strong>Price:</strong> KES ${ticket.price}</p>
      <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-3 cancelBtn" data-index="${index}">
        Cancel Ticket
      </button>
    `;

    ticketsContainer.appendChild(ticketDiv);
  });

  document.querySelectorAll(".cancelBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      let tickets = JSON.parse(localStorage.getItem("confirmedTickets")) || [];
      const ticket = tickets[index];

      tickets.splice(index, 1);
      localStorage.setItem("confirmedTickets", JSON.stringify(tickets));

      const seatKey = `bookedSeats_${ticket.route}_${ticket.day}`;
      let routeSeats = JSON.parse(localStorage.getItem(seatKey)) || [];
      routeSeats = routeSeats.filter((seat) => seat !== ticket.seat);
      localStorage.setItem(seatKey, JSON.stringify(routeSeats));

      alert(`Ticket for ${ticket.name} on ${ticket.route} (Seat ${ticket.seat}) cancelled.`);
      window.location.reload();
    });
  });
});


