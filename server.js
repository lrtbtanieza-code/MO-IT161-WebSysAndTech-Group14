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

    // Validate task description
    if (
        !newTask ||
        typeof newTask.description !== 'string' ||
        newTask.description.trim() === ''
    ) {
        return res.status(400).json({
            message: 'Task description is required.'
        });
    }

    const currentTasks = readTasksFromFile();

    currentTasks.push(newTask);
    saveTasksToFile(currentTasks);

    res.status(201).json({
        message: 'Task saved successfully!',
        task: newTask
    });
});


app.put('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);
    const updatedTask = req.body;

    const currentTasks = readTasksFromFile();

    const taskIndex = currentTasks.findIndex(
        task => Number(task.id) === taskId
    );

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found.'
        });
    }

    currentTasks[taskIndex] = {
        ...currentTasks[taskIndex],
        ...updatedTask,
        id: taskId
    };

    saveTasksToFile(currentTasks);

    res.status(200).json({
        message: 'Task updated successfully!',
        task: currentTasks[taskIndex]
    });
});


// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);

    const currentTasks = readTasksFromFile();

    const updatedTasks = currentTasks.filter(
        task => Number(task.id) !== taskId
    );

    // Check if the task exists
    if (updatedTasks.length === currentTasks.length) {
        return res.status(404).json({
            message: 'Task not found.'
        });
    }

    // Save the remaining tasks
    saveTasksToFile(updatedTasks);

    res.status(200).json({
        message: 'Task deleted successfully!'
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3000`);
});