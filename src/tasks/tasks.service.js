// Tasks module: in-memory storage + simple task operations.
// It needs the users service only to check that a task's owner exists.

function cleanTitle(title) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('Task title is required');
  }
  return title.trim();
}

export function createTasksService({ users }) {
  const tasks = [];
  let nextId = 1;

  function findTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task not found: ${id}`);
    return task;
  }

  function createTask({ title, userId } = {}) {
    const cleaned = cleanTitle(title);
    if (!users.getUserById(userId)) {
      throw new Error(`User not found: ${userId}`);
    }

    const task = {
      id: nextId++,
      title: cleaned,
      status: 'todo',
      userId,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    return { ...task };
  }

  function getTaskById(id) {
    const task = tasks.find((t) => t.id === id);
    return task && { ...task };
  }

  function listTasks({ status, userId } = {}) {
    return tasks
      .filter((t) => status === undefined || t.status === status)
      .filter((t) => userId === undefined || t.userId === userId)
      .map((t) => ({ ...t }));
  }

  function updateTask(id, { title } = {}) {
    const task = findTask(id);
    if (title !== undefined) task.title = cleanTitle(title);
    return { ...task };
  }

  function completeTask(id) {
    const task = findTask(id);
    task.status = 'done';
    return { ...task };
  }

  function deleteTask(id) {
    const task = findTask(id);
    tasks.splice(tasks.indexOf(task), 1);
  }

  return { createTask, getTaskById, listTasks, updateTask, completeTask, deleteTask };
}
