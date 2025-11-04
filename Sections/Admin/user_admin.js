let users = [];

async function initializeUsers() {
  try {
    const response = await fetch("https://dummyjson.com/users");
    if (response.ok) {
      const data = await response.json();
      users = data.users.slice(0, 10).map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.id === 1 ? "admin" : "client",
        joinDate: "2024-01-01",
        status: "active",
      }));
    } else {
      console.error("Failed to fetch users from DummyJSON");
      users = [];
    }
  } catch (error) {
    console.error("Error loading users:", error);
    users = [];
  }

  return users;
}

async function saveUsersToJson() {
  try {
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Simulated save to DummyJSON:", result);
    } else {
      console.error("Failed to save users");
    }
  } catch (error) {
    console.error("Error saving users:", error);
  }
}

function renderUsers() {
  const content = document.getElementById("users");
  content.innerHTML = `
    <div class="card">
      <div class="flex-between mb-4">
        <h3>User Management</h3>
        <button class="btn btn-primary" onclick="userModule.openAddUserModal()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah User
        </button>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tanggal Bergabung</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${users
              .map(
                (user) => `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                  <span class="badge ${
                    user.role === "admin"
                      ? "badge-destructive"
                      : "badge-default"
                  }">
                    ${user.role === "admin" ? "Admin" : "Client"}
                  </span>
                </td>
                <td>${user.joinDate}</td>
                <td>
                  <span class="badge badge-success">
                    ${user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button 
                      class="btn-icon" 
                      onclick="userModule.toggleUserRole(${user.id})"
                      title="Toggle Role">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </button>
                    <button 
                      class="btn-icon btn-icon-warning" 
                      onclick="userModule.openEditUserModal(${user.id})"
                      title="Edit User">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      class="btn-icon btn-icon-danger" 
                      onclick="userModule.deleteUser(${user.id})"
                      title="Delete User">
                      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
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

function openAddUserModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "userModal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Tambah User Baru</h3>
        <button class="modal-close" onclick="userModule.closeUserModal()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="text-muted mb-4">Tambahkan user baru atau admin ke sistem</p>
        
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            id="userName" 
            class="form-control" 
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            id="userEmail" 
            class="form-control" 
            placeholder="email@example.com"
          />
        </div>

        <div class="form-group">
          <label>Role</label>
          <select id="userRole" class="form-control">
            <option value="admin">Admin</option>
            <option value="client" selected>Client</option>
          </select>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            id="userPassword" 
            class="form-control" 
            placeholder="••••••••"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="userModule.closeUserModal()">Batal</button>
        <button class="btn-primary" onclick="userModule.saveUser()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Simpan
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("active"), 10);
}

function openEditUserModal(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "userModal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit User</h3>
        <button class="modal-close" onclick="userModule.closeUserModal()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="text-muted mb-4">Ubah informasi user</p>
        
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            id="userName" 
            class="form-control" 
            value="${user.name}"
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            id="userEmail" 
            class="form-control" 
            value="${user.email}"
          />
        </div>

        <div class="form-group">
          <label>Role</label>
          <select id="userRole" class="form-control">
            <option value="admin" ${
              user.role === "admin" ? "selected" : ""
            }>Admin</option>
            <option value="client" ${
              user.role === "client" ? "selected" : ""
            }>Client</option>
          </select>
        </div>

        <div class="form-group">
          <label>Password (Kosongkan jika tidak ingin mengubah)</label>
          <input 
            type="password" 
            id="userPassword" 
            class="form-control" 
            placeholder="••••••••"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-outline" onclick="userModule.closeUserModal()">Batal</button>
        <button class="btn-primary" onclick="userModule.updateUser(${userId})">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Simpan Perubahan
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("active"), 10);
}

async function saveUser() {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;
  const password = document.getElementById("userPassword").value;

  if (!name || !email || !password) {
    showUserToast("Semua field harus diisi!", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showUserToast("Format email tidak valid!", "error");
    return;
  }

  if (users.some((u) => u.email === email)) {
    showUserToast("Email sudah terdaftar!", "error");
    return;
  }

  try {
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
        email: email,
        role: role,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("User added (simulated):", result);

      const newUser = {
        id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        name,
        email,
        role,
        joinDate: new Date().toISOString().split("T")[0],
        status: "active",
      };

      users.push(newUser);
      renderUsers();
      closeUserModal();
      showUserToast("User berhasil ditambahkan!", "success");
    }
  } catch (error) {
    console.error("Error adding user:", error);
    showUserToast("Gagal menambahkan user!", "error");
  }
}

async function updateUser(userId) {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;
  const password = document.getElementById("userPassword").value;

  if (!name || !email) {
    showUserToast("Nama dan email harus diisi!", "error");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showUserToast("Format email tidak valid!", "error");
    return;
  }

  if (users.some((u) => u.email === email && u.id !== userId)) {
    showUserToast("Email sudah terdaftar!", "error");
    return;
  }

  try {
    const response = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
        email: email,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("User updated (simulated):", result);

      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name,
          email,
          role,
        };

        renderUsers();
        closeUserModal();
        showUserToast("User berhasil diperbarui!", "success");
      }
    }
  } catch (error) {
    console.error("Error updating user:", error);
    showUserToast("Gagal memperbarui user!", "error");
  }
}

async function toggleUserRole(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const newRole = user.role === "admin" ? "client" : "admin";

  if (confirm(`Ubah role ${user.name} menjadi ${newRole}?`)) {
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User role updated (simulated):", result);

        user.role = newRole;
        renderUsers();
        showUserToast(`Role berhasil diubah menjadi ${newRole}!`, "success");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      showUserToast("Gagal mengubah role!", "error");
    }
  }
}

async function deleteUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  if (confirm(`Apakah Anda yakin ingin menghapus user ${user.name}?`)) {
    try {
      const response = await fetch(`https://dummyjson.com/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User deleted (simulated):", result);

        users = users.filter((u) => u.id !== userId);
        renderUsers();
        showUserToast("User berhasil dihapus!", "success");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showUserToast("Gagal menghapus user!", "error");
    }
  }
}

function closeUserModal() {
  const modal = document.getElementById("userModal");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => modal.remove(), 300);
  }
}

function showUserToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        ${
          type === "success"
            ? '<polyline points="20 6 9 17 4 12"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
        }
      </svg>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getUsers() {
  return users;
}

window.userModule = {
  initializeUsers,
  renderUsers,
  openAddUserModal,
  openEditUserModal,
  saveUser,
  updateUser,
  toggleUserRole,
  deleteUser,
  closeUserModal,
  getUsers,
};
