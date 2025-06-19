import { StyleObject } from './types';

export const taskCard: StyleObject = {
  base: 'bg-white rounded-lg shadow-md',
  padding: 'p-6',
  hover: 'hover:shadow-lg',
};

export const button: StyleObject = {
  base: 'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500',
  danger: 'text-red-600 bg-red-100 hover:bg-red-200 focus:ring-red-500',
  edit: 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500',
};

export const input: StyleObject = {
  base: 'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-indigo-500',
  border: 'border-gray-300',
  focus: 'focus:ring-indigo-500',
};

export const checkbox: StyleObject = {
  base: 'w-4 h-4 text-indigo-600 focus:ring-indigo-500',
};

export const text: StyleObject = {
  title: 'text-lg font-medium',
  description: 'text-gray-600',
  date: 'text-sm text-gray-500',
  completed: 'line-through text-gray-500',
};

export const container: StyleObject = {
  base: 'space-y-4',
  form: 'space-y-4',
  taskList: 'space-y-4',
};

export const label: StyleObject = {
  base: 'block text-sm font-medium text-gray-700',
};

export const loading: StyleObject = {
  base: 'animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto',
};

export const error: StyleObject = {
  message: 'p-4 bg-red-100 border border-red-400 text-red-700 rounded',
};

export const emptyState: StyleObject = {
  base: 'p-4 text-center bg-gray-50 rounded-lg',
  text: 'text-gray-500',
};
