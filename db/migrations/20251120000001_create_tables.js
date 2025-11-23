/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('products', function(table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('category', 100);
      table.decimal('price', 10, 2).notNullable();
      table.integer('stock').defaultTo(0);
      table.integer('min_stock').defaultTo(5);
      table.string('unit', 50).defaultTo('pcs');
      table.text('description');
      table.timestamps(true, true);
    })
    .createTable('sales', function(table) {
      table.increments('id').primary();
      table.string('invoice_number', 50).unique().notNullable();
      table.decimal('total_amount', 12, 2).notNullable();
      table.decimal('paid_amount', 12, 2).notNullable();
      table.decimal('change_amount', 12, 2).defaultTo(0);
      table.string('payment_method', 50).defaultTo('cash');
      table.string('customer_name', 255);
      table.timestamps(true, true);
    })
    .createTable('sale_items', function(table) {
      table.increments('id').primary();
      table.integer('sale_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();
      table.integer('quantity').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.decimal('subtotal', 12, 2).notNullable();
      table.foreign('sale_id').references('sales.id').onDelete('CASCADE');
      table.foreign('product_id').references('products.id').onDelete('RESTRICT');
    })
    .createTable('stock_movements', function(table) {
      table.increments('id').primary();
      table.integer('product_id').unsigned().notNullable();
      table.enum('type', ['in', 'out', 'adjustment']).notNullable();
      table.integer('quantity').notNullable();
      table.integer('before_stock').notNullable();
      table.integer('after_stock').notNullable();
      table.string('reference_type', 50);
      table.integer('reference_id');
      table.text('notes');
      table.timestamps(true, true);
      table.foreign('product_id').references('products.id').onDelete('CASCADE');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('stock_movements')
    .dropTableIfExists('sale_items')
    .dropTableIfExists('sales')
    .dropTableIfExists('products');
};
