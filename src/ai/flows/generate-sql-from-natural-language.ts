'use server';
/**
 * @fileOverview An AI agent that translates natural language queries into SQL.
 *
 * - generateSQL - A function that translates natural language into SQL.
 * - GenerateSQLInput - The input type for the generateSQL function.
 * - GenerateSQLOutput - The return type for the generateSQL function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSQLInputSchema = z.object({
  naturalLanguageQuery: z
    .string()
    .describe('The natural language query to translate to SQL.'),
  tableNames: z.array(z.string()).describe('The names of the tables in the database.'),
  columnDescriptions: z
    .record(z.string(), z.string())
    .describe(
      'A map of column names to descriptions, providing context for each column.'
    ),
});
export type GenerateSQLInput = z.infer<typeof GenerateSQLInputSchema>;

const WhereClauseSchema = z.object({
  column: z.string().describe('The column to filter on.'),
  operator: z.enum(['=', '!=', '>', '<', '>=', '<=', 'LIKE']).describe('The comparison operator.'),
  value: z.union([z.string(), z.number()]).transform(String).describe('The value to compare against.'),
});

const GenerateSQLOutputSchema = z.object({
  tableName: z.string().optional().describe('The name of the table to query.'),
  whereClauses: z.array(WhereClauseSchema).optional().describe('An array of WHERE clause conditions.'),
  sqlQuery: z.string().describe('The generated SQL query for display purposes.'),
  missingDataExplanation: z
    .string()
    .optional()
    .describe('An explanation of any missing or insufficient data.'),
});
export type GenerateSQLOutput = z.infer<typeof GenerateSQLOutputSchema>;

export async function generateSQL(input: GenerateSQLInput): Promise<GenerateSQLOutput> {
  return generateSQLFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSQLPrompt',
  input: {schema: GenerateSQLInputSchema},
  output: {schema: GenerateSQLOutputSchema},
  prompt: `You are an expert SQL translator. Your task is to translate a natural language query into a structured query object and a corresponding SQL query string for display.

The database contains the following tables: {{{tableNames}}}

Here is column information:
{{#each columnDescriptions}}
  {{@key}}: {{this}}
{{/each}}

Based on the user's query, determine the primary table to query and any necessary WHERE conditions.
- The 'tableName' should be one of the available tables.
- The 'whereClauses' should be an array of objects, each with 'column', 'operator', and 'value'.
- The 'operator' must be one of: '=', '!=', '>', '<', '>=', '<=', 'LIKE'.
- The 'sqlQuery' should be a valid SQL query string that reflects the structured query. This is for display only.

If the user's query asks for information that is unavailable or cannot be fulfilled with a simple WHERE clause on a single table (e.g., it requires a JOIN), set the 'missingDataExplanation' field to explain what is missing or why the query is too complex. In this case, do not return a tableName or whereClauses.

Natural Language Query: {{{naturalLanguageQuery}}}`,
});

const generateSQLFlow = ai.defineFlow(
  {
    name: 'generateSQLFlow',
    inputSchema: GenerateSQLInputSchema,
    outputSchema: GenerateSQLOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
