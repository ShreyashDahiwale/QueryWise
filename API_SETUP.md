# QueryWise API Setup Guide

This guide will help you set up and configure the QueryWise API to connect to your local MySQL database.

## 🗄️ Database Connection Setup

### 1. MySQL Database Requirements

- **MySQL Version**: 5.7+ or MySQL 8.0+
- **Port**: Default 3306 (configurable)
- **User Permissions**: SELECT, SHOW, DESCRIBE on information_schema and target databases

### 2. Environment Configuration

Create a `.env.local` file in your project root:

```env
# Database Configuration
DB_HOST=localhost:3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

# AI Configuration (for AI features)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Optional: Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

### 3. Database User Setup

Create a MySQL user with appropriate permissions:

```sql
-- Create user
CREATE USER 'querywise_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant permissions
GRANT SELECT, SHOW, DESCRIBE ON *.* TO 'querywise_user'@'localhost';
GRANT SELECT ON information_schema.* TO 'querywise_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;
```

### 4. Test Database Connection

You can test your connection using the MySQL command line:

```bash
mysql -h localhost -u your_username -p your_database_name
```

## 🚀 API Endpoints

### Base URL
- **Development**: `http://localhost:9002`
- **Production**: `https://your-domain.com`

### Available Endpoints

#### 1. Get Database Tables
```http
GET /api/tables
```

**Response Example:**
```json
[
  {
    "name": "actor",
    "description": "Actor information"
  },
  {
    "name": "film",
    "description": "Film information"
  }
]
```

#### 2. Get Table Columns
```http
GET /api/tables/{tableName}/columns
```

**Response Example:**
```json
[
  {
    "name": "actor_id",
    "type": "smallint",
    "nullable": "NO",
    "defaultValue": null,
    "description": "Primary key for actor records"
  }
]
```

#### 3. Execute Query
```http
POST /api/query
```

**Request Body:**
```json
{
  "tableName": "actor",
  "whereClauses": [
    {
      "column": "first_name",
      "operator": "LIKE",
      "value": "John"
    }
  ],
  "limit": 50,
  "orderByColumn": "last_name",
  "orderDirection": "asc"
}
```

#### 4. Validate Natural Language Query
```http
POST /api/validate-query
```

**Request Body:**
```json
{
  "naturalLanguageQuery": "Show me all actors from California",
  "expectedOutput": "List of actors from California"
}
```

#### 5. Generate SQL from Natural Language
```http
POST /api/generate-sql
```

**Request Body:**
```json
{
  "naturalLanguageQuery": "Find all films with rating PG-13"
}
```

## 🔧 Configuration Options

### Database Connection Pool Settings

The application uses connection pooling for better performance. You can modify these settings in `src/lib/db.ts`:

```typescript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost:3306',
  database: process.env.DB_NAME || 'sakila',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  waitForConnections: true,
  connectionLimit: 10,        // Maximum connections in pool
  queueLimit: 0,              // Maximum queued requests
  acquireTimeout: 60000,      // Connection acquisition timeout (ms)
  timeout: 60000,             // Query timeout (ms)
  reconnect: true             // Auto-reconnect on connection loss
};
```

### Supported SQL Operators

The query API supports the following comparison operators:

- `=` - Equal to
- `!=` - Not equal to
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to
- `LIKE` - Pattern matching (automatically adds % wildcards)

## 📊 Sample Database Setup

### Using Sakila Sample Database

The Sakila database is a well-known sample database for MySQL. You can install it:

```bash
# Download Sakila database
wget https://downloads.mysql.com/docs/sakila-db.tar.gz

# Extract and install
tar -xzf sakila-db.tar.gz
cd sakila-db
mysql -u root -p < sakila-schema.sql
mysql -u root -p < sakila-data.sql
```

### Sample Queries

Here are some example queries you can try with the Sakila database:

1. **Get all actors:**
```json
{
  "tableName": "actor",
  "limit": 10
}
```

2. **Find films by rating:**
```json
{
  "tableName": "film",
  "whereClauses": [
    {
      "column": "rating",
      "operator": "=",
      "value": "PG-13"
    }
  ],
  "limit": 50,
  "orderByColumn": "title"
}
```

3. **Search customers by name:**
```json
{
  "tableName": "customer",
  "whereClauses": [
    {
      "column": "first_name",
      "operator": "LIKE",
      "value": "John"
    }
  ],
  "limit": 25
}
```

## 🛡️ Security Considerations

### 1. Database Security
- Use strong passwords for database users
- Limit database user permissions to only what's necessary
- Consider using SSL connections for production
- Regularly update MySQL to the latest version

### 2. API Security
- Implement authentication for production use
- Add rate limiting to prevent abuse
- Validate and sanitize all input parameters
- Use HTTPS in production

### 3. Environment Variables
- Never commit `.env.local` to version control
- Use different credentials for development and production
- Rotate database passwords regularly

## 🚨 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running and accessible on the specified port.

#### 2. Access Denied
```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user
```
**Solution**: Check username, password, and user permissions.

#### 3. Database Not Found
```
Error: ER_BAD_DB_ERROR: Unknown database
```
**Solution**: Verify the database name exists and the user has access.

#### 4. Table Not Found
```
Error: Table doesn't exist
```
**Solution**: Check if the table exists and the user has SELECT permissions.

### Debug Mode

Enable debug logging by setting the environment variable:

```env
DEBUG=true
```

This will log all database queries and connection attempts to the console.

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your database connection settings
3. Check the application logs for detailed error messages
4. Open an issue on the [GitHub repository](https://github.com/ShreyashDahiwale/QueryWise/issues)

---

**Happy Querying! 🎯**
