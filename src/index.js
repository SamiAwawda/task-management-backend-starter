// Demo: wires the two modules together and runs a few operations.

import { createUsersService } from './users/users.service.js';
import { createTasksService } from './tasks/tasks.service.js';

const users = createUsersService();
const tasks = createTasksService({ users });

const sami = users.createUser({ name: 'Sami', email: 'sami@example.com' });
const lina = users.createUser({ name: 'Lina', email: 'lina@example.com' });
console.log('Users:', users.listUsers());

const t1 = tasks.createTask({ title: 'Set up the project', userId: sami.id });
const t2 = tasks.createTask({ title: 'Write the README', userId: sami.id });
const t3 = tasks.createTask({ title: 'Review the code', userId: lina.id });
console.log('\nAll tasks:', tasks.listTasks());

tasks.completeTask(t1.id);
tasks.updateTask(t2.id, { title: 'Write a clear README' });
tasks.deleteTask(t3.id);

console.log('\nSami\'s tasks after changes:', tasks.listTasks({ userId: sami.id }));
console.log('\nDone tasks:', tasks.listTasks({ status: 'done' }));

try {
  tasks.createTask({ title: 'Ghost task', userId: 999 });
} catch (err) {
  console.log('\nExpected error:', err.message);
}
