export const tables = [
  { name: 'users', description: 'Stores user information' },
  { name: 'products', description: 'Stores product details' },
  { name: 'orders', description: 'Stores customer orders' },
];

export const columns: Record<string, { name: string; type: string; description: string }[]> = {
  users: [
    { name: 'id', type: 'INT', description: 'Unique identifier for the user' },
    { name: 'name', type: 'VARCHAR', description: 'Name of the user' },
    { name: 'email', type: 'VARCHAR', description: 'Email address of the user' },
    { name: 'signup_date', type: 'DATE', description: 'Date the user signed up' },
  ],
  products: [
    { name: 'product_id', type: 'INT', description: 'Unique identifier for the product' },
    { name: 'product_name', type: 'VARCHAR', description: 'Name of the product' },
    { name: 'price', type: 'DECIMAL', description: 'Price of the product' },
    { name: 'stock_quantity', type: 'INT', description: 'Available stock of the product' },
  ],
  orders: [
    { name: 'order_id', type: 'INT', description: 'Unique identifier for the order' },
    { name: 'user_id', type: 'INT', description: 'ID of the user who placed the order' },
    { name: 'product_id', type: 'INT', description: 'ID of the product ordered' },
    { name: 'order_date', type: 'DATE', description: 'Date the order was placed' },
    { name: 'quantity', type: 'INT', description: 'Quantity of the product ordered' },
  ],
};

export const columnDescriptionsForAI = (tableNames: string[]) => {
  const descriptions: Record<string, string> = {};
  tableNames.forEach(tableName => {
    if (columns[tableName]) {
      columns[tableName].forEach(col => {
        descriptions[`${tableName}.${col.name}`] = col.description;
      });
    }
  });
  return descriptions;
}

export const data: Record<string, Record<string, any>[]> = {
  users: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', signup_date: '2023-01-15' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', signup_date: '2023-02-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', signup_date: '2023-03-10' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', signup_date: '2023-04-05' },
  ],
  products: [
    { product_id: 101, product_name: 'Laptop Pro', price: 1200.00, stock_quantity: 50 },
    { product_id: 102, product_name: 'Wireless Mouse', price: 25.50, stock_quantity: 200 },
    { product_id: 103, product_name: 'Mechanical Keyboard', price: 75.00, stock_quantity: 150 },
    { product_id: 104, product_name: '4K Monitor', price: 450.00, stock_quantity: 75 },
  ],
  orders: [
    { order_id: 1001, user_id: 1, product_id: 101, order_date: '2023-04-01', quantity: 1 },
    { order_id: 1002, user_id: 2, product_id: 102, order_date: '2023-04-02', quantity: 2 },
    { order_id: 1003, user_id: 1, product_id: 103, order_date: '2023-04-03', quantity: 1 },
    { order_id: 1004, user_id: 3, product_id: 104, order_date: '2023-04-05', quantity: 1 },
    { order_id: 1005, user_id: 4, product_id: 101, order_date: '2023-04-06', quantity: 1 },
  ],
};
