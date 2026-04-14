exports.up = function (knex) {
  return knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    table.string('title').notNullable();
    table.string('description');

    table
      .enu('status', ['todo', 'in_progress', 'done'], {
        useNative: true,
        enumName: 'task_status_enum',
      })
      .defaultTo('todo');

    table
      .enu('priority', ['low', 'medium', 'high'], {
        useNative: true,
        enumName: 'task_priority_enum',
      })
      .defaultTo('medium');

    table
      .uuid('project_id')
      .notNullable()
      .references('id')
      .inTable('projects')
      .onDelete('CASCADE');

    table
      .uuid('assignee_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
      
    table.uuid('created_by')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.date('due_date');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tasks').then(() => {
    return knex.raw(`
      DROP TYPE IF EXISTS task_status_enum;
      DROP TYPE IF EXISTS task_priority_enum;
    `);
  });
};