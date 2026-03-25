document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const routeSelect = document.getElementById("route");
  const seatGrid = document.getElementById("seatGrid");
  let selectedSeat = null;

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

  function renderSeats() {
    seatGrid.innerHTML = "";
    const totalSeats = 20;
    const routeOption = routeSelect.options[routeSelect.selectedIndex];
    const route = routeOption?.value || "";
    const day = document.getElementById("day").value;
    const seatKey = route && day ? `bookedSeats_${route}_${day}` : null;
    const reservedSeats = seatKey
      ? JSON.parse(localStorage.getItem(seatKey)) || []
      : [];

    for (let i = 1; i <= totalSeats; i++) {
      const seat = document.createElement("div");
      seat.textContent = i;
      seat.dataset.seatNumber = i;
      seat.className =
        "border rounded p-4 text-center transition cursor-pointer";

      if (reservedSeats.includes(String(i))) {
        seat.classList.add("bg-gray-400", "text-white", "cursor-not-allowed");
      } else {
        seat.classList.add("hover:bg-blue-100");
        seat.addEventListener("click", () => selectSeat(seat));
      }
      seatGrid.appendChild(seat);
    }
  }

  function selectSeat(seat) {
    document.querySelectorAll("#seatGrid div").forEach((s) => {
      s.classList.remove("bg-blue-500", "text-white");
    });
    seat.classList.add("bg-blue-500", "text-white");
    selectedSeat = seat.dataset.seatNumber;
  }

  routeSelect.addEventListener("change", renderSeats);
  document.getElementById("day").addEventListener("change", renderSeats);

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 🔒 Check login status
    const currentUser = getCurrentUser();
    const accounts = getAccounts();

    if (!currentUser || !accounts[currentUser]) {
      showPopup("You must be logged into an account to book a seat.");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const routeOption = routeSelect.options[routeSelect.selectedIndex];
    const route = routeOption.value;
    const price = routeOption.dataset.price;
    const departureTime = routeOption.dataset.time;
    const day = document.getElementById("day").value;

    if (!selectedSeat) {
      showPopup("Please select a seat before proceeding.");
      return;
    }

    // Departure time check
    const departureDateTime = new Date(`${day} ${departureTime}`);
    const now = new Date();
    if (now > departureDateTime) {
      showPopup(
        "⚠️ Sorry, this departure time has already passed. Please choose another route or day."
      );
      return;
    }

    const bookingData = {
      name,
      email: currentUser, // 🔑 tie booking to logged-in account
      route,
      price,
      day,
      time: departureTime,
      seat: selectedSeat,
    };

    // Reserve seat globally (so others can’t pick it)
    const seatKey = `bookedSeats_${route}_${day}`;
    let routeSeats = JSON.parse(localStorage.getItem(seatKey)) || [];
    if (routeSeats.includes(selectedSeat)) {
      showPopup("This seat is already reserved. Please choose another.");
      return;
    }
    routeSeats.push(selectedSeat);
    localStorage.setItem(seatKey, JSON.stringify(routeSeats));

    // Store booking under user’s account
    accounts[currentUser].bookings.push(bookingData);
    saveAccounts(accounts);

    // Also store last booking for payment page
    localStorage.setItem("bookingData", JSON.stringify(bookingData));

    window.location.href = "payseat.html";
  });

  renderSeats();
});

