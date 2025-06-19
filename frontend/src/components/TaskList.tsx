'use client';

import { useState, useEffect } from 'react';
import Task from './Task';
import { container, error, loading, emptyState } from '../styles/index';
import TaskForm from './TaskForm';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Listen for task updates
  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      const updatedTask = event.detail;
      setTasks(tasks.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      ));
    };

    window.addEventListener('taskUpdated', handleTaskUpdated);
    return () => window.removeEventListener('taskUpdated', handleTaskUpdated);
  }, [tasks]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((task: any) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks(tasks.map((task: any) =>
        task.id === id ? { ...task, completed } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="space-y-6">
      <TaskForm onTaskCreated={refreshTasks} />
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}
      {tasks.map((task: any) => (
        <div
          key={task.id}
          className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow"
        >
          <Task
            task={task}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      ))}
      {tasks.length === 0 && !loading && !error && (
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-500">No hay tareas</p>
        </div>
      )}
    </div>
  );
}
