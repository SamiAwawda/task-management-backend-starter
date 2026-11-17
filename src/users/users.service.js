// Users module: in-memory storage + simple user operations.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createUsersService() {
  const users = [];
  let nextId = 1;

  function createUser({ name, email } = {}) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('User name is required');
    }
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
      throw new Error('A valid user email is required');
    }

    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error(`Email already used: ${cleanEmail}`);
    }

    const user = { id: nextId++, name: name.trim(), email: cleanEmail };
    users.push(user);
    return { ...user };
  }

  function getUserById(id) {
    const user = users.find((u) => u.id === id);
    return user && { ...user };
  }

  function listUsers() {
    return users.map((u) => ({ ...u }));
  }

  return { createUser, getUserById, listUsers };
}
