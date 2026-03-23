document.addEventListener("DOMContentLoaded", () => {
  const confirmedTickets =
    JSON.parse(localStorage.getItem("confirmedTickets")) || [];
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (confirmedTickets.length > 0) {
    showTicket(confirmedTickets[confirmedTickets.length - 1]);
  } else if (bookingData) {
    document.getElementById("paymentDetails").innerHTML = `
      <p><strong>Name:</strong> ${bookingData.name}</p>
      <p><strong>Route:</strong> ${bookingData.route}</p>
      <p><strong>Day:</strong> ${bookingData.day}</p>
      <p><strong>Departure Time:</strong> ${bookingData.time}</p>
      <p><strong>Seat:</strong> ${bookingData.seat}</p>
      <p><strong>Price:</strong> KES ${bookingData.price}</p>
    `;
  } else {
    document.getElementById("paymentDetails").innerHTML =
      "<p>No booking found.</p>";
  }

  document.getElementById("payBtn").onclick = () => {
    if (!bookingData) return;

    setTimeout(() => {
      showTicket(bookingData);

      let tickets = JSON.parse(localStorage.getItem("confirmedTickets")) || [];
      tickets.push(bookingData);
      localStorage.setItem("confirmedTickets", JSON.stringify(tickets));

      localStorage.removeItem("bookingData");
    }, 1000);
  };

  document.getElementById("cancelBtn").onclick = () => {
    let tickets = JSON.parse(localStorage.getItem("confirmedTickets")) || [];
    if (tickets.length === 0) return;

    const ticket = tickets[tickets.length - 1];
    tickets.pop();
    localStorage.setItem("confirmedTickets", JSON.stringify(tickets));

    const seatKey = `bookedSeats_${ticket.route}_${ticket.day}`;
    let routeSeats = JSON.parse(localStorage.getItem(seatKey)) || [];
    routeSeats = routeSeats.filter((seat) => seat !== ticket.seat);
    localStorage.setItem(seatKey, JSON.stringify(routeSeats));

    document.getElementById("cancelMessage").classList.remove("hidden");
    document.getElementById("cancelDetails").innerHTML = `
      Ticket for <strong>${ticket.name}</strong> on route <strong>${ticket.route}</strong>
      (Seat ${ticket.seat}) has been cancelled.<br>
      Refund of KES ${ticket.price} will be processed.
    `;
    document.getElementById("ticket").classList.add("hidden");
  };

  function showTicket(ticket) {
    document.getElementById("ticket").classList.remove("hidden");
    document.getElementById("ticketDetails").innerHTML = `
      ✅ Payment Successful!<br>
      Name: ${ticket.name}<br>
      Route: ${ticket.route}<br>
      Day: ${ticket.day}<br>
      Departure Time: ${ticket.time}<br>
      Seat: ${ticket.seat}<br>
      Price: KES ${ticket.price}
    `;
  }
});
