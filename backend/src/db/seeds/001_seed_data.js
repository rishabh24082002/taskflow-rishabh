const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('tasks').del();
  await knex('projects').del();
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 12);

  const [user] = await knex('users')
    .insert({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
    })
    .returning('*');

  const [project] = await knex('projects')
    .insert({
      name: 'Demo Project',
      description: 'Seeded project',
      owner_id: user.id,
    })
    .returning('*');

  await knex('tasks').insert([
    {
      title: 'Task 1',
      description: 'First task',
      status: 'todo',
      priority: 'low',
      project_id: project.id,
      assignee_id: user.id,
      created_by: user.id,
    },
    {
      title: 'Task 2',
      description: 'Second task',
      status: 'in_progress',
      priority: 'medium',
      project_id: project.id,
      assignee_id: user.id,
      created_by: user.id,
    },
    {
      title: 'Task 3',
      description: 'Third task',
      status: 'done',
      priority: 'high',
      project_id: project.id,
      assignee_id: user.id,
      created_by: user.id,
    },
  ]);
};