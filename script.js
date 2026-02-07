const API = "http://localhost:3000/api";
let token = localStorage.getItem("token") || "";
let currentUser = null;

window.onload = function() {
  if (token) {
    checkAuth();
  }
};

function showLogin(e) {
  if (e) e.preventDefault();
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
  clearAuthMessage();
}

function showRegister(e) {
  if (e) e.preventDefault();
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("loginTab").classList.remove("active");
  document.getElementById("registerTab").classList.add("active");
  clearAuthMessage();
}

function clearAuthMessage() {
  document.getElementById("authMessage").innerText = "";
  document.getElementById("authMessage").className = "mt-3 text-center";
}

function showAuthMessage(message, isError = false) {
  const msgEl = document.getElementById("authMessage");
  msgEl.innerText = message;
  msgEl.className = `mt-3 text-center ${isError ? "text-danger" : "text-success"}`;
}

async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  if (!username || !email || !password) {
    showAuthMessage("All fields are required", true);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      showAuthMessage("Registration successful! Please login.", false);
      document.getElementById("registerUsername").value = "";
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
      setTimeout(() => showLogin(), 1500);
    } else {
      showAuthMessage(data.message || "Registration failed", true);
    }
  } catch (error) {
    showAuthMessage("Network error. Please try again.", true);
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showAuthMessage("Email and password are required", true);
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem("token", token);
      showTasksSection();
      loadTasks();
    } else {
      showAuthMessage(data.message || "Login failed", true);
    }
  } catch (error) {
    showAuthMessage("Network error. Please try again.", true);
  }
}

async function checkAuth() {
  try {
    const res = await fetch(`${API}/users/profile`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      currentUser = await res.json();
      showTasksSection();
      loadTasks();
    } else {
      logout();
    }
  } catch (error) {
    logout();
  }
}

function showTasksSection() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("tasksSection").style.display = "block";
  document.getElementById("userName").innerText = currentUser?.username || "User";
  document.getElementById("userRole").innerText = `Role: ${currentUser?.role || "user"}`;
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
  
  if (currentUser?.role === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  }
}

function logout() {
  token = "";
  currentUser = null;
  localStorage.removeItem("token");
  document.getElementById("authSection").style.display = "block";
  document.getElementById("tasksSection").style.display = "none";
  document.getElementById("taskList").innerHTML = "";
  showLogin();
}

async function createTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const imageFile = document.getElementById("taskImage").files[0];

  if (!title) {
    alert("Please enter a task title");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", title);
    
    if (dueDate) {
      formData.append("dueDate", dueDate);
    }
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (res.ok) {
      document.getElementById("taskTitle").value = "";
      document.getElementById("taskDueDate").value = "";
      document.getElementById("taskImage").value = "";
      loadTasks();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to create task");
    }
  } catch (error) {
    alert("Network error");
  }
}

async function loadTasks() {
  try {
    const res = await fetch(`${API}/tasks`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
      }
      return;
    }

    const tasks = await res.json();
    const list = document.getElementById("taskList");
    const emptyMsg = document.getElementById("emptyMessage");

    list.innerHTML = "";

    if (tasks.length === 0) {
      emptyMsg.style.display = "block";
    } else {
      emptyMsg.style.display = "none";
      tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let dueDateHTML = '';
        if (dueDate) {
          dueDate.setHours(0, 0, 0, 0);
          const isOverdue = dueDate < today && !task.status;
          const dueDateStr = dueDate.toLocaleDateString('ru-RU');
          dueDateHTML = `<small class="${isOverdue ? 'text-danger' : 'text-muted'} ms-2">
            ${isOverdue ? '⚠️ ' : '📅 '}${dueDateStr}
          </small>`;
        }
        
        let imageHTML = '';
        if (task.image) {
          imageHTML = `<img src="${task.image}" alt="Task image" class="task-image mt-2" 
                       onclick="showImageModal('${task.image}')" style="cursor: pointer;">`;
        }
        
        li.innerHTML = `
          <div class="d-flex justify-content-between align-items-start">
            <div class="d-flex align-items-start gap-2 flex-grow-1">
              <input type="checkbox" class="form-check-input mt-1" ${task.status ? 'checked' : ''} 
                     onchange="toggleTaskStatus('${task._id}')" style="cursor: pointer;">
              <div>
                <span class="${task.status ? 'text-decoration-line-through text-muted' : ''}">${task.title}</span>
                ${dueDateHTML}
                ${imageHTML}
              </div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
          </div>
        `;
        list.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Failed to load tasks", error);
  }
}

async function toggleTaskStatus(id) {
  try {
    const res = await fetch(`${API}/tasks/${id}/toggle-status`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      loadTasks();
    } else {
      alert("Failed to update task status");
    }
  } catch (error) {
    alert("Network error");
  }
}

async function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      loadTasks();
    } else {
      alert("Failed to delete task");
    }
  } catch (error) {
    alert("Network error");
  }
}

function showMyTasks() {
  document.getElementById("taskSectionTitle").innerText = "My Tasks";
  loadTasks();
}

async function showAllTasks() {
  document.getElementById("taskSectionTitle").innerText = "All Tasks (Admin View)";
  
  try {
    const res = await fetch(`${API}/tasks/all`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      alert("Access denied or error loading all tasks");
      return;
    }

    const tasks = await res.json();
    const list = document.getElementById("taskList");
    const emptyMsg = document.getElementById("emptyMessage");

    list.innerHTML = "";

    if (tasks.length === 0) {
      emptyMsg.style.display = "block";
      emptyMsg.innerText = "No tasks in the system";
    } else {
      emptyMsg.style.display = "none";
      tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let dueDateHTML = '';
        if (dueDate) {
          dueDate.setHours(0, 0, 0, 0);
          const isOverdue = dueDate < today && !task.status;
          const dueDateStr = dueDate.toLocaleDateString('ru-RU');
          dueDateHTML = ` | Due: <span class="${isOverdue ? 'text-danger' : ''}">${dueDateStr}</span>`;
        }
        
        let imageHTML = '';
        if (task.image) {
          imageHTML = `<img src="${task.image}" alt="Task image" class="task-image mt-2" 
                       onclick="showImageModal('${task.image}')" style="cursor: pointer;">`;
        }
        
        li.innerHTML = `
          <div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-${task.status ? 'success' : 'secondary'}">${task.status ? 'Completed' : 'Incomplete'}</span>
              <strong class="${task.status ? 'text-decoration-line-through text-muted' : ''}">${task.title}</strong>
            </div>
            <small class="text-muted">User: ${task.user?.username || "Unknown"} (${task.user?.email || ""})${dueDateHTML}</small>
            ${imageHTML}
          </div>
          <button class="btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
        `;
        list.appendChild(li);
      });
    }
  } catch (error) {
    console.error("Failed to load all tasks", error);
    alert("Failed to load all tasks");
  }
}

async function showAllUsers() {
  try {
    const res = await fetch(`${API}/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      alert("Access denied or error loading users");
      return;
    }

    const users = await res.json();
    const adminContent = document.getElementById("adminContent");

    adminContent.innerHTML = `
      <h5>All Users (${users.length})</h5>
      <div class="list-group">
        ${users.map(user => `
          <div class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>${user.username}</strong> - ${user.email}
                <br><span class="badge bg-${user.role === 'admin' ? 'danger' : 'primary'}">${user.role}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    console.error("Failed to load users", error);
    alert("Failed to load users");
  }
}

function showImageModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "flex";
  modalImg.src = imageSrc;
}

function closeImageModal() {
  document.getElementById("imageModal").style.display = "none";
}