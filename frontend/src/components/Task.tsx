'use client';

import { useState } from 'react';
import { button, checkbox, container, input, label, text } from '../styles';

interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
  };
  onDelete: (id: number) => void;
  onUpdate: (id: number, completed: boolean) => void;
}

export default function Task({ task, onDelete, onUpdate }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          completed: task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setIsEditing(false);
      // Refresh the task list after successful update
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('taskUpdated', {
          detail: { id: task.id, title: editTitle, description: editDescription, completed: task.completed }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onUpdate(task.id, e.target.checked)}
          className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
        />
        <div className="space-y-1">
          <h3 className={task.completed ? 'text-gray-500 line-through' : 'font-medium'}>
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              task.title
            )}
          </h3>
          <p className={task.completed ? 'text-gray-400 line-through' : 'text-gray-600'}>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                rows={2}
              />
            ) : (
              task.description
            )}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
        >
          Eliminar
        </button>
        {isEditing && (
          <button
            onClick={handleUpdate}
            className="px-3 py-1 text-sm text-green-600 hover:text-green-700"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}
