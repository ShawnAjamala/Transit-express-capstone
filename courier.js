function calculatePrice() {
  const weight = parseInt(document.getElementById('parcelWeight').value, 10) || 0;
  const parcels = parseInt(document.getElementById('parcelCount').value, 10) || 1;
  let price = 0;

  if (weight > 0) {
    const baseRate = 100;      // KES per kg up to 30 kg
    const surchargeRate = 150; // KES per kg above 30

    if (weight <= 30) {
      price = weight * baseRate * parcels;
    } else {
      const extraKg = weight - 30;
      price = (30 * baseRate + extraKg * surchargeRate) * parcels;
    }

    document.getElementById('priceOutput').innerText =
      "Estimated Price: KES " + price;
  } else {
    document.getElementById('priceOutput').innerText = "";
  }
}

// Collect form data and redirect to payment page
function submitBooking() {
  const bookingData = {
    name: document.getElementById('clientName').value,
    email: document.getElementById('clientEmail').value,
    phone: document.getElementById('clientPhone').value,
    pickupStation: document.getElementById('pickupStation').value,
    dropoffStation: document.getElementById('dropoffStation').value,
    parcelDescription: document.getElementById('parcelDescription').value,
    parcelCount: parseInt(document.getElementById('parcelCount').value, 10),
    weight: parseInt(document.getElementById('parcelWeight').value, 10),
    pickupDate: document.getElementById('pickupDate').value,
    pickupTime: document.getElementById('pickupTime').value
  };

  // Save booking data in localStorage so payment page can access it
  localStorage.setItem("courierBooking", JSON.stringify(bookingData));

  // Redirect to mock payment page
  window.location.href = "paycourier.html";
}



let parcels = [

  { id: 1, description: "Documents", status: "In Transit" },
  { id: 2, description: "Electronics", status: "Arrived" }
];

// Render cards
function renderParcels() {
  const container = document.getElementById("parcelCards");
  container.innerHTML = "";

  parcels.forEach(parcel => {
    const card = document.createElement("div");
    card.className = "p-4 lg:w-1/2 md:w-full";

    card.innerHTML = `
      <div class="flex border-2 rounded-lg border-gray-200 border-opacity-50 p-8 sm:flex-row flex-col bg-white shadow-md">
        <div class="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full 
          ${parcel.status === "In Transit" ? "bg-blue-100 text-blue-500" : "bg-green-100 text-green-500"} flex-shrink-0">
          <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            class="w-8 h-8" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="flex-grow">
          <h2 class="text-gray-900 text-lg title-font font-medium mb-3">Parcel #${parcel.id}</h2>
          <p class="leading-relaxed text-base">Description: ${parcel.description}</p>
          <p class="leading-relaxed text-base font-semibold">Status: ${parcel.status}</p>
          ${parcel.status === "Arrived" ? 
            `<button onclick="collectParcel(${parcel.id})" 
              class="mt-3 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
              Collect
            </button>` 
            : ""}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Handle collect
function collectParcel(id) {
  parcels = parcels.filter(parcel => parcel.id !== id);
  renderParcels();
  alert("Parcel collected successfully!");
}

// Initial render
document.addEventListener("DOMContentLoaded", renderParcels);

