const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];
let nextId = 1;

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { text } = req.body;
    if (text) {
        const task = { id: nextId++, text, completed: false };
        tasks.push(task);
        res.status(201).json(task);
    } else {
        res.status(400).json({ error: 'Text is required' });
    }
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.text = text;
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== parseInt(id));
    res.status(204).end();
});

app.patch('/tasks/:id/toggle', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = !task.completed;
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
