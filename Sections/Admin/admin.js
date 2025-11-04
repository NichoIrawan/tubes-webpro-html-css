// State Management
let state = {
  portfolios: [],
  services: [],
  projects: [],
  users: [],
  chatClients: [],
  chatMessages: [],
  quizQuestions: [],
  quizResults: [],
  calculatorSettings: {},
  selectedClient: null,
  activeTab: "overview",
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  loadInitialData();
  setupEventListeners();
  renderStats();
  renderAllTabs();
});

function loadInitialData() {
  const storedPortfolios = localStorage.getItem("portfolios");
  state.portfolios = storedPortfolios
    ? JSON.parse(storedPortfolios)
    : [
        {
          id: 1,
          title: "Modern Minimalist House",
          category: "Residential",
          imageUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          description: "A beautiful modern minimalist house with clean lines",
          completedDate: "2025-09-15",
          showOnHomepage: true,
          isActive: true,
        },
      ];

  // Load Services
  const storedServices = localStorage.getItem("services");
  state.services = storedServices
    ? JSON.parse(storedServices)
    : [
        {
          id: 1,
          name: "Desain Interior",
          description: "Layanan desain interior lengkap untuk rumah dan kantor",
          price: "Mulai dari Rp 10.000.000",
          duration: "2-4 bulan",
          isActive: true,
          showOnHomepage: true,
        },
      ];

  // Load Calculator Settings
  const storedSettings = localStorage.getItem("calculatorSettings");
  state.calculatorSettings = storedSettings
    ? JSON.parse(storedSettings)
    : {
        basePrice: 2500000,
        serviceMultipliers: { interior: 1, architecture: 1.5, renovation: 1.2 },
        materialMultipliers: { standard: 1, premium: 1.5, luxury: 2 },
        roomMultiplierPercentage: 10,
        baseRoomCount: 3,
      };

  // Load Quiz Questions
  const storedQuestions = localStorage.getItem("quizQuestions");
  state.quizQuestions = storedQuestions ? JSON.parse(storedQuestions) : [];

  // Load Quiz Results
  const storedResults = localStorage.getItem("quizResults");
  state.quizResults = storedResults ? JSON.parse(storedResults) : [];

  // Sample Projects
  state.projects = [
    {
      id: 1,
      clientName: "Budi Santoso",
      projectName: "Renovasi Rumah Utama",
      service: "Desain Interior",
      status: "in_progress",
      startDate: "2025-09-15",
      budget: 150000000,
      progress: 65,
    },
  ];

  // Sample Users
  state.users = [
    {
      id: 1,
      name: "Admin Utama",
      email: "admin@cema.com",
      role: "admin",
      joinDate: "2024-01-01",
      status: "active",
    },
  ];

  // Sample Chat Clients
  state.chatClients = [
    {
      id: 2,
      name: "Budi Santoso",
      email: "budi@example.com",
      lastMessage: "Kapan kita bisa meeting untuk review desain?",
      unreadCount: 2,
      online: true,
    },
  ];

  // Sample Chat Messages
  state.chatMessages = [
    {
      id: 1,
      senderId: 2,
      senderName: "Budi Santoso",
      message: "Halo, saya ingin tanya tentang progress proyek",
      timestamp: "30/10/2025 10:30:00",
      isAdmin: false,
    },
  ];
}

// Setup Event Listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".tab-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      const tab = e.currentTarget.dataset.tab;
      switchTab(tab);
    });
  });

  // Listen for storage updates
  window.addEventListener("storage", handleStorageUpdate);
  window.addEventListener("quizResultsUpdated", handleQuizResultsUpdate);
}

// Tab Switching
function switchTab(tabName) {
  state.activeTab = tabName;

  // Update triggers
  document.querySelectorAll(".tab-trigger").forEach((trigger) => {
    trigger.classList.remove("active");
    if (trigger.dataset.tab === tabName) {
      trigger.classList.add("active");
    }
  });

  // Update content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(tabName).classList.add("active");

  // Render tab content
  renderTabContent(tabName);
}

// Render All Tabs
function renderAllTabs() {
  renderOverview();
  renderPortfolio();
  renderServices();
  renderChat();
  renderProjects();
  renderUsers();
  renderCalculator();
  renderQuiz();
}

// Render Stats
function renderStats() {
  const stats = {
    totalProjects: state.projects.length,
    activeProjects: state.projects.filter((p) => p.status === "in_progress")
      .length,
    completedProjects: state.projects.filter((p) => p.status === "completed")
      .length,
    totalClients: state.users.filter((u) => u.role === "client").length,
    totalRevenue: state.projects.reduce((sum, p) => sum + p.budget, 0),
    totalQuizResults: state.quizResults.length,
  };

  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Proyek</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div class="stat-card-value">${stats.totalProjects}</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Proyek Aktif</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div class="stat-card-value">${stats.activeProjects}</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Proyek Selesai</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div class="stat-card-value">${stats.completedProjects}</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Klien</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="stat-card-value">${stats.totalClients}</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Total Revenue</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </div>
            <div class="stat-card-value text-sm">${formatCurrency(
              stats.totalRevenue
            )}</div>
        </div>
        <div class="stat-card">
            <div class="stat-card-header">
                <span>Quiz Results</span>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="2" ry="2"></rect></svg>
            </div>
            <div class="stat-card-value">${stats.totalQuizResults}</div>
        </div>
    `;
}

// Render Tab Content
function renderTabContent(tabName) {
  switch (tabName) {
    case "overview":
      renderOverview();
      break;
    case "portfolio":
      renderPortfolio();
      break;
    case "services":
      renderServices();
      break;
    case "chat":
      renderChat();
      break;
    case "projects":
      renderProjects();
      break;
    case "users":
      renderUsers();
      break;
    case "calculator":
      renderCalculator();
      break;
    case "quiz":
      renderQuiz();
      break;
  }
}

// Render Overview Tab
function renderOverview() {
  const content = document.getElementById("overview");
  content.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <h3 class="mb-4">Proyek Terbaru</h3>
                <div class="space-y-3">
                    ${state.projects
                      .slice(0, 5)
                      .map(
                        (project) => `
                        <div class="flex-between" style="background: var(--muted); padding: 0.75rem; border-radius: 0.5rem;">
                            <div>
                                <div class="font-medium">${
                                  project.projectName
                                }</div>
                                <div class="text-sm text-muted">${
                                  project.clientName
                                }</div>
                            </div>
                            ${getStatusBadge(project.status)}
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            <div class="card">
                <h3 class="mb-4">Layanan Aktif</h3>
                <div class="space-y-3">
                    ${state.services
                      .filter((s) => s.isActive)
                      .map(
                        (service) => `
                        <div class="flex-between" style="background: var(--muted); padding: 0.75rem; border-radius: 0.5rem;">
                            <div>
                                <div class="font-medium">${service.name}</div>
                                <div class="text-sm text-muted">${service.price}</div>
                            </div>
                            <span class="badge badge-default">Aktif</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
}

// Render Portfolio Tab
function renderPortfolio() {
    console.log('Current portfolios:', state.portfolios); // Debug log
    const content = document.getElementById("portfolio");
  content.innerHTML = `
        <div class="card">
            <div class="flex-between mb-6">
                <div>
                    <h3>Kelola Portfolio</h3>
                    <p class="text-sm text-muted mt-2">${
                      state.portfolios.filter((p) => p.showOnHomepage).length
                    } dari ${
    state.portfolios.length
  } portfolio ditampilkan di homepage</p>
                </div>
                <button class="btn btn-primary" onclick="openAddPortfolioModal()">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Tambah Portfolio
                </button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Judul</th>
                            <th>Kategori</th>
                            <th>Tanggal Selesai</th>
                            <th>Status</th>
                            <th>Tampil di Home</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.portfolios
                          .map(
                            (portfolio) => `
                            <tr>
                                <td><img src="${portfolio.imageUrl}" alt="${
                              portfolio.title
                            }" style="width: 64px; height: 64px; object-fit: cover; border-radius: 0.5rem;"></td>
                                <td>${portfolio.title}</td>
                                <td><span class="badge badge-secondary">${
                                  portfolio.category
                                }</span></td>
                                <td>${portfolio.completedDate}</td>
                                <td>${
                                  portfolio.isActive !== false
                                    ? '<span class="badge badge-default">Aktif</span>'
                                    : '<span class="badge badge-secondary">Nonaktif</span>'
                                }</td>
                                <td>
                                    <button class="btn btn-sm ${
                                      portfolio.showOnHomepage
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }" onclick="togglePortfolioHomepage(${
                              portfolio.id
                            })" ${
                              portfolio.isActive === false ? "disabled" : ""
                            }>
                                        ${
                                          portfolio.showOnHomepage
                                            ? "Ya"
                                            : "Tidak"
                                        }
                                    </button>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <button class="btn btn-ghost btn-icon" onclick="togglePortfolioActive(${
                                          portfolio.id
                                        })" title="${
                              portfolio.isActive !== false
                                ? "Nonaktifkan"
                                : "Aktifkan"
                            }">
                                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">${
                                              portfolio.isActive !== false
                                                ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
                                                : '<polyline points="20 6 9 17 4 12"></polyline>'
                                            }</svg>
                                        </button>
                                        <button class="btn btn-ghost btn-icon" onclick="editPortfolio(${
                                          portfolio.id
                                        })">
                                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button class="btn btn-ghost btn-icon" onclick="deletePortfolio(${
                                          portfolio.id
                                        })">
                                            <svg class="icon" style="color: var(--destructive);" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Render Services Tab
function renderServices() {
  const content = document.getElementById("services");
  content.innerHTML = `
        <div class="card">
            <div class="flex-between mb-6">
                <div>
                    <h3>Kelola Layanan</h3>
                    <p class="text-sm text-muted mt-2">${
                      state.services.filter((s) => s.showOnHomepage).length
                    } dari maksimal 3 layanan ditampilkan di homepage</p>
                </div>
                <button class="btn btn-primary" onclick="openAddServiceModal()">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Tambah Layanan
                </button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Layanan</th>
                            <th>Deskripsi</th>
                            <th>Harga</th>
                            <th>Durasi</th>
                            <th>Status</th>
                            <th>Tampil di Home</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.services
                          .map(
                            (service) => `
                            <tr>
                                <td class="font-medium">${service.name}</td>
                                <td style="max-width: 300px;">${
                                  service.description
                                }</td>
                                <td>${service.price}</td>
                                <td>${service.duration}</td>
                                <td>${
                                  service.isActive
                                    ? '<span class="badge badge-default">Aktif</span>'
                                    : '<span class="badge badge-secondary">Nonaktif</span>'
                                }</td>
                                <td>
                                    <button class="btn btn-sm ${
                                      service.showOnHomepage
                                        ? "btn-primary"
                                        : "btn-outline"
                                    }" onclick="toggleServiceHomepage(${
                              service.id
                            })" ${!service.isActive ? "disabled" : ""}>
                                        ${
                                          service.showOnHomepage
                                            ? "Ya"
                                            : "Tidak"
                                        }
                                    </button>
                                </td>
                                <td>
                                    <div class="flex gap-2">
                                        <button class="btn btn-ghost btn-icon" onclick="toggleService(${
                                          service.id
                                        })">
                                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">${
                                              service.isActive
                                                ? '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'
                                                : '<polyline points="20 6 9 17 4 12"></polyline>'
                                            }</svg>
                                        </button>
                                        <button class="btn btn-ghost btn-icon" onclick="editService(${
                                          service.id
                                        })">
                                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button class="btn btn-ghost btn-icon" onclick="deleteService(${
                                          service.id
                                        })">
                                            <svg class="icon" style="color: var(--destructive);" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Render Chat Tab
function renderChat() {
  const content = document.getElementById("chat");
  content.innerHTML = `
        <div class="chat-grid">
            <div class="card">
                <h3 class="mb-4">Klien</h3>
                <div class="chat-list">
                    ${state.chatClients
                      .map(
                        (client) => `
                        <div class="chat-item ${
                          state.selectedClient === client.id ? "active" : ""
                        }" onclick="selectClient(${client.id})">
                            <div class="flex-between mb-1">
                                <div class="flex gap-2">
                                    <span class="online-indicator ${
                                      client.online ? "online" : "offline"
                                    }"></span>
                                    <span class="font-medium">${
                                      client.name
                                    }</span>
                                </div>
                                ${
                                  client.unreadCount > 0
                                    ? `<span class="badge badge-destructive">${client.unreadCount}</span>`
                                    : ""
                                }
                            </div>
                            <div class="text-sm text-muted">${
                              client.lastMessage
                            }</div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            <div class="chat-window">
                ${
                  state.selectedClient
                    ? `
                    <div class="chat-header">
                        <div class="flex gap-2">
                            <span class="online-indicator ${
                              state.chatClients.find(
                                (c) => c.id === state.selectedClient
                              )?.online
                                ? "online"
                                : "offline"
                            }"></span>
                            <div>
                                <div class="font-medium">${
                                  state.chatClients.find(
                                    (c) => c.id === state.selectedClient
                                  )?.name
                                }</div>
                                <div class="text-sm text-muted">${
                                  state.chatClients.find(
                                    (c) => c.id === state.selectedClient
                                  )?.online
                                    ? "Online"
                                    : "Offline"
                                }</div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-messages" id="chatMessages">
                        ${state.chatMessages
                          .filter(
                            (m) =>
                              m.senderId === state.selectedClient || m.isAdmin
                          )
                          .map(
                            (msg) => `
                            <div class="message ${
                              msg.isAdmin ? "admin" : "client"
                            }">
                                <div class="message-bubble">
                                    <div class="text-sm">${msg.message}</div>
                                    <div class="text-xs" style="opacity: 0.7; margin-top: 0.25rem;">${
                                      msg.timestamp
                                    }</div>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                    <div class="chat-input-container">
                        <div class="flex gap-2">
                            <input type="text" id="chatInput" placeholder="Ketik pesan..." class="flex-1" onkeypress="handleChatKeyPress(event)">
                            <button class="btn btn-primary" onclick="sendMessage()">
                                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </div>
                `
                    : `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align: center;">
                        <div>
                            <svg style="width: 48px; height: 48px; color: var(--muted-foreground); margin: 0 auto 1rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <p class="text-muted">Pilih klien untuk memulai chat</p>
                        </div>
                    </div>
                `
                }
            </div>
        </div>
    `;
}

function renderProjects() {
  const content = document.getElementById("projects");
  content.innerHTML = `<div class="card"><h3>Semua Proyek</h3><p class="text-muted">Daftar proyek akan ditampilkan di sini</p></div>`;
}

function renderUsers() {
  const content = document.getElementById("users");
  content.innerHTML = `<div class="card"><h3>User Management</h3><p class="text-muted">Daftar user akan ditampilkan di sini</p></div>`;
}

function renderCalculator() {
  const content = document.getElementById("calculator");
  content.innerHTML = `<div class="card"><h3>Pengaturan Kalkulator</h3><p class="text-muted">Pengaturan kalkulator akan ditampilkan di sini</p></div>`;
}

function renderQuiz() {
  const content = document.getElementById("quiz");
  content.innerHTML = `<div class="card"><h3>Design Quiz</h3><p class="text-muted">Manajemen quiz akan ditampilkan di sini</p></div>`;
}

function getStatusBadge(status) {
  switch (status) {
    case "completed":
      return '<span class="badge badge-default">Selesai</span>';
    case "in_progress":
      return '<span class="badge badge-warning">Berlangsung</span>';
    case "pending":
      return '<span class="badge badge-secondary">Menunggu</span>';
    default:
      return `<span class="badge">${status}</span>`;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function navigateToWebsite() {
  showToast("Navigasi ke website...", "success");
}

function handleLogout() {
  showToast("Logout berhasil!", "success");
}

function selectClient(clientId) {
  state.selectedClient = clientId;
  renderChat();
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  const now = new Date();
  const timestamp = now.toLocaleString("id-ID");

  state.chatMessages.push({
    id: state.chatMessages.length + 1,
    senderId: 1,
    senderName: "Admin",
    message: message,
    timestamp: timestamp,
    isAdmin: true,
  });

  input.value = "";
  renderChat();
  showToast("Pesan terkirim!", "success");
}

function handleChatKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function togglePortfolioHomepage(id) {
  const portfolio = state.portfolios.find((p) => p.id === id);
  portfolio.showOnHomepage = !portfolio.showOnHomepage;
  localStorage.setItem("portfolios", JSON.stringify(state.portfolios));
  renderPortfolio();
  renderStats();
  showToast("Pengaturan homepage berhasil diubah!", "success");
}

function toggleService(id) {
  const service = state.services.find((s) => s.id === id);
  service.isActive = !service.isActive;
  if (!service.isActive) service.showOnHomepage = false;
  localStorage.setItem("services", JSON.stringify(state.services));
  renderServices();
  showToast("Status layanan berhasil diubah!", "success");
}

function editService(id) {
  showToast("Edit service feature coming soon", "success");
}

function deleteService(id) {
  if (confirm("Hapus layanan ini?")) {
    state.services = state.services.filter((s) => s.id !== id);
    localStorage.setItem("services", JSON.stringify(state.services));
    renderServices();
    renderStats();
    showToast("Layanan berhasil dihapus!", "success");
  }
}

function openAddPortfolioModal() {
  const modalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Tambah Portfolio Baru</h3>
                <p class="modal-description">Tambahkan proyek ke portfolio untuk ditampilkan di website</p>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="portfolioTitle">Judul Proyek</label>
                    <input type="text" id="portfolioTitle" placeholder="Masukkan judul proyek">
                </div>
                <div class="form-group">
                    <label for="portfolioCategory">Kategori</label>
                    <select id="portfolioCategory">
                        <option value="">Pilih kategori</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Interior">Interior</option>
                        <option value="Architecture">Architecture</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="portfolioImage">URL Gambar</label>
                    <input type="text" id="portfolioImage" placeholder="https://example.com/image.jpg">
                </div>
                <div class="form-group">
                    <label for="portfolioDescription">Deskripsi</label>
                    <textarea id="portfolioDescription" placeholder="Deskripsi proyek"></textarea>
                </div>
                <div class="form-group">
                    <label for="portfolioDate">Tanggal Selesai</label>
                    <input type="date" id="portfolioDate">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal()">Batal</button>
                <button class="btn btn-primary" onclick="savePortfolio()">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Simpan
                </button>
            </div>
        </div>
    `;

  const modal = document.getElementById("modalContainer");
  modal.innerHTML = modalHTML;
  modal.classList.add("active");

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function openAddServiceModal() {
  const modalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Tambah Layanan Baru</h3>
                <p class="modal-description">Tambahkan layanan baru yang ditawarkan</p>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="serviceName">Nama Layanan</label>
                    <input type="text" id="serviceName" placeholder="Masukkan nama layanan">
                </div>
                <div class="form-group">
                    <label for="serviceDescription">Deskripsi</label>
                    <textarea id="serviceDescription" placeholder="Deskripsi layanan"></textarea>
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label for="servicePrice">Harga</label>
                        <input type="text" id="servicePrice" placeholder="Mulai dari Rp ...">
                    </div>
                    <div class="form-group">
                        <label for="serviceDuration">Durasi</label>
                        <input type="text" id="serviceDuration" placeholder="2-4 bulan">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeModal()">Batal</button>
                <button class="btn btn-primary" onclick="saveService()">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Simpan
                </button>
            </div>
        </div>
    `;

  const modal = document.getElementById("modalContainer");
  modal.innerHTML = modalHTML;
  modal.classList.add("active");

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function savePortfolio() {
  const title = document.getElementById("portfolioTitle").value.trim();
  const category = document.getElementById("portfolioCategory").value;
  const imageUrl = document.getElementById("portfolioImage").value.trim();
  const description = document
    .getElementById("portfolioDescription")
    .value.trim();
  const completedDate = document.getElementById("portfolioDate").value;

  if (!title || !category || !imageUrl || !description || !completedDate) {
    showToast("Semua field harus diisi!", "error");
    return;
  }

  const newPortfolio = {
    id:
      state.portfolios.length > 0
        ? Math.max(...state.portfolios.map((p) => p.id)) + 1
        : 1,
    title,
    category,
    imageUrl,
    description,
    completedDate,
    showOnHomepage: false,
    isActive: true,
  };

  state.portfolios.push(newPortfolio);
  localStorage.setItem("portfolios", JSON.stringify(state.portfolios));
  window.dispatchEvent(new Event("portfolioUpdated"));

  closeModal();
  renderPortfolio();
  renderStats();
  showToast("Portfolio berhasil ditambahkan!", "success");
}

function saveService() {
  const name = document.getElementById("serviceName").value.trim();
  const description = document
    .getElementById("serviceDescription")
    .value.trim();
  const price = document.getElementById("servicePrice").value.trim();
  const duration = document.getElementById("serviceDuration").value.trim();

  if (!name || !description || !price || !duration) {
    showToast("Semua field harus diisi!", "error");
    return;
  }

  const newService = {
    id:
      state.services.length > 0
        ? Math.max(...state.services.map((s) => s.id)) + 1
        : 1,
    name,
    description,
    price,
    duration,
    isActive: true,
    showOnHomepage: false,
  };

  state.services.push(newService);
  localStorage.setItem("services", JSON.stringify(state.services));
  window.dispatchEvent(new Event("servicesUpdated"));

  closeModal();
  renderServices();
  renderStats();
  showToast("Layanan berhasil ditambahkan!", "success");
}

function closeModal() {
  const modal = document.getElementById("modalContainer");
  modal.classList.remove("active");
  setTimeout(() => {
    modal.innerHTML = "";
  }, 300);
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon =
    type === "success"
      ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

  toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function handleStorageUpdate(event) {
  if (event.key === "portfolios") {
    state.portfolios = JSON.parse(event.newValue || "[]");
    renderPortfolio();
    renderStats();
  } else if (event.key === "services") {
    state.services = JSON.parse(event.newValue || "[]");
    renderServices();
    renderStats();
  } else if (event.key === "quizResults") {
    state.quizResults = JSON.parse(event.newValue || "[]");
    renderQuiz();
    renderStats();
  }
}

function handleQuizResultsUpdate() {
  const storedResults = localStorage.getItem("quizResults");
  state.quizResults = storedResults ? JSON.parse(storedResults) : [];
  renderQuiz();
  renderStats();
}

function togglePortfolioActive(id) {
  const portfolio = state.portfolios.find((p) => p.id === id);
  portfolio.isActive = !portfolio.isActive;
  if (!portfolio.isActive) portfolio.showOnHomepage = false;
  localStorage.setItem("portfolios", JSON.stringify(state.portfolios));
  renderPortfolio();
  renderStats();
  showToast("Status portfolio berhasil diubah!", "success");
}

function editPortfolio(id) {
  showToast("Edit portfolio feature coming soon", "success");
}

function deletePortfolio(id) {
  if (confirm("Hapus portfolio ini?")) {
    state.portfolios = state.portfolios.filter((p) => p.id !== id);
    localStorage.setItem("portfolios", JSON.stringify(state.portfolios));
    renderPortfolio();
    renderStats();
    showToast("Portfolio berhasil dihapus!", "success");
  }
}

// ===================== Helper Functions =====================

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

function getStatusBadge(status) {
  switch (status) {
    case "in_progress":
      return '<span class="badge badge-default">Berjalan</span>';
    case "completed":
      return '<span class="badge badge-success">Selesai</span>';
    case "pending":
      return '<span class="badge badge-secondary">Menunggu</span>';
    default:
      return '<span class="badge badge-muted">Tidak Diketahui</span>';
  }
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem("portfolios", JSON.stringify(state.portfolios));
        localStorage.setItem("services", JSON.stringify(state.services));
        localStorage.setItem("calculatorSettings", JSON.stringify(state.calculatorSettings));
        localStorage.setItem("quizQuestions", JSON.stringify(state.quizQuestions));
        localStorage.setItem("quizResults", JSON.stringify(state.quizResults));
        console.log('Data saved successfully:', state.portfolios); // Debug log
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showToast('Error saving data', 'error');
    }
}

// Function to save new portfolio
function savePortfolio() {
    try {
        // Get form elements
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();
        const completedDate = document.getElementById('completedDate').value;
        const showOnHomepage = document.getElementById('showOnHomepage').checked;
        const imageFile = document.getElementById('projectImage').files[0];

        // Validate required fields
        if (!title || !category || !description || !completedDate || !imageFile) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Create FileReader for image
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                // Create new portfolio object
                const newPortfolio = {
                    id: Date.now(),
                    title: title,
                    category: category,
                    imageUrl: e.target.result,
                    description: description,
                    completedDate: completedDate,
                    showOnHomepage: showOnHomepage,
                    isActive: true,
                    createdAt: new Date().toISOString()
                };

                console.log('New portfolio created:', newPortfolio); // Debug log

                // Add to state
                state.portfolios.push(newPortfolio);

                // Save to localStorage
                saveToLocalStorage();

                // Update UI
                closeModal();
                renderPortfolio();
                renderStats();

                showToast('Portfolio berhasil ditambahkan!', 'success');
            } catch (error) {
                console.error('Error creating portfolio:', error);
                showToast('Error creating portfolio', 'error');
            }
        };

        reader.onerror = function() {
            console.error('Error reading file');
            showToast('Error reading image file', 'error');
        };

        // Start reading the image file
        reader.readAsDataURL(imageFile);

    } catch (error) {
        console.error('Error in savePortfolio:', error);
        showToast('Error saving portfolio', 'error');
    }
}

// ===================== Portfolio Actions =====================

function togglePortfolioActive(id) {
  const portfolio = state.portfolios.find((p) => p.id === id);
  if (!portfolio) return;

  portfolio.isActive = !portfolio.isActive;
  if (!portfolio.isActive) portfolio.showOnHomepage = false;
  saveToLocalStorage();
  renderPortfolio();
  renderStats();
}

function togglePortfolioHomepage(id) {
  const portfolio = state.portfolios.find((p) => p.id === id);
  if (!portfolio || !portfolio.isActive) return;

  portfolio.showOnHomepage = !portfolio.showOnHomepage;
  saveToLocalStorage();
  renderPortfolio();
}

function deletePortfolio(id) {
    const portfolio = state.portfolios.find(p => p.id === id);
    if (!portfolio) return;

    const modalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Hapus Portfolio</h3>
                <button type="button" class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Apakah Anda yakin ingin menghapus portfolio "${portfolio.title}"?</p>
                <div class="warning-text">
                    <i class="fas fa-exclamation-triangle"></i>
                    Tindakan ini tidak dapat dibatalkan.
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="button" class="btn btn-danger" onclick="confirmDelete(${id})">Hapus Portfolio</button>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'portfolioModal';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function confirmDelete(id) {
    state.portfolios = state.portfolios.filter(p => p.id !== id);
    saveToLocalStorage();
    closeModal();
    renderPortfolio();
    renderStats();
    showToast('Portfolio berhasil dihapus!', 'success');
}

function editPortfolio(id) {
    const portfolio = state.portfolios.find(p => p.id === id);
    if (!portfolio) return;

    const modalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Edit Portfolio</h3>
                <button type="button" class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editPortfolioForm" class="form-grid">
                    <input type="hidden" id="portfolioId" value="${id}">
                    <div class="form-group">
                        <label for="editTitle">Judul Project</label>
                        <input type="text" id="editTitle" name="title" required value="${portfolio.title}">
                    </div>
                    
                    <div class="form-group">
                        <label for="editCategory">Kategori</label>
                        <select id="editCategory" name="category" required>
                            <option value="Residential" ${portfolio.category === 'Residential' ? 'selected' : ''}>Residential</option>
                            <option value="Commercial" ${portfolio.category === 'Commercial' ? 'selected' : ''}>Commercial</option>
                            <option value="Interior" ${portfolio.category === 'Interior' ? 'selected' : ''}>Interior</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="editProjectImage">Foto Project</label>
                        <input type="file" id="editProjectImage" name="projectImage" accept="image/*">
                        <div id="editImagePreview" class="image-preview">
                            <img src="${portfolio.imageUrl}" alt="Current Image">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="editDescription">Deskripsi Project</label>
                        <textarea id="editDescription" name="description" rows="4" required>${portfolio.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="editCompletedDate">Tanggal Selesai</label>
                        <input type="date" id="editCompletedDate" name="completedDate" required value="${portfolio.completedDate}">
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="editShowOnHomepage" name="showOnHomepage" ${portfolio.showOnHomepage ? 'checked' : ''}>
                            Tampilkan di Homepage
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="button" class="btn btn-primary" onclick="updatePortfolio(${id})">Update Portfolio</button>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'portfolioModal';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);

    const imageInput = document.getElementById('editProjectImage');
    const imagePreview = document.getElementById('editImagePreview');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    modal.style.display = 'block';
}

function openAddPortfolioModal() {
    const modalHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Tambah Portfolio Baru</h3>
                <button type="button" class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="portfolioForm" class="form-grid">
                    <div class="form-group">
                        <label for="title">Judul Project</label>
                        <input type="text" id="title" name="title" required placeholder="Masukkan judul project">
                    </div>
                    
                    <div class="form-group">
                        <label for="category">Kategori</label>
                        <select id="category" name="category" required>
                            <option value="">Pilih kategori</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Interior">Interior</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="projectImage">Foto Project</label>
                        <input type="file" id="projectImage" name="projectImage" accept="image/*" required>
                        <div id="imagePreview" class="image-preview"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Deskripsi Project</label>
                        <textarea id="description" name="description" rows="4" required placeholder="Deskripsi detail tentang project"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="completedDate">Tanggal Selesai</label>
                        <input type="date" id="completedDate" name="completedDate" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="showOnHomepage" name="showOnHomepage">
                            Tampilkan di Homepage
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
                <button type="button" class="btn btn-primary" onclick="savePortfolio()">Simpan Portfolio</button>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'portfolioModal';
    modal.innerHTML = modalHTML;
    document.body.appendChild(modal);

    // Setup image preview
    const imageInput = document.getElementById('projectImage');
    const imagePreview = document.getElementById('imagePreview');
    
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    modal.style.display = 'block';
}

// ===================== Services Actions =====================

function toggleService(id) {
  const service = state.services.find((s) => s.id === id);
  if (!service) return;

  service.isActive = !service.isActive;
  if (!service.isActive) service.showOnHomepage = false;
  saveToLocalStorage();
  renderServices();
  renderStats();
}

function toggleServiceHomepage(id) {
  const service = state.services.find((s) => s.id === id);
  if (!service || !service.isActive) return;

  service.showOnHomepage = !service.showOnHomepage;
  saveToLocalStorage();
  renderServices();
}

function deleteService(id) {
  if (confirm("Yakin ingin menghapus layanan ini?")) {
    state.services = state.services.filter((s) => s.id !== id);
    saveToLocalStorage();
    renderServices();
    renderStats();
  }
}

function editService(id) {
  const service = state.services.find((s) => s.id === id);
  if (!service) return;

  const newName = prompt("Ubah nama layanan:", service.name);
  if (newName) {
    service.name = newName;
    saveToLocalStorage();
    renderServices();
  }
}

function openAddServiceModal() {
  const name = prompt("Masukkan nama layanan baru:");
  if (!name) return;

  const newService = {
    id: Date.now(),
    name,
    description: "Deskripsi singkat layanan.",
    price: "Rp 0",
    duration: "1 bulan",
    isActive: true,
    showOnHomepage: false,
  };

  state.services.push(newService);
  saveToLocalStorage();
  renderServices();
  renderStats();
}

// ===================== Chat Functions =====================

function selectClient(id) {
  state.selectedClient = id;
  renderChat();

  const client = state.chatClients.find((c) => c.id === id);
  if (client) client.unreadCount = 0;
}

function handleChatKeyPress(e) {
  if (e.key === "Enter") sendMessage();
}

function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message || !state.selectedClient) return;

  const newMessage = {
    id: Date.now(),
    senderId: 0,
    senderName: "Admin",
    message,
    timestamp: new Date().toLocaleString("id-ID"),
    isAdmin: true,
  };

  state.chatMessages.push(newMessage);
  input.value = "";
  renderChat();

  const chatBox = document.getElementById("chatMessages");
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ===================== Quiz Update Events =====================

function handleQuizResultsUpdate() {
  renderStats();
  renderQuiz();
}

function updatePortfolio(id) {
    const form = document.getElementById('editPortfolioForm');
    const imageInput = document.getElementById('editProjectImage');
    const portfolio = state.portfolios.find(p => p.id === id);
    
    if (!portfolio) return;

    // Update text fields
    portfolio.title = form.title.value;
    portfolio.category = form.category.value;
    portfolio.description = form.description.value;
    portfolio.completedDate = form.completedDate.value;
    portfolio.showOnHomepage = form.showOnHomepage.checked;

    // Handle image update if new image was selected
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            portfolio.imageUrl = e.target.result;
            finishUpdate();
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        finishUpdate();
    }

    function finishUpdate() {
        saveToLocalStorage();
        closeModal();
        renderPortfolio();
        renderStats();
        showToast('Portfolio berhasil diupdate!', 'success');
    }
}

function closeModal() {
    try {
        const modal = document.getElementById('portfolioModal');
        if (modal) {
            modal.style.display = 'none';
            setTimeout(() => {
                modal.remove();
            }, 100);
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function handleStorageUpdate(e) {
    if (["portfolios", "services", "quizResults"].includes(e.key)) {
        loadInitialData();
        renderAllTabs();
        renderStats();
    }
}
