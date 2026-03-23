

document.addEventListener("DOMContentLoaded", () => {
  // Reset localStorage completely on page load
  localStorage.clear();

  const seatGrid = document.getElementById("seatGrid");
  const routeSelect = document.getElementById("route");
  let bookingData = {};

  // Render seats for selected route
  function renderSeats(route) {
    seatGrid.innerHTML = "";
    if (!route) return; // don’t render until a route is chosen

    let routeSeats = JSON.parse(localStorage.getItem("bookedSeats_" + route)) || [];

    for (let i = 1; i <= 20; i++) {
      const seat = document.createElement("div");
      seat.textContent = "Seat " + i;
      seat.className = "border p-4 text-center cursor-pointer hover:bg-orange-200";

      if (routeSeats.includes(i)) {
        seat.classList.add("bg-gray-400", "cursor-not-allowed");
      } else {
        seat.onclick = () => {
          document.querySelectorAll("#seatGrid div").forEach(s => s.classList.remove("bg-orange-400"));
          seat.classList.add("bg-orange-400");
          bookingData.seat = i;
        };
      }
      seatGrid.appendChild(seat);
    }
  }

  // Show seats when route changes
  routeSelect.addEventListener("change", () => {
    renderSeats(routeSelect.value);
  });

  document.getElementById("confirmSeat").onclick = (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const route = routeSelect.value;
    const price = routeSelect.options[routeSelect.selectedIndex].dataset.price;
    const day = document.getElementById("day").value;
    const time = document.getElementById("time").value;

    if (!name || !route || !day || !time || !bookingData.seat) {
      alert("Please fill all fields and select a seat!");
      return;
    }

    // Save booking data
    localStorage.setItem("bookingData", JSON.stringify({ name, route, day, time, seat: bookingData.seat, price }));

    // Save booked seat for that route
    let routeSeats = JSON.parse(localStorage.getItem("bookedSeats_" + route)) || [];
    routeSeats.push(bookingData.seat);
    localStorage.setItem("bookedSeats_" + route, JSON.stringify(routeSeats));

    // Redirect to payment page
    window.location.href = "payseat.html";
  };
});


