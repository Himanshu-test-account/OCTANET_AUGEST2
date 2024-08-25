document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();

    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

const apiUrl = 'http://localhost:3000/tasks';

function fetchTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                li.innerHTML = `
                    <span>${task.text}</span>
                    <button class="edit" onclick="editTask(${task.id}, '${task.text}')">Edit</button>
                    <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                `;
                taskList.appendChild(li);
            });
        });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    if (text) {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(() => {
            taskInput.value = '';
            fetchTasks();
        });
    }
}

function editTask(id, oldText) {
    const newText = prompt('Edit task:', oldText);
    if (newText !== null) {
        fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText })
        })
        .then(() => fetchTasks());
    }
}

function deleteTask(id) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(() => fetchTasks());
}

function toggleTask(id) {
    fetch(`${apiUrl}/${id}/toggle`, { method: 'PATCH' })
        .then(() => fetchTasks());
}
