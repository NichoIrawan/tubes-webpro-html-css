class ChatWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.messages = [
      {
        id: 1,
        sender: "agent",
        text: "Halo! Selamat datang di Web Cema Design. Ada yang bisa saya bantu?",
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: new Date(),
      },
    ];
  }

  connectedCallback() {
    this.render();
    this.addListeners();
    this.renderMessages();
  }

  addListeners() {
    const toggle = this.shadowRoot.getElementById("chat-toggle");
    const closeBtn = this.shadowRoot.getElementById("chat-close");
    const sendBtn = this.shadowRoot.getElementById("chat-send");
    const input = this.shadowRoot.getElementById("chat-input");

    toggle.addEventListener("click", () => {
      this.shadowRoot.getElementById("chat-box").classList.toggle("hidden");
      toggle.textContent = toggle.textContent === "💬" ? "✖" : "💬";
    });

    closeBtn.addEventListener("click", () => {
      this.shadowRoot.getElementById("chat-box").classList.add("hidden");
      toggle.textContent = "💬";
    });

    sendBtn.addEventListener("click", () => this.sendMessage());
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });
  }

  isWithin5Minutes(timestamp) {
    const diff =
      (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60);
    return diff <= 5;
  }

  sendMessage() {
    const input = this.shadowRoot.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    this.messages.push({
      id: this.messages.length + 1,
      sender: "user",
      text,
      time: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: now,
    });
    input.value = "";
    this.renderMessages();

    setTimeout(() => {
      const responseTime = new Date();
      this.messages.push({
        id: this.messages.length + 1,
        sender: "agent",
        text: "Terima kasih atas pesan Anda. Tim kami akan segera merespons.",
        time: responseTime.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: responseTime,
      });
      this.renderMessages();
    }, 1000);
  }

  editMessage(id) {
    const msg = this.messages.find((m) => m.id === id);
    if (!msg || !this.isWithin5Minutes(msg.timestamp)) {
      alert("Pesan hanya dapat diedit dalam 5 menit setelah dikirim!");
      return;
    }

    this.messages.forEach((m) => (m.isEditing = false));

    msg.isEditing = true;
    this.renderMessages();
  }

  deleteMessage(id) {
    const msg = this.messages.find((m) => m.id === id);
    if (!msg || !this.isWithin5Minutes(msg.timestamp)) {
      alert("Pesan hanya dapat dihapus dalam 5 menit setelah dikirim!");
      return;
    }

    msg.text = "🗑️ Pesan berhasil dihapus";
    msg.isDeleted = true;
    msg.isEditing = false;
    this.renderMessages();
  }

  saveEdit(id, newText) {
    const msg = this.messages.find((m) => m.id === id);
    if (msg && newText && newText.trim()) {
      msg.text = newText.trim();
      msg.isEditing = false;
      this.renderMessages();
    } else {
      this.cancelEdit(id);
    }
  }

  cancelEdit(id) {
    const msg = this.messages.find((m) => m.id === id);
    if (msg) {
      msg.isEditing = false;
      this.renderMessages();
    }
  }

  renderMessages() {
    const container = this.shadowRoot.getElementById("chat-messages");
    container.innerHTML = "";

    this.messages.forEach((msg) => {
      const wrapper = document.createElement("div");
      wrapper.className = `message ${msg.sender}`;

      if (msg.isEditing) {
        const editForm = document.createElement("div");
        editForm.className = "edit-form";

        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = msg.text;
        editInput.className = "edit-input";

        setTimeout(() => editInput.focus(), 0);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "✓";
        saveBtn.onclick = () => this.saveEdit(msg.id, editInput.value);

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "✕";
        cancelBtn.onclick = () => this.cancelEdit(msg.id);

        editInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            this.saveEdit(msg.id, editInput.value);
          } else if (e.key === "Escape") {
            this.cancelEdit(msg.id);
          }
        });

        editForm.appendChild(editInput);
        editForm.appendChild(saveBtn);
        editForm.appendChild(cancelBtn);
        wrapper.appendChild(editForm);
      } else if (msg.isDeleted) {
        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = msg.text;

        bubble.style.fontStyle = "italic";

        if (msg.sender === "user") {
          bubble.style.background = "#8cc55a";
          bubble.style.color = "rgba(255, 255, 255, 0.8)";
        } else {
          bubble.style.color = "#777";
        }

        wrapper.appendChild(bubble);
      } else {
        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = msg.text;

        const time = document.createElement("div");
        time.className = "message-time";
        time.textContent = msg.time;

        wrapper.appendChild(bubble);
        wrapper.appendChild(time);

        if (msg.sender === "user" && this.isWithin5Minutes(msg.timestamp)) {
          const actions = document.createElement("div");
          actions.className = "message-actions";

          const editBtn = document.createElement("button");
          editBtn.textContent = "✎ Edit";
          editBtn.onclick = () => this.editMessage(msg.id);

          const delBtn = document.createElement("button");
          delBtn.textContent = "❌ Hapus";
          delBtn.onclick = () => this.deleteMessage(msg.id);

          actions.appendChild(editBtn);
          actions.appendChild(delBtn);
          wrapper.appendChild(actions);
        }
      }

      container.appendChild(wrapper);
    });

    container.scrollTop = container.scrollHeight;
  }

  render() {
    this.shadowRoot.innerHTML = `
          <style>
            .chat-container {
              position: fixed;
              bottom: 20px;
              right: 20px;
              z-index: 9999;
              font-family: Arial, sans-serif;
            }
            .chat-toggle {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background-color: #8cc55a;
              color: white;
              border: none;
              cursor: pointer;
              font-size: 24px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
              transition: transform 0.2s, background-color 0.3s;
            }
            .chat-toggle:hover {
              transform: scale(1.1);
              background-color: #7ab84a;
            }
            .chat-box {
              position: absolute;
              bottom: 80px;
              right: 0;
              width: 320px;
              height: 500px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }
            .hidden {
              display: none;
            }
            .chat-header {
              display: flex;
              align-items: center;
              background-color: #8cc55a;
              color: white;
              padding: 12px;
            }
            .chat-header-icon {
              width: 36px;
              height: 36px;
              background: rgba(255, 255, 255, 0.2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 10px;
            }
            .chat-title {
              font-weight: bold;
            }
            .chat-status {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.8);
            }
            .chat-close {
              margin-left: auto;
              background: transparent;
              border: none;
              color: white;
              font-size: 18px;
              cursor: pointer;
            }
            .chat-messages {
              background: #f7f7f7;
              padding: 12px;
              flex-grow: 1;
              overflow-y: auto;
              max-height: 400px;
              display: flex;
              flex-direction: column;
            }
            .message {
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              max-width: 75%;
            }
            .message.agent {
              align-items: flex-start;
            }
            .message.user {
              align-items: flex-end;
              margin-left: auto;
            }
            .message-bubble {
              padding: 8px 4px;
              border-radius: 8px;
              background: rgb(231, 227, 227);
              color: #333;
            }
            .message.user .message-bubble {
              background: #8cc55a;
              color: white;
            }
            .message-time {
              font-size: 10px;
              color: #777;
              margin-top: 4px;
            }
            .message.user .message-time {
              color: rgba(255, 255, 255, 0.8);
            }
            .message-actions {
              display: flex;
              gap: 6px;
              margin-top: 4px;
            }
            .message-actions button {
              background: transparent;
              border: none;
              cursor: pointer;
              font-size: 12px;
              color: #777;
            }
            .message-actions button:hover {
              color: #333;
            }
            .chat-input-area {
              display: flex;
              padding: 10px;
              border-top: 1px solid #ddd;
              background: #fff;
            }
            .chat-input {
              flex-grow: 1;
              padding: 8px;
              border-radius: 8px;
              border: 1px solid #ccc;
              outline: none;
            }
            .chat-input:focus {
              border-color: #8cc55a;
            }
            .chat-send {
              margin-left: 8px;
              background: #8cc55a;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 8px;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .chat-send:hover {
              background-color: #7ab84a;
            }
            .edit-form {
              display: flex;
              gap: 6px;
              background: #8cc55a;
              padding: 8px 12px;
              border-radius: 8px;
              align-items: center;
            }
            .edit-input {
              flex-grow: 1;
              background: rgba(255, 255, 255, 0.2);
              border: 1px solid rgba(255, 255, 255, 0.5);
              border-radius: 4px;
              padding: 6px;
              color: white;
              outline: none;
              font-family: Arial, sans-serif;
              font-size: 14px;
            }
            .edit-form button {
              background: #f0f0f0;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              width: 28px;
              height: 28px;
              font-size: 14px;
              line-height: 28px;
              text-align: center;
              padding: 0;
              flex-shrink: 0;
              color: #333;
            }
            .edit-form button:hover {
              background: #ddd;
            }
          </style>
      
          <div class="chat-container">
            <button id="chat-toggle" class="chat-toggle">💬</button>
      
            <div id="chat-box" class="chat-box hidden">
              <div class="chat-header">
                <div class="chat-header-icon">💬</div>
                <div>
                  <div class="chat-title">Customer Service</div>
                  <div class="chat-status"></div>
                </div>
                <button id="chat-close" class="chat-close">✖</button>
              </div>
      
              <div id="chat-messages" class="chat-messages"></div>
      
              <div class="chat-input-area">
                <input
                  type="text"
                  id="chat-input"
                  placeholder="Ketik pesan..."
                  class="chat-input"
                />
                <button id="chat-send" class="chat-send">↪</button>
              </div>
            </div>
          </div>
        `;
  }
}

customElements.define("chat-widget", ChatWidget);
