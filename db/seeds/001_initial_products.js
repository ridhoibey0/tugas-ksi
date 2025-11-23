/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('stock_movements').del();
  await knex('sale_items').del();
  await knex('sales').del();
  await knex('products').del();
  
  // Inserts seed entries
  await knex('products').insert([
    { 
      name: 'Teh Pucuk', 
      category: 'Minuman', 
      price: 4000, 
      stock: 50, 
      min_stock: 10,
      unit: 'botol',
      description: 'Teh kemasan botol 350ml'
    },
    { 
      name: 'Aqua Galon', 
      category: 'Minuman', 
      price: 20000, 
      stock: 15, 
      min_stock: 5,
      unit: 'galon',
      description: 'Air mineral galon 19 liter'
    },
    { 
      name: 'Teh Kotak', 
      category: 'Minuman', 
      price: 5000, 
      stock: 30, 
      min_stock: 10,
      unit: 'kotak',
      description: 'Teh kotak kemasan 200ml'
    },
    { 
      name: 'Beras Ramos', 
      category: 'Sembako', 
      price: 95000, 
      stock: 20, 
      min_stock: 5,
      unit: 'kg',
      description: 'Beras premium 5kg'
    },
    { 
      name: 'Minyak Goreng', 
      category: 'Sembako', 
      price: 18000, 
      stock: 25, 
      min_stock: 8,
      unit: 'liter',
      description: 'Minyak goreng kemasan 1 liter'
    },
    { 
      name: 'Gula Pasir', 
      category: 'Sembako', 
      price: 14000, 
      stock: 35, 
      min_stock: 10,
      unit: 'kg',
      description: 'Gula pasir 1kg'
    },
    { 
      name: 'Indomie Goreng', 
      category: 'Makanan', 
      price: 3500, 
      stock: 100, 
      min_stock: 20,
      unit: 'bungkus',
      description: 'Mie instan rasa goreng'
    },
    { 
      name: 'Telur Ayam', 
      category: 'Makanan', 
      price: 32000, 
      stock: 40, 
      min_stock: 10,
      unit: 'kg',
      description: 'Telur ayam negeri per kg'
    },
    { 
      name: 'Susu Ultra', 
      category: 'Minuman', 
      price: 15000, 
      stock: 24, 
      min_stock: 8,
      unit: 'kotak',
      description: 'Susu UHT 1 liter'
    },
    { 
      name: 'Roti Tawar', 
      category: 'Makanan', 
      price: 13000, 
      stock: 18, 
      min_stock: 5,
      unit: 'bungkus',
      description: 'Roti tawar sari roti'
    },
    { 
      name: 'Kopi Kapal Api', 
      category: 'Minuman', 
      price: 18000, 
      stock: 30, 
      min_stock: 8,
      unit: 'bungkus',
      description: 'Kopi bubuk sachet isi 10'
    },
    { 
      name: 'Sabun Mandi', 
      category: 'Perlengkapan', 
      price: 8000, 
      stock: 45, 
      min_stock: 15,
      unit: 'pcs',
      description: 'Sabun mandi batangan'
    },
    { 
      name: 'Shampo Sachet', 
      category: 'Perlengkapan', 
      price: 2000, 
      stock: 80, 
      min_stock: 20,
      unit: 'sachet',
      description: 'Shampo sachet berbagai merk'
    },
    { 
      name: 'Pasta Gigi', 
      category: 'Perlengkapan', 
      price: 12000, 
      stock: 25, 
      min_stock: 10,
      unit: 'pcs',
      description: 'Pasta gigi tube 75g'
    },
    { 
      name: 'Tissue', 
      category: 'Perlengkapan', 
      price: 16000, 
      stock: 20, 
      min_stock: 8,
      unit: 'pack',
      description: 'Tissue isi 250 lembar'
    }
  ]);
};
