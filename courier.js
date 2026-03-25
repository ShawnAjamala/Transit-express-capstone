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

  // Utility: popup
  function showPopup(message) {
    const existingPopup = document.querySelector(".custom-popup");
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement("div");
    popup.className =
      "custom-popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

    popup.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <p class="text-gray-800 font-medium mb-4">${message}</p>
        <button id="closePopup" 
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          OK
        </button>
      </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("closePopup").addEventListener("click", () => {
      popup.remove();
    });
  }

  // Show last courier ticket if exists
  const currentUser = getCurrentUser();
  const accounts = getAccounts();
  if (currentUser && accounts[currentUser] && accounts[currentUser].courier?.length > 0) {
    showTicket(accounts[currentUser].courier[accounts[currentUser].courier.length - 1]);
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
    const currentUser = getCurrentUser();
    const accounts = getAccounts();

    if (!currentUser || !accounts[currentUser]) {
      showPopup("⚠️ You must be logged into an account to book courier services.");
      return;
    }

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
      showPopup("⚠️ Please fill in all required fields.");
      return;
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      showPopup("⚠️ Please enter a valid 10-digit phone number.");
      return;
    }

    // Date/time validation
    const [year, month, day] = pickupDate.split("-").map(Number);
    const [hours, minutes] = pickupTime.split(":").map(Number);
    const departureDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();

    if (now > departureDateTime) {
      showPopup("⚠️ Sorry, this pickup time has already passed. Please choose a valid future time.");
      return;
    }

    const price = calculatePrice();

    const ticket = {
      name, email, phone,
      pickupStation, dropoffStation,
      description, parcelCount, weight,
      pickupDate, pickupTime, price
    };

    // Save ticket under current user's account
    accounts[currentUser].courier.push(ticket);
    saveAccounts(accounts);

    showTicket(ticket);
    showPopup("✅ Booking successful! Your courier ticket has been created.");
  };

  // Cancel ticket
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "cancelBtn") {
      const currentUser = getCurrentUser();
      const accounts = getAccounts();

      if (!currentUser || !accounts[currentUser]) {
        showPopup("⚠️ You must be logged in to cancel a courier ticket.");
        return;
      }

      if (!accounts[currentUser].courier || accounts[currentUser].courier.length === 0) return;

      const ticket = accounts[currentUser].courier[accounts[currentUser].courier.length - 1];
      accounts[currentUser].courier.pop();
      saveAccounts(accounts);

      showPopup(`❌ Courier ticket for ${ticket.name} cancelled. Refund of KES ${ticket.price} will be processed.`);
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

