import TaskList from '@/components/TaskList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A simple todo application',
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Organiza tus tareas de manera sencilla</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
          <TaskList />
        </div>
      </div>
    </main>
  );
}
