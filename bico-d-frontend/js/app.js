function showSection(id) {
  document.querySelectorAll("section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

const drones = [
  { name: "Drone A", type: "Multispectral", status: "Available" },
  { name: "Drone B", type: "Spraying", status: "In Mission" },
  { name: "Drone C", type: "RGB Survey", status: "Available" }
];

function loadDrones() {
  const list = document.getElementById("droneList");
  drones.forEach(d => {
    const li = document.createElement("li");
    li.textContent = `${d.name} | ${d.type} | ${d.status}`;
    list.appendChild(li);
  });
}

function createMission() {
  document.getElementById("missionStatus").innerText =
    "Mission scheduled successfully using AI planning.";
}

window.onload = loadDrones;
