/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Password: admin123 (dalam production, gunakan bcrypt untuk hash password)
  await knex('users').insert([
    { 
      username: 'admin',
      password: 'admin123', // Dalam production, hash dengan bcrypt
      name: 'Administrator',
      role: 'admin'
    }
  ]);
};
