document.addEventListener("DOMContentLoaded", () => {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  const confirmedTicket = JSON.parse(localStorage.getItem("confirmedTicket"));

  // Show booking details if available
  if (bookingData) {
    document.getElementById("paymentDetails").innerHTML = `
      <p><strong>Name:</strong> ${bookingData.name}</p>
      <p><strong>Route:</strong> ${bookingData.route}</p>
      <p><strong>Day:</strong> ${bookingData.day}</p>
      <p><strong>Time:</strong> ${bookingData.time}</p>
      <p><strong>Seat:</strong> ${bookingData.seat}</p>
      <p><strong>Price:</strong> KES ${bookingData.price}</p>
    `;
  } else {
    document.getElementById("paymentDetails").innerHTML =
      "<p>No booking found.</p>";
  }

  // If a confirmed ticket exists, show it immediately
  if (confirmedTicket) {
    document.getElementById("ticket").classList.remove("hidden");
    document.getElementById("ticketDetails").innerHTML = `
      ✅ Payment Successful!<br>
      Name: ${confirmedTicket.name}<br>
      Route: ${confirmedTicket.route}<br>
      Day: ${confirmedTicket.day}<br>
      Time: ${confirmedTicket.time}<br>
      Seat: ${confirmedTicket.seat}<br>
      Price: KES ${confirmedTicket.price}
    `;
  }

  // Payment simulation
  document.getElementById("payBtn").onclick = () => {
    if (!bookingData) return;
    setTimeout(() => {
      document.getElementById("ticket").classList.remove("hidden");
      document.getElementById("ticketDetails").innerHTML = `
        ✅ Payment Successful!<br>
        Name: ${bookingData.name}<br>
        Route: ${bookingData.route}<br>
        Day: ${bookingData.day}<br>
        Time: ${bookingData.time}<br>
        Seat: ${bookingData.seat}<br>
        Price: KES ${bookingData.price}
      `;
      // Save confirmed ticket
      localStorage.setItem("confirmedTicket", JSON.stringify(bookingData));
    }, 1000);
  };

  // Cancel ticket
  document.getElementById("cancelBtn").onclick = () => {
    const ticket = JSON.parse(localStorage.getItem("confirmedTicket"));
    if (!ticket) return;

    let routeSeats =
      JSON.parse(localStorage.getItem("bookedSeats_" + ticket.route)) || [];
    routeSeats = routeSeats.filter((seat) => seat !== ticket.seat);
    localStorage.setItem(
      "bookedSeats_" + ticket.route,
      JSON.stringify(routeSeats),
    );

    localStorage.removeItem("bookingData");
    localStorage.removeItem("confirmedTicket");

    document.getElementById("cancelMessage").classList.remove("hidden");
    document.getElementById("cancelDetails").innerHTML = `
      Ticket for <strong>${ticket.name}</strong> on route <strong>${ticket.route}</strong>
      (Seat ${ticket.seat}) has been cancelled.<br>
      💵 Refund of KES ${ticket.price} will be processed.
    `;

    document.getElementById("ticket").classList.add("hidden");
  };
});
