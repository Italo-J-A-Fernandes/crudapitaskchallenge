import { Database } from './database.js';
import { randomUUID } from 'node:crypto';

import { buildRoutePath } from './utils/build-routes-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handle: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handle: (req, res) => {
      const { title, description } = req.body;

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', tasks);

      return res.writeHead(201).end('Tarefa cadastrado com sucesso!');
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handle: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      database.update('tasks', id, {
        title,
        description,
      });

      return res.writeHead(204).end('Tarefa atualizada com sucesso!');
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handle: (req, res) => {
      const { id } = req.params;

      database.complete('tasks', id);

      return res.writeHead(204).end('Tarefa atualizada com sucesso!');
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handle: (req, res) => {
      const { id } = req.params;

      database.delete('tasks', id);

      return res.writeHead(204).end('Tarefa removida com sucesso!');
    },
  },
];
