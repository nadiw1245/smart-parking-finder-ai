const parkingSlots = [
  { id: "A1", status: "occupied", distance: 120 },
  { id: "A2", status: "available", distance: 80 },
  { id: "A3", status: "occupied", distance: 150 },
  { id: "A4", status: "available", distance: 60 },
  { id: "A5", status: "occupied", distance: 200 },

  { id: "B1", status: "available", distance: 100 },
  { id: "B2", status: "occupied", distance: 180 },
  { id: "B3", status: "available", distance: 90 },
  { id: "B4", status: "occupied", distance: 220 },
  { id: "B5", status: "available", distance: 110 },

  { id: "C1", status: "occupied", distance: 300 },
  { id: "C2", status: "occupied", distance: 270 },
  { id: "C3", status: "available", distance: 140 },
  { id: "C4", status: "occupied", distance: 260 },
  { id: "C5", status: "available", distance: 130 },

  { id: "D1", status: "available", distance: 170 },
  { id: "D2", status: "occupied", distance: 210 },
  { id: "D3", status: "available", distance: 190 },
  { id: "D4", status: "occupied", distance: 240 },
  { id: "D5", status: "available", distance: 160 }
];

function loadParkingGrid() {
  const grid = document.getElementById("parkingGrid");
  grid.innerHTML = "";

  parkingSlots.forEach(slot => {
    const div = document.createElement("div");
    div.className = `slot ${slot.status}`;
    div.innerText = slot.id;
    grid.appendChild(div);
  });

  updateStats();
}

function updateStats() {
  const total = parkingSlots.length;
  const available = parkingSlots.filter(slot => slot.status === "available").length;
  const occupied = parkingSlots.filter(slot => slot.status === "occupied").length;
  const occupancy = Math.round((occupied / total) * 100);

  document.getElementById("totalSlots").innerText = total;
  document.getElementById("availableSlots").innerText = available;
  document.getElementById("occupiedSlots").innerText = occupied;
  document.getElementById("occupancyRate").innerText = occupancy + "%";
}

function findParking() {
  const availableSlots = parkingSlots.filter(slot => slot.status === "available");

  if (availableSlots.length === 0) {
    document.getElementById("recommendationText").innerText =
      "No available parking slots at the moment.";

    document.getElementById("aiInsight").innerText =
      "AI Insight: The parking area is full. Drivers should be redirected to another parking zone.";
    return;
  }

  const nearestSlot = availableSlots.reduce((nearest, current) => {
    return current.distance < nearest.distance ? current : nearest;
  });

  document.getElementById("recommendationText").innerText =
    `Nearest available parking spot is ${nearestSlot.id}, approximately ${nearestSlot.distance} meters away.`;

  const occupied = parkingSlots.filter(slot => slot.status === "occupied").length;
  const occupancy = Math.round((occupied / parkingSlots.length) * 100);

  let insight = "";

  if (occupancy >= 80) {
    insight = "AI Insight: Parking demand is very high. Drivers should be redirected to nearby zones.";
  } else if (occupancy >= 50) {
    insight = "AI Insight: Parking demand is moderate. The system recommends guiding drivers to available slots quickly.";
  } else {
    insight = "AI Insight: Parking availability is good. Drivers can easily find a nearby parking spot.";
  }

  document.getElementById("aiInsight").innerText = insight;
}

loadParkingGrid();
