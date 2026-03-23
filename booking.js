document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const routeSelect = document.getElementById("route");
  const seatGrid = document.getElementById("seatGrid");
  let selectedSeat = null;

  function renderSeats() {
    seatGrid.innerHTML = "";
    const totalSeats = 20;
    const routeOption = routeSelect.options[routeSelect.selectedIndex];
    const route = routeOption?.value || "";
    const day = document.getElementById("day").value;
    const seatKey = route && day ? `bookedSeats_${route}_${day}` : null;
    const reservedSeats = seatKey ? JSON.parse(localStorage.getItem(seatKey)) || [] : [];

    for (let i = 1; i <= totalSeats; i++) {
      const seat = document.createElement("div");
      seat.textContent = i;
      seat.dataset.seatNumber = i;
      seat.className = "border rounded p-4 text-center transition cursor-pointer";

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
    const name = document.getElementById("name").value.trim();
    const routeOption = routeSelect.options[routeSelect.selectedIndex];
    const route = routeOption.value;
    const price = routeOption.dataset.price;
    const departureTime = routeOption.dataset.time; // e.g. "6:00 AM"
    const day = document.getElementById("day").value;

    if (!selectedSeat) {
      alert("Please select a seat before proceeding.");
      return;
    }

    // ✅ Departure time check
    const departureDateTime = new Date(`${day} ${departureTime}`);
    const now = new Date();
    if (now > departureDateTime) {
      alert("⚠️ Sorry, this departure time has already passed. Please choose another route or day.");
      return;
    }

    const bookingData = { name, route, price, day, time: departureTime, seat: selectedSeat };

    const seatKey = `bookedSeats_${route}_${day}`;
    let routeSeats = JSON.parse(localStorage.getItem(seatKey)) || [];
    if (routeSeats.includes(selectedSeat)) {
      alert("This seat is already reserved. Please choose another.");
      return;
    }
    routeSeats.push(selectedSeat);
    localStorage.setItem(seatKey, JSON.stringify(routeSeats));

    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    window.location.href = "payseat.html";
  });

  renderSeats();
});

