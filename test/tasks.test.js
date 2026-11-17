import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createUsersService } from '../src/users/users.service.js';
import { createTasksService } from '../src/tasks/tasks.service.js';

let users;
let tasks;
let sami;

beforeEach(() => {
  users = createUsersService();
  tasks = createTasksService({ users });
  sami = users.createUser({ name: 'Sami', email: 'sami@example.com' });
});

test('createTask makes a todo task for an existing user', () => {
  const task = tasks.createTask({ title: 'Write README', userId: sami.id });

  assert.equal(task.id, 1);
  assert.equal(task.title, 'Write README');
  assert.equal(task.status, 'todo');
  assert.equal(task.userId, sami.id);
});

test('createTask rejects an empty title', () => {
  assert.throws(() => tasks.createTask({ title: '   ', userId: sami.id }), /title/i);
});

test('createTask rejects a user that does not exist', () => {
  assert.throws(() => tasks.createTask({ title: 'X', userId: 999 }), /user/i);
});

test('getTaskById finds a task, or returns undefined', () => {
  const task = tasks.createTask({ title: 'A', userId: sami.id });

  assert.deepEqual(tasks.getTaskById(task.id), task);
  assert.equal(tasks.getTaskById(999), undefined);
});

test('listTasks can filter by status and by user', () => {
  const other = users.createUser({ name: 'Other', email: 'o@example.com' });
  const t1 = tasks.createTask({ title: 'A', userId: sami.id });
  tasks.createTask({ title: 'B', userId: sami.id });
  tasks.createTask({ title: 'C', userId: other.id });
  tasks.completeTask(t1.id);

  assert.equal(tasks.listTasks().length, 3);
  assert.equal(tasks.listTasks({ status: 'done' }).length, 1);
  assert.equal(tasks.listTasks({ userId: sami.id }).length, 2);
  assert.equal(tasks.listTasks({ userId: sami.id, status: 'todo' }).length, 1);
});

test('updateTask changes the title', () => {
  const task = tasks.createTask({ title: 'Old', userId: sami.id });
  const updated = tasks.updateTask(task.id, { title: 'New' });

  assert.equal(updated.title, 'New');
  assert.equal(tasks.getTaskById(task.id).title, 'New');
});

test('updateTask rejects an empty title and an unknown task', () => {
  const task = tasks.createTask({ title: 'A', userId: sami.id });

  assert.throws(() => tasks.updateTask(task.id, { title: '' }), /title/i);
  assert.throws(() => tasks.updateTask(999, { title: 'X' }), /not found/i);
});

test('completeTask sets status to done', () => {
  const task = tasks.createTask({ title: 'A', userId: sami.id });

  assert.equal(tasks.completeTask(task.id).status, 'done');
  assert.throws(() => tasks.completeTask(999), /not found/i);
});

test('deleteTask removes the task', () => {
  const task = tasks.createTask({ title: 'A', userId: sami.id });

  tasks.deleteTask(task.id);
  assert.equal(tasks.getTaskById(task.id), undefined);
  assert.throws(() => tasks.deleteTask(task.id), /not found/i);
});
