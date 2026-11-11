const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the project folder
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..')));

const TASKS_FILE = path.join(__dirname, 'tasks.json');

function readTasksFromFile() {
    try {
        if (!fs.existsSync(TASKS_FILE)) {
            fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
            return [];
        }
        const fileData = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(fileData || '[]');
    } catch (error) {
        console.error('Error reading tasks.json:', error);
        return [];
    }
}

function saveTasksToFile(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error('Error writing to tasks.json:', error);
    }
}

// Serve mainPage.html on http://localhost:3000
app.get('/', (req, res) => {
    const primaryPath = path.join(__dirname, 'mainPage.html');
    const fallbackPath = path.join(__dirname, '..', 'mainPage.html');

    if (fs.existsSync(primaryPath)) {
        res.sendFile(primaryPath);
    } else if (fs.existsSync(fallbackPath)) {
        res.sendFile(fallbackPath);
    } else {
        res.status(404).send('mainPage.html not found in server directory.');
    }
});

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    const currentTasks = readTasksFromFile();
    currentTasks.push(newTask);
    saveTasksToFile(currentTasks);

    res.status(201).json({
        message: 'Task saved successfully!',
        task: newTask
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3000`);
});