# Task Management Backend Starter

A small Node.js (ESM) backend starter for managing tasks and users.
All data lives **in memory**, so it resets every time the app restarts.

## Requirements

- Node.js 20 or newer (built with v26)
- No dependencies to install

## Quick start

```bash
npm start       # run the demo (src/index.js)
npm run dev     # run the demo and restart on file changes
npm test        # run the tests (Node's built-in test runner)
```

## Project structure

```
src/
  index.js                 demo: connects both modules and prints results
  users/users.service.js   Users module
  tasks/tasks.service.js   Tasks module (uses the Users module)
test/
  users.test.js
  tasks.test.js
```

Each module is a factory function (`createUsersService`, `createTasksService`)
that keeps its own in-memory list. Tasks receive the users service, so a task
can only be created for a user that exists.

## Operations

**Users**

| Function | What it does |
| --- | --- |
| `createUser({ name, email })` | Creates a user. Name is required, email must be valid and unique. |
| `getUserById(id)` | Returns the user, or `undefined`. |
| `listUsers()` | Returns all users. |

**Tasks**

| Function | What it does |
| --- | --- |
| `createTask({ title, userId })` | Creates a task with status `todo`. The user must exist. |
| `getTaskById(id)` | Returns the task, or `undefined`. |
| `listTasks({ status, userId })` | Returns tasks. Both filters are optional. |
| `updateTask(id, { title })` | Changes the title. |
| `completeTask(id)` | Sets status to `done`. |
| `deleteTask(id)` | Removes the task. |

Invalid input or an unknown id throws an `Error` with a clear message.

## Example

```js
import { createUsersService } from './src/users/users.service.js';
import { createTasksService } from './src/tasks/tasks.service.js';

const users = createUsersService();
const tasks = createTasksService({ users });

const sami = users.createUser({ name: 'Sami', email: 'sami@example.com' });
const task = tasks.createTask({ title: 'Write the README', userId: sami.id });
tasks.completeTask(task.id); // { id: 1, title: 'Write the README', status: 'done', ... }
```

## Verified output

`npm test` runs 17 tests, all passing. `npm start` creates two users and three
tasks, completes, renames and deletes some of them, then prints the results.
The last line shows the expected error when creating a task for a missing user:

```
Expected error: User not found: 999
```
