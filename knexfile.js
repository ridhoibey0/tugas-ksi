module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      port: 5433,
      database: 'warung_pos_db',
      user: 'postgres',
      password: '12345'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};
