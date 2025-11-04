import "../../Components/navbar.js";
import "../../Components/footer.js";
import "../../Components/chat.js";

const settings = {
  basePrice: 2500000,
  serviceMultipliers: { interior: 1, architecture: 1.5, renovation: 1.2 },
  materialMultipliers: { standard: 1, premium: 1.5, luxury: 2 },
  roomMultiplierPercentage: 10,
  baseRoomCount: 3,
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

function initCalculatorBindings() {
  const areaEl = document.getElementById("area");
  const areaValue = document.getElementById("areaValue");
  const room = document.getElementById("roomCount");
  const roomValue = document.getElementById("roomValue");
  const serviceButtons = document.querySelectorAll("#serviceOptions button");
  const materialButtons = document.querySelectorAll("#materialOptions button");
  const resultBox = document.getElementById("resultBox");
  const calculateBtn = document.getElementById("calculateBtn");

  if (!areaEl || !room || !calculateBtn) return;

  let selectedService = "interior";
  let selectedMaterial = "standard";

  function updateSliderBackground(slider) {
    const value =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #8cc55a 0%,
     #8cc55a ${value}%, #ddd ${value}%, #ddd 100%)`;
  }

  areaEl.addEventListener("input", () => {
    areaValue.textContent = areaEl.value + " m²";
    updateSliderBackground(areaEl);
  });

  room.addEventListener("input", () => {
    roomValue.textContent = room.value + " ruangan";
    updateSliderBackground(room);
  });

  updateSliderBackground(areaEl);
  updateSliderBackground(room);

  serviceButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      serviceButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedService = btn.dataset.value;
    });
  });

  materialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      materialButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedMaterial = btn.dataset.value;
    });
  });

  calculateBtn.addEventListener("click", () => {
    const serviceMult = settings.serviceMultipliers[selectedService] || 1;
    const materialMult = settings.materialMultipliers[selectedMaterial] || 1;
    const roomMult =
      1 +
      (Number(room.value) - settings.baseRoomCount) *
        (settings.roomMultiplierPercentage / 100);

    const total =
      settings.basePrice *
      Number(areaEl.value) *
      serviceMult *
      materialMult *
      roomMult;

    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(total);

    resultBox.innerHTML = `
      <div class="result-box">
        <div>Total Estimasi</div>
        <div class="total">${formatted}</div>
      </div>
      <div class="detail">
        <p style="margin:0 0 .35rem 0;font-weight:600;color:#333">Rincian:</p>
        <ul>
          <li>• Luas: ${areaEl.value} m²</li>
          <li>• Layanan: ${selectedService}</li>
          <li>• Material: ${selectedMaterial}</li>
          <li>• Ruangan: ${room.value} ruangan</li>
        </ul>
      </div>
      <button class="btn-primary" onclick="location.href='index.html'">Booking Konsultasi</button>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCalculatorBindings();
});

export { initCalculatorBindings };
