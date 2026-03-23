

document.addEventListener("DOMContentLoaded", () => {
  const priceOutput = document.getElementById("priceOutput");
  const ticketDiv = document.createElement("div");
  ticketDiv.id = "courierTicket";
  ticketDiv.className = "hidden mt-6 border p-6 rounded bg-gray-100 text-left";
  ticketDiv.innerHTML = `
    <h3 class="text-xl font-bold text-blue-600 mb-4">🎟 Courier Ticket</h3>
    <p id="ticketDetails"></p>
    <button id="cancelBtn" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold mt-4">
      Cancel Ticket
    </button>
  `;
  document.querySelector(".bg-gray-100.p-8").appendChild(ticketDiv);

  let courierTickets = JSON.parse(localStorage.getItem("courierTickets")) || [];

  // Show last ticket if exists
  if (courierTickets.length > 0) {
    showTicket(courierTickets[courierTickets.length - 1]);
  }

  // Price calculator
  window.calculatePrice = function () {
    const weight = parseFloat(document.getElementById("parcelWeight").value) || 0;
    let price = 0;
    if (weight <= 30) {
      price = weight * 100;
    } else {
      price = (30 * 100) + ((weight - 30) * 150);
    }
    priceOutput.textContent = `Estimated Price: KES ${price}`;
    return price;
  };

  // Submit booking
  window.submitBooking = function () {
    const name = document.getElementById("clientName").value.trim();
    const email = document.getElementById("clientEmail").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const pickupStation = document.getElementById("pickupStation").value;
    const dropoffStation = document.getElementById("dropoffStation").value;
    const description = document.getElementById("parcelDescription").value.trim();
    const parcelCount = parseInt(document.getElementById("parcelCount").value, 10);
    const weight = parseFloat(document.getElementById("parcelWeight").value);
    const pickupDate = document.getElementById("pickupDate").value;
    const pickupTime = document.getElementById("pickupTime").value;

    if (!name || !email || !phone || !pickupStation || !dropoffStation || !pickupDate || !pickupTime) {
      alert("Please fill in all required fields.");
      return;
    }

    // ✅ Robust date/time validation before saving
    const [year, month, day] = pickupDate.split("-").map(Number);
    const [hours, minutes] = pickupTime.split(":").map(Number);
    const departureDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();

    if (now > departureDateTime) {
      alert("⚠️ Sorry, this pickup time has already passed. Please choose a valid future time.");
      return; // stop here, do not save ticket
    }

    const price = calculatePrice();

    const ticket = {
      name, email, phone,
      pickupStation, dropoffStation,
      description, parcelCount, weight,
      pickupDate, pickupTime, price
    };

    courierTickets.push(ticket);
    localStorage.setItem("courierTickets", JSON.stringify(courierTickets));

    showTicket(ticket);
  };

  // Cancel ticket
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "cancelBtn") {
      if (courierTickets.length === 0) return;
      const ticket = courierTickets[courierTickets.length - 1];
      courierTickets.pop();
      localStorage.setItem("courierTickets", JSON.stringify(courierTickets));

      alert(`Courier ticket for ${ticket.name} cancelled. Refund of KES ${ticket.price} will be processed.`);
      ticketDiv.classList.add("hidden");
    }
  });

  function showTicket(ticket) {
    ticketDiv.classList.remove("hidden");
    document.getElementById("ticketDetails").innerHTML = `
      ✅ Payment Successful!<br>
      Name: ${ticket.name}<br>
      Email: ${ticket.email}<br>
      Phone: ${ticket.phone}<br>
      Pickup: ${ticket.pickupStation}<br>
      Drop-off: ${ticket.dropoffStation}<br>
      Parcels: ${ticket.parcelCount}<br>
      Weight: ${ticket.weight} kg<br>
      Pickup Date: ${ticket.pickupDate}<br>
      Pickup Time: ${ticket.pickupTime}<br>
      Description: ${ticket.description}<br>
      Price: KES ${ticket.price}
    `;
  }
});

