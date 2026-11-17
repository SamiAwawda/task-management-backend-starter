import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createUsersService } from '../src/users/users.service.js';

test('createUser returns a user with an id', () => {
  const users = createUsersService();
  const user = users.createUser({ name: 'Sami', email: 'sami@example.com' });

  assert.equal(user.id, 1);
  assert.equal(user.name, 'Sami');
  assert.equal(user.email, 'sami@example.com');
});

test('createUser gives each user a different id', () => {
  const users = createUsersService();
  const a = users.createUser({ name: 'A', email: 'a@example.com' });
  const b = users.createUser({ name: 'B', email: 'b@example.com' });

  assert.notEqual(a.id, b.id);
});

test('createUser rejects an empty name', () => {
  const users = createUsersService();
  assert.throws(() => users.createUser({ name: '  ', email: 'x@example.com' }), /name/i);
});

test('createUser rejects a bad email', () => {
  const users = createUsersService();
  assert.throws(() => users.createUser({ name: 'X', email: 'not-an-email' }), /email/i);
});

test('createUser rejects a duplicate email', () => {
  const users = createUsersService();
  users.createUser({ name: 'A', email: 'a@example.com' });
  assert.throws(
    () => users.createUser({ name: 'B', email: 'A@example.com' }),
    /already/i,
  );
});

test('getUserById finds a user, or returns undefined', () => {
  const users = createUsersService();
  const user = users.createUser({ name: 'A', email: 'a@example.com' });

  assert.deepEqual(users.getUserById(user.id), user);
  assert.equal(users.getUserById(999), undefined);
});

test('listUsers returns all users', () => {
  const users = createUsersService();
  users.createUser({ name: 'A', email: 'a@example.com' });
  users.createUser({ name: 'B', email: 'b@example.com' });

  assert.equal(users.listUsers().length, 2);
});

test('listUsers returns a copy, so outside code cannot change the store', () => {
  const users = createUsersService();
  users.createUser({ name: 'A', email: 'a@example.com' });

  users.listUsers().length = 0;
  assert.equal(users.listUsers().length, 1);
});
