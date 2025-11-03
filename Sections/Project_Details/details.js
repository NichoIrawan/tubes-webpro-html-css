import "../../Components/navbar.js";
import "../../Components/footer.js";

// Get project ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("id") || "1"; // Default to '1' if no ID provided

// Project data (simulated - replace with fetch from your data source)
const allProjects = [
  {
    id: "1",
    name: "Renovasi Rumah Utama",
    status: "in_progress",
    progress: 65,
    phase: "Desain 3D",
    startDate: "15 Sep 2025",
    estimatedEnd: "15 Des 2025",
    budget: 150000000,
    spent: 97500000,
    timeline: [
      { phase: "Konsultasi", status: "completed", date: "15 Sep" },
      { phase: "Desain Konsep", status: "completed", date: "25 Sep" },
      { phase: "Desain 3D", status: "in_progress", date: "10 Okt" },
      { phase: "Revisi", status: "pending", date: "TBD" },
      { phase: "Eksekusi", status: "pending", date: "TBD" },
    ],
  },
  // Add more projects as needed
];

const upcomingMeetings = [
  {
    id: 1,
    title: "Review Desain 3D",
    date: "5 Nov 2025",
    time: "14:00 - 15:00",
    type: "Online",
  },
  {
    id: 2,
    title: "Site Visit",
    date: "12 Nov 2025",
    time: "10:00 - 12:00",
    type: "Offline",
  },
];

// Helper functions
function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function getStatusConfig(status) {
  switch (status) {
    case "completed":
      return { icon: "check-circle", color: "#8CC55A", label: "Selesai" };
    case "in_progress":
      return { icon: "clock", color: "#E2B546", label: "Berlangsung" };
    case "pending":
      return { icon: "alert-circle", color: "#868686", label: "Menunggu" };
    default:
      return { icon: "clock", color: "#868686", label: "Unknown" };
  }
}

// Initialize page data
function initializeProject(project) {
  // Update project header
  document.getElementById("project-name").textContent = project.name;
  document.getElementById("project-phase").textContent = project.phase;

  // Update progress
  document.getElementById(
    "progress-percentage"
  ).textContent = `${project.progress}%`;
  document.getElementById("progress-fill").style.width = `${project.progress}%`;

  // Update dates and budget
  document.getElementById("start-date").textContent = project.startDate;
  document.getElementById("end-date").textContent = project.estimatedEnd;
  document.getElementById("budget").textContent = formatCurrency(
    project.budget
  );
  document.getElementById("spent").textContent = formatCurrency(project.spent);

  // Update budget card
  const budgetPercentage = (project.spent / project.budget) * 100;
  document.getElementById(
    "budget-percentage"
  ).textContent = `${budgetPercentage.toFixed(0)}%`;
  document.getElementById("budget-fill").style.width = `${budgetPercentage}%`;
  document.getElementById("total-budget").textContent = formatCurrency(
    project.budget
  );
  document.getElementById("total-spent").textContent = formatCurrency(
    project.spent
  );
  document.getElementById("remaining-budget").textContent = formatCurrency(
    project.budget - project.spent
  );

  // Render timeline
  renderTimeline(project.timeline);
}

function renderTimeline(timeline) {
  const timelineList = document.getElementById("timeline-list");
  timelineList.innerHTML = timeline
    .map((item) => {
      const status = getStatusConfig(item.status);
      return `
      <div class="timeline-item">
        <div class="timeline-icon" style="background: ${status.color}20">
          <div class="icon icon-${
            status.icon
          }" style="filter: brightness(0) saturate(100%) ${status.color
        .replace("#", "url(#")
        .toLowerCase()}"></div>
        </div>
        <div>
          <div class="timeline-phase">${item.phase}</div>
          <div class="timeline-date">${item.date}</div>
        </div>
        <div class="badge" style="background: ${status.color}">${
        status.label
      }</div>
      </div>
    `;
    })
    .join("");
}

function renderMeetings() {
  const meetingList = document.getElementById("meeting-list");
  meetingList.innerHTML = upcomingMeetings
    .map(
      (meeting) => `
    <div class="meeting-item">
      <h4>${meeting.title}</h4>
      <div class="meeting-meta">
        <div class="meeting-date">
          <div class="icon icon-calendar icon-muted"></div>
          <span>${meeting.date}</span>
        </div>
        <div class="meeting-time">
          <div class="icon icon-clock icon-muted"></div>
          <span>${meeting.time}</span>
        </div>
      </div>
      <div class="badge ${meeting.type.toLowerCase()}">${meeting.type}</div>
    </div>
  `
    )
    .join("");
}

// Chat functionality
let chatMessages = [];

async function loadChatMessages() {
  try {
    const response = await fetch("/Data/chat_messages.json");
    const data = await response.json();
    chatMessages = data.messages;
    renderChatMessages();
  } catch (error) {
    console.error("Error loading chat messages:", error);
  }
}

function renderChatMessages() {
  const chatContainer = document.getElementById("chat-messages");
  chatContainer.innerHTML = chatMessages
    .map(
      (message) => `
    <div class="message ${message.sender}">
      <div class="message-content">
        <div class="message-text">${message.text}</div>
        <div class="message-time">${message.time}</div>
      </div>
    </div>
  `
    )
    .join("");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();

  if (!message) return;

  const now = new Date();
  const newMessage = {
    id: chatMessages.length + 1,
    sender: "client",
    text: message,
    time: now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: now.toISOString(),
  };

  chatMessages.push(newMessage);
  renderChatMessages();
  input.value = "";
}

// Navigation
function navigateTo(page, id) {
  // Add your navigation logic here
  console.log(`Navigating to ${page}${id ? ` with ID ${id}` : ""}`);
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  const project = allProjects.find((p) => p.id === projectId) || allProjects[0];
  initializeProject(project);
  renderMeetings();
  loadChatMessages();

  // Add event listener for chat input
  const messageInput = document.getElementById("message-input");
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
