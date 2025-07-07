'use server';

import { generateSQL } from '@/ai/flows/generate-sql-from-natural-language';
import { validateNaturalLanguageQuery } from '@/ai/flows/validate-natural-language-query';
import { tables, columns, data, columnDescriptionsForAI } from '@/lib/db-mock';

export async function getTablesAction() {
  return tables;
}

export async function getTableColumnsAction(tableName: string) {
  return columns[tableName] || [];
}

interface WhereClause {
  column: string;
  operator: string;
  value: string;
}

export async function executeQueryAction(tableName: string, whereClauses: WhereClause[], limit: number = 100, orderByColumn?: string, orderDirection: 'asc' | 'desc' = 'asc') {
  // Simulate DB query
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  if (!data[tableName]) {
    throw new Error(`Table "${tableName}" not found.`);
  }

  let results = data[tableName];

  if (whereClauses && whereClauses.length > 0) {
    results = results.filter(row => {
      return whereClauses.every(clause => {
        if (!clause.column || !clause.operator) return true;
        const rowValue = row[clause.column];
        const clauseValue = clause.value;

        // Handle case-insensitive comparison for strings
        const normalizedRowValue = typeof rowValue === 'string' ? rowValue.toLowerCase() : rowValue;
        const normalizedClauseValue = typeof clauseValue === 'string' ? clauseValue.toLowerCase() : clauseValue;
        const numericClauseValue = Number(clauseValue);

        switch (clause.operator) {
          case '=':
            return String(rowValue) === String(clauseValue);
          case '!=':
            return String(rowValue) !== String(clauseValue);
          case '>':
            return rowValue > numericClauseValue;
          case '<':
            return rowValue < numericClauseValue;
          case '>=':
            return rowValue >= numericClauseValue;
          case '<=':
            return rowValue <= numericClauseValue;
          case 'LIKE':
            return String(normalizedRowValue).includes(String(normalizedClauseValue));
          default:
            return true;
        }
      });
    });
  }

  if (orderByColumn && results.length > 0 && results[0].hasOwnProperty(orderByColumn)) {
    results.sort((a, b) => {
      const aValue = a[orderByColumn];
      const bValue = b[orderByColumn];

      if (aValue < bValue) {
        return orderDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return orderDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  if (limit) {
    return results.slice(0, limit);
  }

  return results;
}

export async function validateQueryAction(naturalLanguageQuery: string, expectedOutput: string) {
  const tableNames = tables.map(t => t.name).join(', ');
  return await validateNaturalLanguageQuery({
    naturalLanguageQuery,
    tableNames,
    expectedOutput,
  });
}

export async function generateSqlAction(naturalLanguageQuery: string) {
  const tableNames = tables.map(t => t.name);
  const descriptions = columnDescriptionsForAI(tableNames);
  
  return await generateSQL({
    naturalLanguageQuery,
    tableNames,
    columnDescriptions: descriptions,
  });
}
