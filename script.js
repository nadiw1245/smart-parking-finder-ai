let parkingSlots = [
  { id: "A1", zone: "A", status: "occupied", distance: 120 },
  { id: "A2", zone: "A", status: "available", distance: 80 },
  { id: "A3", zone: "A", status: "occupied", distance: 150 },
  { id: "A4", zone: "A", status: "available", distance: 60 },
  { id: "A5", zone: "A", status: "occupied", distance: 200 },

  { id: "B1", zone: "B", status: "available", distance: 100 },
  { id: "B2", zone: "B", status: "occupied", distance: 180 },
  { id: "B3", zone: "B", status: "available", distance: 90 },
  { id: "B4", zone: "B", status: "occupied", distance: 220 },
  { id: "B5", zone: "B", status: "available", distance: 110 },

  { id: "C1", zone: "C", status: "occupied", distance: 300 },
  { id: "C2", zone: "C", status: "occupied", distance: 270 },
  { id: "C3", zone: "C", status: "available", distance: 140 },
  { id: "C4", zone: "C", status: "occupied", distance: 260 },
  { id: "C5", zone: "C", status: "available", distance: 130 },

  { id: "D1", zone: "D", status: "available", distance: 170 },
  { id: "D2", zone: "D", status: "occupied", distance: 210 },
  { id: "D3", zone: "D", status: "available", distance: 190 },
  { id: "D4", zone: "D", status: "occupied", distance: 240 },
  { id: "D5", zone: "D", status: "available", distance: 160 }
];

let recommendedSlotId = null;

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

function loadParkingGrid(bestSlotId = null) {
  const grid = document.getElementById("parkingGrid");
  grid.innerHTML = "";

  parkingSlots.forEach(slot => {
    const div = document.createElement("div");
    let className = `slot ${slot.status}`;

    if (slot.id === bestSlotId) className += " best-slot";
    if (slot.status === "reserved") className += " reserved";

    div.className = className;
    div.innerHTML = `${slot.id}<br><small>${slot.distance}m</small>`;
    div.onclick = () => showSlotDetails(slot);
    grid.appendChild(div);
  });

  updateStats();
  updateZoneStatus();
}

function updateStats() {
  const total = parkingSlots.length;
  const available = parkingSlots.filter(slot => slot.status === "available").length;
  const occupied = parkingSlots.filter(slot => slot.status === "occupied").length;
  const reserved = parkingSlots.filter(slot => slot.status === "reserved").length;
  const occupancy = Math.round(((occupied + reserved) / total) * 100);

  document.getElementById("totalSlots").innerText = total;
  document.getElementById("availableSlots").innerText = available;
  document.getElementById("occupiedSlots").innerText = occupied + reserved;
  document.getElementById("occupancyRate").innerText = occupancy + "%";
}

function updateZoneStatus() {
  const zoneStatus = document.getElementById("zoneStatus");
  zoneStatus.innerHTML = "";

  ["A", "B", "C", "D"].forEach(zone => {
    const zoneSlots = parkingSlots.filter(slot => slot.zone === zone);
    const available = zoneSlots.filter(slot => slot.status === "available").length;
    const occupied = zoneSlots.length - available;
    const percentage = Math.round((occupied / zoneSlots.length) * 100);

    const row = document.createElement("div");
    row.className = "zone-row";
    row.innerHTML = `<span>Zone ${zone}</span><strong>${percentage}% Full | ${available} free</strong>`;
    zoneStatus.appendChild(row);
  });
}

function showSlotDetails(slot) {
  const statusText = slot.status.charAt(0).toUpperCase() + slot.status.slice(1);

  document.getElementById("recommendationText").innerText =
    `Slot ${slot.id} is currently ${statusText}. Distance from entrance is approximately ${slot.distance} meters.`;

  document.getElementById("aiInsight").innerText =
    slot.status === "available"
      ? `AI Insight: Slot ${slot.id} is available and can be recommended to nearby drivers.`
      : `AI Insight: Slot ${slot.id} is not available. The system should search for another nearby space.`;
}

function findParking() {
  const preferredZone = document.getElementById("zoneSelect").value;
  const vehicleType = document.getElementById("vehicleType").value;

  let availableSlots = parkingSlots.filter(slot => slot.status === "available");

  if (preferredZone !== "all") {
    const zoneSlots = availableSlots.filter(slot => slot.zone === preferredZone);
    if (zoneSlots.length > 0) availableSlots = zoneSlots;
  }

  if (availableSlots.length === 0) {
    document.getElementById("recommendationText").innerText =
      "No available parking slots at the moment.";

    document.getElementById("aiInsight").innerText =
      "AI Insight: The selected parking area is full. Drivers should be redirected to another parking zone.";

    alert("No available parking slots at the moment.");
    return;
  }

  const nearestSlot = availableSlots.reduce((nearest, current) => {
    return current.distance < nearest.distance ? current : nearest;
  });

  recommendedSlotId = nearestSlot.id;
  loadParkingGrid(nearestSlot.id);

  document.getElementById("recommendationText").innerText =
    `Nearest available parking spot is ${nearestSlot.id}, approximately ${nearestSlot.distance} meters away. Vehicle type: ${vehicleType.toUpperCase()}.`;

  const occupied = parkingSlots.filter(slot => slot.status !== "available").length;
  const occupancy = Math.round((occupied / parkingSlots.length) * 100);

  let insight = "";

  if (occupancy >= 80) {
    insight = "AI Insight: Parking demand is very high. Drivers should be redirected to less crowded zones.";
  } else if (occupancy >= 50) {
    insight = "AI Insight: Parking demand is moderate. The system recommends guiding drivers quickly to available slots.";
  } else {
    insight = "AI Insight: Parking availability is good. Drivers can easily find a nearby parking space.";
  }

  document.getElementById("aiInsight").innerText = insight;
  alert(`Nearest available parking spot: ${nearestSlot.id} - ${nearestSlot.distance} meters away.`);
}

function reserveSlot() {
  if (!recommendedSlotId) {
    alert("Please click Recommend Best Slot first.");
    return;
  }

  const slot = parkingSlots.find(slot => slot.id === recommendedSlotId);

  if (!slot || slot.status !== "available") {
    alert("Recommended slot is no longer available.");
    return;
  }

  slot.status = "reserved";

  document.getElementById("recommendationText").innerText =
    `Slot ${slot.id} has been reserved successfully. Please arrive soon to confirm parking.`;

  document.getElementById("aiInsight").innerText =
    `AI Insight: Reservation completed. This helps reduce searching time and improves parking flow.`;

  loadParkingGrid(slot.id);
  alert(`Slot ${slot.id} reserved successfully.`);
}

function updateSlotStatus() {
  const slotId = document.getElementById("slotInput").value.trim().toUpperCase();
  const newStatus = document.getElementById("statusSelect").value;

  const slot = parkingSlots.find(slot => slot.id === slotId);

  if (!slot) {
    alert("Slot not found. Example slot IDs: A1, B3, C5.");
    return;
  }

  slot.status = newStatus;
  recommendedSlotId = null;
  loadParkingGrid();

  document.getElementById("recommendationText").innerText =
    `Admin updated Slot ${slot.id} to ${newStatus}.`;

  document.getElementById("aiInsight").innerText =
    "AI Insight: Parking data has been updated. Recommendations will now use the latest slot status.";

  alert(`Slot ${slot.id} updated to ${newStatus}.`);
}

function simulateLiveData() {
  parkingSlots = parkingSlots.map(slot => {
    if (Math.random() > 0.72) {
      return {
        ...slot,
        status: slot.status === "available" ? "occupied" : "available"
      };
    }
    return slot;
  });

  recommendedSlotId = null;
  loadParkingGrid();

  document.getElementById("recommendationText").innerText =
    "Live parking data simulation completed. Click Recommend Best Slot again to get a new result.";

  document.getElementById("aiInsight").innerText =
    "AI Insight: Parking conditions changed in real time. The system is ready to generate updated recommendations.";

  alert("Live parking data simulated.");
}

loadParkingGrid();
