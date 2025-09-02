'use server';

import { generateSQL } from '@/ai/flows/generate-sql-from-natural-language';
import { validateNaturalLanguageQuery } from '@/ai/flows/validate-natural-language-query';
import { query } from '@/lib/db';
import queryRepository from '@/helper/queryRepository.json';

export async function getTablesAction() {
  try {
    const tables = await query(queryRepository.queryToFetchTableInfo, []);
    return tables as any[];
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
}

export async function getTableColumnsAction(tableName: string) {
  try {
    const columns = await query(`
      SELECT 
        COLUMN_NAME as name,
        DATA_TYPE as type,
        IS_NULLABLE as nullable,
        COLUMN_DEFAULT as defaultValue,
        COLUMN_COMMENT as description
      FROM information_schema.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = '${tableName}'
      ORDER BY ORDINAL_POSITION
    `, []);
    return columns as any[];
  } catch (error) {
    console.error('Error fetching columns:', error);
    return [];
  }
}

interface WhereClause {
  column: string;
  operator: string;
  value: string;
}

export async function executeQueryAction(tableName: string, whereClauses: WhereClause[], limit: number = 100, orderByColumn?: string, orderDirection: 'asc' | 'desc' = 'asc') {
  try {
    let sql = `SELECT * FROM \`${tableName}\``;
    const params: any[] = [];

    if (whereClauses && whereClauses.length > 0) {
      const whereConditions = whereClauses.map(clause => {
        if (clause.operator === 'LIKE') {
          params.push(`%${clause.value}%`);
          return `\`${clause.column}\` LIKE ?`;
        } else {
          params.push(clause.value);
          return `\`${clause.column}\` ${clause.operator} ?`;
        }
      });
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    if (orderByColumn) {
      sql += ` ORDER BY \`${orderByColumn}\` ${orderDirection.toUpperCase()}`;
    }

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    const results = await query(sql, params);
    return results as any[];
  } catch (error) {
    console.error('Error executing query:', error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function validateQueryAction(naturalLanguageQuery: string, expectedOutput: string) {
  try {
    const tables = await getTablesAction();
    const tableNames = tables.map((t: any) => t.name).join(', ');
    return await validateNaturalLanguageQuery({
      naturalLanguageQuery,
      tableNames,
      expectedOutput,
    });
  } catch (error) {
    console.error('Error validating query:', error);
    throw error;
  }
}

export async function generateSqlAction(naturalLanguageQuery: string) {
  try {
    const tables = await getTablesAction();
    const tableNames = tables.map((t: any) => t.name);
    
    // Get column descriptions for AI
    const columnDescriptions: Record<string, string> = {};
    for (const table of tables) {
      const columns = await getTableColumnsAction(table.name);
      columnDescriptions[table.name] = columns.map((col: any) => `${col.name} (${col.type})`).join(', ');
    }
    
    return await generateSQL({
      naturalLanguageQuery,
      tableNames,
      columnDescriptions,
    });
  } catch (error) {
    console.error('Error generating SQL:', error);
    throw error;
  }
}
