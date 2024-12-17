const authSection = document.getElementById('auth-section');
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');

const tabs = document.getElementById('tabs');
const tabButtons = document.querySelectorAll('.tab-button');
const logoutButton = document.getElementById('logout');

const todoSection = document.getElementById('todo');
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

const remindersSection = document.getElementById('reminders');
const reminderForm = document.getElementById('reminderForm');
const reminderInput = document.getElementById('reminderInput');
const reminderTime = document.getElementById('reminderTime');
const reminderList = document.getElementById('reminderList');

const recoveryModal = document.getElementById('recovery-modal');
const closeModalBtn = document.getElementById('close-modal');
const forgotPasswordBtn = document.getElementById('forgot-password');
const recoveryForm = document.getElementById('recoveryForm');
const recoveryMessage = document.getElementById('recoveryMessage');

const pomodoroSection = document.getElementById('pomodoro');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');

let currentUser = null;

let timer;
let isRunning = false;
let isWorkSession = true;
let workDuration = 25 * 60; 
let shortBreak = 5 * 60;   
let longBreak = 15 * 60;    
let currentTime = workDuration;

function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => {
        if (sec.id === section) {
            sec.classList.remove('hidden');
        } else {
            sec.classList.add('hidden');
        }
    });
}

function showTabs() {
    tabs.classList.remove('hidden');
}

function hideTabs() {
    tabs.classList.add('hidden');
}

function loadTodos() {
    if (!currentUser) return;
    const todos = JSON.parse(localStorage.getItem(`${currentUser}_todos`)) || [];
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        if (todo.completed) {
            li.classList.add('completed');
        }

        const completeBtn = document.createElement('button');
        completeBtn.textContent = todo.completed ? 'Uncomplete' : 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.onclick = () => toggleComplete(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => deleteTodo(index);

        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function addTodo(todoText) {
    const todos = JSON.parse(localStorage.getItem(`${currentUser}_todos`)) || [];
    todos.push({ text: todoText, completed: false });
    localStorage.setItem(`${currentUser}_todos`, JSON.stringify(todos));
    loadTodos();
}

function deleteTodo(index) {
    if (confirm('Are you sure you want to delete this task?')) {
        const todos = JSON.parse(localStorage.getItem(`${currentUser}_todos`)) || [];
        todos.splice(index, 1);
        localStorage.setItem(`${currentUser}_todos`, JSON.stringify(todos));
        loadTodos();
    }
}

function toggleComplete(index) {
    const todos = JSON.parse(localStorage.getItem(`${currentUser}_todos`)) || [];
    todos[index].completed = !todos[index].completed;
    localStorage.setItem(`${currentUser}_todos`, JSON.stringify(todos));
    loadTodos();
}

function loadReminders() {
    if (!currentUser) return;
    const reminders = JSON.parse(localStorage.getItem(`${currentUser}_reminders`)) || [];
    reminderList.innerHTML = '';
    reminders.forEach((reminder, index) => {
        const li = document.createElement('li');
        li.textContent = `${reminder.text} at ${new Date(reminder.time).toLocaleString()}`;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteReminder(index);
        li.appendChild(deleteBtn);
        reminderList.appendChild(li);
    });
}

function addReminder(text, time) {
    const reminders = JSON.parse(localStorage.getItem(`${currentUser}_reminders`)) || [];
    reminders.push({ text, time, notified: false });
    localStorage.setItem(`${currentUser}_reminders`, JSON.stringify(reminders));
    loadReminders();
}

function deleteReminder(index) {
    const reminders = JSON.parse(localStorage.getItem(`${currentUser}_reminders`)) || [];
    reminders.splice(index, 1);
    localStorage.setItem(`${currentUser}_reminders`, JSON.stringify(reminders));
    loadReminders();
}

function checkReminders() {
    if (!currentUser) return;
    const reminders = JSON.parse(localStorage.getItem(`${currentUser}_reminders`)) || [];
    const now = new Date().getTime();
    reminders.forEach(reminder => {
        if (!reminder.notified && new Date(reminder.time).getTime() <= now) {
            alert(`Reminder: ${reminder.text}`);
            reminder.notified = true;
            localStorage.setItem(`${currentUser}_reminders`, JSON.stringify(reminders));
        }
    });
}

function showLoginForm() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showRegisterForm() {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

function openRecoveryModal() {
    recoveryModal.classList.remove('hidden');
}

function closeRecoveryModal() {
    recoveryModal.classList.add('hidden');
    recoveryForm.reset();
    recoveryMessage.textContent = '';
    recoveryMessage.style.color = '#ff5252';
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timer = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            alert(isWorkSession ? 'Work session completed! Time for a short break.' : 'Break completed! Time to work.');
            toggleSession();
        }
    }, 1000);
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
}

function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkSession = true;
    currentTime = workDuration;
    updateTimerDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
}

function toggleSession() {
    isWorkSession = !isWorkSession;
    currentTime = isWorkSession ? workDuration : shortBreak;
    updateTimerDisplay();
    startTimer();
}


showLoginBtn.addEventListener('click', () => {
    showLoginForm();
});

showRegisterBtn.addEventListener('click', () => {
    showRegisterForm();
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    if (!email || !password) {
        registerMessage.textContent = 'Please enter email and password.';
        return;
    }

    if (localStorage.getItem(`user_${email}`)) {
        registerMessage.textContent = 'User already exists. Please login.';
        return;
    }

    localStorage.setItem(`user_${email}`, JSON.stringify({ email, password }));
    registerMessage.style.color = '#4caf50';
    registerMessage.textContent = 'Registration successful! You are now logged in.';
    registerForm.reset();
    currentUser = email;
    localStorage.setItem('currentUser', currentUser);
    authSection.classList.add('hidden');
    showTabs();
    showSection('todo');
    loadTodos();
    loadReminders();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        loginMessage.textContent = 'Please enter email and password.';
        return;
    }

    const userData = JSON.parse(localStorage.getItem(`user_${email}`));
    if (!userData) {
        loginMessage.textContent = 'User does not exist. Please register.';
        return;
    }

    if (userData.password !== password) {
        loginMessage.textContent = 'Incorrect password.';
        return;
    }

    loginMessage.style.color = '#4caf50';
    loginMessage.textContent = 'Login successful!';
    loginForm.reset();
    currentUser = email;
    localStorage.setItem('currentUser', currentUser);
    authSection.classList.add('hidden');
    showTabs();
    showSection('todo');
    loadTodos();
    loadReminders();
});

forgotPasswordBtn.addEventListener('click', () => {
    openRecoveryModal();
});

closeModalBtn.addEventListener('click', () => {
    closeRecoveryModal();
});

window.addEventListener('click', (event) => {
    if (event.target === recoveryModal) {
        closeRecoveryModal();
    }
});

recoveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const recoveryEmail = document.getElementById('recovery-email').value.trim();

    if (!recoveryEmail) {
        recoveryMessage.textContent = 'Please enter your email.';
        return;
    }

    const userData = JSON.parse(localStorage.getItem(`user_${recoveryEmail}`));
    if (!userData) {
        recoveryMessage.textContent = 'Email not found. Please register.';
        return;
    }

    recoveryMessage.style.color = '#4caf50';
    recoveryMessage.textContent = 'Recovery code has been sent to your email.';
    recoveryForm.reset();

});

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');
        showSection(tab);
    });
});

logoutButton.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideTabs();
    showSection('auth-section');
    authSection.classList.remove('hidden');
    registerMessage.textContent = '';
    loginMessage.textContent = '';
});

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoText = todoInput.value.trim();
    if (todoText) {
        addTodo(todoText);
        todoForm.reset();
    }
});

reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = reminderInput.value.trim();
    const time = reminderTime.value;
    if (text && time) {
        addReminder(text, time);
        reminderForm.reset();
    }
});

startBtn.addEventListener('click', () => {
    startTimer();
});

pauseBtn.addEventListener('click', () => {
    pauseTimer();
});

resetBtn.addEventListener('click', () => {
    resetTimer();
});

window.onload = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        authSection.classList.add('hidden');
        showTabs();
        showSection('todo');
        loadTodos();
        loadReminders();
    } else {
        hideTabs();
        showSection('auth-section');
    }
};

setInterval(checkReminders, 60000);
