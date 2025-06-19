require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    // Convert completed integer values back to boolean
    const formattedTasks = tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed)
    }));
    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error fetching tasks',
      details: error.message 
    });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    // Convert boolean to integer for SQLite
    const completedInt = completed ? 1 : 0;

    const stmt = db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?');
    const info = stmt.run(title, description || '', completedInt, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error updating task',
      details: error.message 
    });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { title, description, completed } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Convert boolean to integer for SQLite
    const completedInt = completed ? 1 : 0;

    // Check if database connection is working
    console.log('Database file:', db.pragma('database_list'));
    
    const stmt = db.prepare('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)');
    console.log('SQL Statement prepared');
    const info = stmt.run(title, description || '', completedInt);
    console.log('Task inserted with ID:', info.lastInsertRowid);
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
    console.log('Retrieved task:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error creating task',
      details: error.message 
    });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    console.log('Request to update task:', req.params.id);
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const stmt = db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?');
    const info = stmt.run(title, description, completed, id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
