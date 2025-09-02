#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * This script tests the MySQL database connection using the same configuration
 * as your QueryWise application.
 * 
 * Usage:
 *   node test-connection.js
 * 
 * Make sure to set up your .env.local file first!
 */

require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL Database Connection...\n');
  
  // Load environment variables
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost:3306',
    database: process.env.DB_NAME || 'sakila',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0
  };
  
  console.log('📋 Configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Password: ${dbConfig.password ? '***' : 'Not set'}\n`);
  
  try {
    // Test connection
    console.log('🔌 Attempting to connect...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connection successful!\n');
    
    // Test basic query
    console.log('📊 Testing basic query...');
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log(`   MySQL Version: ${rows[0].version}\n`);
    
    // Test database selection
    console.log('🗄️ Testing database access...');
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('   Available databases:');
    databases.forEach(db => {
      console.log(`     - ${db.Database}`);
    });
    console.log('');
    
    // Test table listing
    console.log('📋 Testing table listing...');
    const [tables] = await connection.execute(`
      SELECT 
        TABLE_NAME as name,
        TABLE_COMMENT as description
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
      LIMIT 5
    `, [dbConfig.database]);
    
    if (tables.length > 0) {
      console.log(`   Tables in ${dbConfig.database}:`);
      tables.forEach(table => {
        console.log(`     - ${table.name}${table.description ? ` (${table.description})` : ''}`);
      });
    } else {
      console.log(`   No tables found in ${dbConfig.database}`);
    }
    console.log('');
    
    // Test sample data query
    if (tables.length > 0) {
      const firstTable = tables[0].name;
      console.log(`🔍 Testing sample query on ${firstTable}...`);
      try {
        const [sampleData] = await connection.execute(`SELECT * FROM \`${firstTable}\` LIMIT 3`);
        console.log(`   Sample data from ${firstTable}:`);
        console.log(JSON.stringify(sampleData, null, 2));
      } catch (error) {
        console.log(`   ⚠️ Could not query ${firstTable}: ${error.message}`);
      }
    }
    
    await connection.end();
    console.log('\n🎉 All tests passed! Your database is ready for QueryWise.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    
    // Provide helpful suggestions
    console.log('\n💡 Troubleshooting tips:');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   - Make sure MySQL is running');
      console.log('   - Check if the port is correct');
      console.log('   - Verify MySQL is listening on the specified host');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('   - Check username and password');
      console.log('   - Verify user has proper permissions');
      console.log('   - Try connecting with mysql command line first');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('   - Database does not exist');
      console.log('   - Check database name in .env.local');
      console.log('   - Create the database if it doesn\'t exist');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   - Host not found');
      console.log('   - Check DB_HOST in .env.local');
      console.log('   - Verify network connectivity');
    }
    
    console.log('\n📚 For more help, check the API_SETUP.md file.');
    process.exit(1);
  }
}

// Check if required packages are installed
try {
  require('mysql2/promise');
} catch (error) {
  console.error('❌ mysql2 package not found!');
  console.log('   Run: npm install mysql2');
  process.exit(1);
}

// Run the test
testConnection().catch(console.error);
